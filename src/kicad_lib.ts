/*
 * This program source code file is part of kicad-utils.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

/**
 * imported from:
 * eeschema/lib_text.cpp
 * eeschema/lib_rectangle.cpp
 * eeschema/lib_polyline.cpp
 * eeschema/lib_pin.cpp
 * eeschema/lib_field.cpp
 * eeschema/lib_draw_item.cpp
 * eeschema/lib_circle.cpp
 * eeschema/lib_arc.cpp
 */
import {
	Fill,
	TextHjustify,
	TextVjustify,
	PinOrientation,
	TextAngle,
	PinType,
	PinAttribute,
	Rect,
	Point,
	Transform,
	ReadDelimitedText,
} from "./kicad_common";

export class ParseError extends Error {
	lineNumber: number;
	constructor(message: string, public lines: Array<string>) {
		super(message);
	}
}

export class Library {
	version: number;
	components: Array<LibComponent>;

	static load(content: string): Library {
		const lines = content.split(/\r?\n/);
		const lib = new this();
		lib.parse(lines);
		return lib;
	}

	constructor() {
		this.components = [];
	}

	parse(lines: Array<string>): void {
		const totalLines = lines.length;
		const version = lines.shift();
		const LIBRARY_HEADER = "EESchema-LIBRARY Version ";
		const SUPPORTED_VERSION = 2.4;
		if (!version || version.indexOf(LIBRARY_HEADER) !== 0) {
			throw "unknwon library format";
		}
		this.version = Number(version.slice(LIBRARY_HEADER.length));
		if (this.version > SUPPORTED_VERSION) {
			throw "library format version is greater than supported version: " +
				this.version + '>' + SUPPORTED_VERSION;
		}

		try {
			let line;
			while ( (line = lines.shift()) !== undefined ) {
				if (line[0] === '#') continue;
				if (line === "") continue;
				const tokens = line.split(/ +/);
				if (tokens[0] === 'DEF') {
					this.components.push(new LibComponent(tokens.slice(1)).parse(lines));
				} else {
					throw new ParseError('unknown token', lines);
				}
			}
		} catch (e) {
			if (e instanceof ParseError) {
				e.lineNumber = totalLines - e.lines.length + 1;
				e.message += ' at line ' + e.lineNumber;
			}
			throw e;
		}
	}

	findByName(name: string) : LibComponent | null {
		const ret = this.components.find( (i) => i.name === name);
		if (!ret) {
			return null;
		}
		return ret;
	}
}

export class LibComponent {
	draw: Draw;
	fplist: Array<string>;
	aliases: Array<string>;
	field: Field0;
	fields: Array<FieldN>;

	name: string;
	reference: string;
	textOffset: number;
	drawPinnumber: boolean;
	drawPinname: boolean;
	unitCount: number;
	unitsLocked: boolean;
	optionFlag: string;

	constructor(params: Array<string>) {
		this.name = params[0];
		this.reference = params[1];
		this.textOffset = Number(params[3]);
		this.drawPinnumber = params[4] === 'Y';
		this.drawPinname   = params[5] === 'Y';
		this.unitCount     = Number(params[6]);
		this.unitsLocked = params[7] === 'Y';
		this.optionFlag = params[8];
		this.fields = [];
	}

	parse(lines: Array<string>): this {
		let line;
		while ( (line = lines.shift()) !== undefined ) {
			if (line === 'ENDDEF') break;
			const tokens = line.split(/ +/);
			if (tokens[0] === 'DRAW') {
				this.draw = new Draw().parse(lines);
			} else
			if (tokens[0] === 'ALIAS') {
				this.aliases = tokens.slice(1);
			} else
			if (tokens[0] === 'F0') {
				this.field = new Field0(tokens.slice(1));
			} else
			if (tokens[0].match(/^F\d+/)) {
				this.fields.push(new FieldN(tokens.slice(1)));
			} else
			if (tokens[0] === '$FPLIST') {
				this.fplist = [];
				while ( (line = lines.shift()) !== undefined ) {
					if (line === '$ENDFPLIST') break;
					this.fplist.push(tokens[0]);
				}
			} else {
				throw new ParseError('unknown token ' + tokens.join(' '), lines);
			}
		}

		if (this.name[0] === "~") {
			this.name = this.name.slice(1);
			this.field.visibility = false;
		}
		return this;
	}
}

export class Field0 {
	reference: string;
	pos: Point;
	textSize: number;
	textOrientation: number;
	visibility: boolean;
	hjustify: TextHjustify;
	vjustify: TextVjustify;
	italic: boolean;
	bold: boolean;

	constructor(params: Array<string>) {
		this.reference = ReadDelimitedText(params[0]);
		let posx = Number(params[1]);
		let posy = Number(params[2]);
		this.pos = new Point(posx, posy);
		this.textSize = Number(params[3]);
		this.textOrientation = params[4] === 'H' ? TextAngle.HORIZ : TextAngle.VERT;
		this.visibility = params[5] === 'V';
		this.hjustify = params[6] as TextHjustify;
		this.vjustify = params[7][0] as TextVjustify;
		this.italic   = params[7][1] === "I";
		this.bold     = params[7][2] === "B";
	}
}

export class FieldN {
	name: string;
	pos: Point;
	textSize: number;
	textOrientation: number;
	visibility: boolean;
	hjustify: TextHjustify;
	vjustify: TextVjustify;
	fieldname: string;
	italic: boolean;
	bold: boolean;

	constructor(params: Array<string>) {
		this.name = ReadDelimitedText(params[0]);
		if (this.name === "~") this.name = "";
		let posx = Number(params[1]);
		let posy = Number(params[2]);
		this.pos = new Point(posx, posy);
		this.textSize = Number(params[3]);
		this.textOrientation = params[4] === 'H' ? TextAngle.HORIZ : TextAngle.VERT;
		this.visibility = params[5] === 'V';
		this.hjustify = params[6] as TextHjustify;
		this.vjustify = params[7][0] as TextVjustify;
		this.italic   = params[7][1] === "I";
		this.bold     = params[7][2] === "B";
		this.fieldname = params[8];
	}
}

export class Draw {
	objects: Array<DrawObject> = [];

	constructor() {
	}

	parse(lines: Array<string>): this {
		let line;
		while ( (line = lines.shift()) !== undefined ) {
			if (line === 'ENDDRAW') break;
			const tokens = line.split(/ +/);
			if (tokens[0] === 'A') { // ARC
				this.objects.push(new DrawArc(tokens.slice(1)));
			} else
			if (tokens[0] === 'C') { // CIRCLE
				this.objects.push(new DrawCircle(tokens.slice(1)));
			} else
			if (tokens[0] === 'P') { // POLYLINE
				this.objects.push(new DrawPolyline(tokens.slice(1)));
			} else
			if (tokens[0] === 'S') { // SQUEARE
				this.objects.push(new DrawSquare(tokens.slice(1)));
			} else
			if (tokens[0] === 'T') { // TEXT
				this.objects.push(new DrawText(tokens.slice(1)));
			} else
			if (tokens[0] === 'X') { // PIN
				this.objects.push(new DrawPin(tokens.slice(1)));
			} else {
				throw new ParseError('unknown token', lines);
			}
		}
		return this;
	}

	getBoundingRect(): Rect | undefined {
		let rect;
		for (let o of this.objects) {
			const box = o.getBoundingBox();
			if (!rect) {
				rect = box;
			} else {
				rect = rect.merge(box);
			}
		}

		return rect;
	}
}

abstract class DrawObject {
	/**
	 * Unit identification for multiple parts per package.  Set to 0 if the
	 * item is common to all units.
	 */
	unit: number;

	/**
	 * Shape identification for alternate body styles.  Set 0 if the item
	 * is common to all body styles.  This is commonly referred to as
	 * DeMorgan style and this is typically how it is used in KiCad.
	 */
	convert: number;

	fill: Fill;

	abstract getBoundingBox(): Rect;
}

export class DrawArc extends DrawObject {
	pos: Point;
	radius: number;
	startAngle: number; // First radius angle of the arc in 0.1 degrees. 
	endAngle: number; // Second radius angle of the arc in 0.1 degrees. 
	lineWidth: number;
	start: Point;
	end: Point;

	constructor(params: Array<string>) {
		super();
		let posx = Number(params[0]);
		let posy = Number(params[1]);
		this.pos = new Point(posx, posy);
		this.radius = Number(params[2]);
		this.startAngle = Number(params[3]);
		this.endAngle = Number(params[4]);
		this.unit = Number(params[5]);
		this.convert = Number(params[6]);
		this.lineWidth = Number(params[7]);
		this.fill = params[8] as Fill || Fill.NO_FILL;
		let startx = Number(params[9]);
		let starty = Number(params[10]);
		this.start = new Point(startx, starty);
		let endx = Number(params[11]);
		let endy = Number(params[12]);
		this.end = new Point(endx, endy);
	}

	getBoundingBox(): Rect {
		const ret = new Rect(0, 0, 0, 0);
		const arcStart = this.start;
		const arcEnd   = this.end;
		const pos      = this.pos;
		const normStart = Point.sub(arcStart, pos);
		const normEnd = Point.sub(arcEnd, pos);

		if (Point.isZero(normStart) || Point.isZero(normEnd) || this.radius === 0) {
			return ret;
		}

		const transform = new Transform();

		const startPos = transform.transformCoordinate(arcStart);
		const endPos = transform.transformCoordinate(arcEnd);
		const centerPos = transform.transformCoordinate(pos);

		let [startAngle, endAngle, swap] = transform.mapAngles(this.startAngle, this.endAngle);
		if (swap) {
			[endPos.x, startPos.x] = [startPos.x, endPos.x];
			[endPos.y, startPos.y] = [startPos.y, endPos.y];
		}

		let minX = Math.min(startPos.x, endPos.x);
		let minY = Math.min(startPos.y, endPos.y);
		let maxX = Math.max(startPos.x, endPos.x);
		let maxY = Math.max(startPos.y, endPos.y);

		/* Zero degrees is a special case. */
		if ( this.startAngle === 0 )
			maxX = centerPos.x + this.radius;

		/* Arc end angle wrapped passed 360. */
		if( startAngle > endAngle )
			endAngle += 3600;

		if( startAngle <= 900 && endAngle >= 900 )          /* 90 deg */
			maxY = centerPos.y + this.radius;

		if( startAngle <= 1800 && endAngle >= 1800 )        /* 180 deg */
			minX = centerPos.x - this.radius;

		if( startAngle <= 2700 && endAngle >= 2700 )        /* 270 deg */
			minY = centerPos.y - this.radius;

		if( startAngle <= 3600 && endAngle >= 3600 )        /* 0 deg   */
			maxX = centerPos.x + this.radius;

		ret.pos1.x = minX;
		ret.pos1.y = minY;
		ret.pos2.x = maxX;
		ret.pos2.y = maxY;

		return ret;
	}
}

export class DrawCircle extends DrawObject {
	pos: Point;
	radius: number;
	lineWidth: number;
	constructor(params: Array<string>) {
		super();
		let posx = Number(params[0]);
		let posy = Number(params[1]);
		this.pos = new Point(posx, posy);
		this.radius = Number(params[2]);
		this.unit = Number(params[3]);
		this.convert = Number(params[4]);
		this.lineWidth = Number(params[5]);
		this.fill = params[6] as Fill || Fill.NO_FILL;
	}

	getBoundingBox(): Rect {
		const transform = new Transform();

		const pos1 = transform.transformCoordinate({ x: this.pos.x - this.radius, y: this.pos.y - this.radius });
		const pos2 = transform.transformCoordinate({ x: this.pos.x + this.radius, y: this.pos.y + this.radius });

		return new Rect(
			Math.min(pos1.x, pos2.x),
			Math.min(pos1.y, pos2.y),
			Math.max(pos1.x, pos2.x),
			Math.max(pos1.y, pos2.y)
		);
	}
}

export class DrawPolyline extends DrawObject {
	pointCount: number;
	lineWidth: number;
	points: Array<Point> = [];
	constructor(params: Array<string>) {
		super();
		this.pointCount = Number(params[0]);
		this.unit = Number(params[1]);
		this.convert = Number(params[2]);
		this.lineWidth = Number(params[3]);
		let points = params.slice(4, 4 + (this.pointCount * 2)).map( (i) => Number(i) );
		this.fill = params[4 + (this.pointCount * 2)] as Fill || Fill.NO_FILL;

		for (let i = 0, len = points.length; i < len; i += 2) {
			this.points.push(new Point(points[i], points[i+1]));
		}
	}

	getBoundingBox(): Rect {
		let minx, maxx;
		let miny, maxy;

		minx = maxx = this.points[0].x;
		miny = maxy = this.points[0].y;

		for (let point of this.points) {
			const x = point.x;
			const y = point.y;
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
			miny = Math.min(miny, y);
			maxy = Math.max(maxy, y);
		}

		const transform = new Transform();
		const pos1 = transform.transformCoordinate({x: minx, y: miny });
		const pos2 = transform.transformCoordinate({x: maxx, y: maxy });

		return new Rect(
			Math.min(pos1.x, pos2.x),
			Math.min(pos1.y, pos2.y),
			Math.max(pos1.x, pos2.x),
			Math.max(pos1.y, pos2.y)
		);
	}
}

export class DrawSquare extends DrawObject {
	start: Point;
	end: Point;
	lineWidth: number;
	constructor(params: Array<string>) {
		super();
		let startx = Number(params[0]);
		let starty = Number(params[1]);
		this.start = new Point(startx, starty);
		let endx = Number(params[2]);
		let endy = Number(params[3]);
		this.end = new Point(endx, endy);
		this.unit = Number(params[4]);
		this.convert = Number(params[5]);
		this.lineWidth = Number(params[6]);
		this.fill = params[7] as Fill || Fill.NO_FILL;
	}

	getBoundingBox(): Rect {
		const transform = new Transform();
		const pos1 = transform.transformCoordinate(this.start);
		const pos2 = transform.transformCoordinate(this.end);

		return new Rect(
			Math.min(pos1.x, pos2.x),
			Math.min(pos1.y, pos2.y),
			Math.max(pos1.x, pos2.x),
			Math.max(pos1.y, pos2.y)
		);
	}
}

export class DrawText extends DrawObject {
	angle: number;
	pos: Point;
	textSize: number;
	textType: number;
	text: string;
	italic: boolean;
	bold: boolean;
	hjustify: TextHjustify;
	vjustify: TextVjustify;
	constructor(params: Array<string>) {
		super();
		this.angle = Number(params[0]);
		let posx = Number(params[1]);
		let posy = Number(params[2]);
		this.pos = new Point(posx, posy);
		this.textSize = Number(params[3]);
		this.textType = Number(params[4]);
		this.unit = Number(params[5]);
		this.convert = Number(params[6]);
		if (params[7][0] === '"') {
			// quoted
			this.text = params[7].slice(1, -1).replace(/''/g, '"');
		} else {
			// not quoted
			this.text = params[7].replace(/~/g, ' ');
		}
		this.italic = params[8] === 'Italic';
		this.bold = Number(params[9]) > 0;
		this.hjustify = params[10] as TextHjustify;
		this.vjustify = params[11] as TextVjustify;
	}

	getBoundingBox(): Rect {
		// TODO
		return new Rect(
			this.pos.x - (this.angle === 0 ? this.text.length * this.textSize : 0),
			this.pos.y - (this.angle !== 0 ? this.text.length * this.textSize : 0),
			this.pos.x + (this.angle === 0 ? this.text.length * this.textSize : 0),
			this.pos.y + (this.angle !== 0 ? this.text.length * this.textSize : 0)
		);
	}
}

export class DrawPin extends DrawObject {
	name: string;
	num: string;
	pos: Point;
	length: number;
	orientation: PinOrientation;
	nameTextSize: number;
	numTextSize: number;
	pinType: PinType;
	visibility: boolean;
	attributes: Array<PinAttribute>;

	constructor(params: Array<string>) {
		super();
		this.name = params[0];
		this.num = params[1];
		let posx = Number(params[2]);
		let posy = Number(params[3]);
		this.pos = new Point(posx, posy);
		this.length = Number(params[4]);
		this.orientation = params[5] as PinOrientation;
		this.nameTextSize = Number(params[6]);
		this.numTextSize = Number(params[7]);
		this.unit = Number(params[8]);
		this.convert = Number(params[9]);
		this.pinType = params[10] as PinType;
		this.attributes = (params[11] || '').split('') as Array<PinAttribute>;
		this.visibility = this.attributes.every( (i) => i !== 'N');
	}

	getBoundingBox(): Rect {
		// TODO
		return new Rect(
			this.pos.x - this.length,
			this.pos.y - this.length,
			this.pos.x + this.length,
			this.pos.y + this.length,
		);
	}
}

