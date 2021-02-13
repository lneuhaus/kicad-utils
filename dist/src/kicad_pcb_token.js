"use strict";
// based on:
// include/dsnlexer.h
// common/dsnlexer.cpp 
/*
 * This program source code file is part of kicad-utils
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2007-2013 SoftPLC Corporation, Dick Hollenbeck <dick@softplc.com>
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    constructor(token, line = 0) {
        this.token = token;
        this.line = line;
    }
    is(t) {
        return this.token === t.token;
    }
    isNUMBER() {
        return /^[-+]?([0-9]*\.?[0-9]+|[0-9]+)?([eE][-+]?[0-9]+)?$/.test(this.token);
    }
    isSYMBOL() {
        // XXX : symbol is not a keyword
        return /^.+$/i.test(this.token);
    }
    toString() {
        return this.token;
    }
}
exports.Token = Token;
Token.LEFT = new Token("(");
Token.RIGHT = new Token(")");
// common/pcb.keywords 
Token.add_net = new Token("add_net");
Token.allowed = new Token("allowed");
Token.angle = new Token("angle");
Token.arc = new Token("arc");
Token.arc_segments = new Token("arc_segments");
Token.area = new Token("area");
Token.arrow1a = new Token("arrow1a");
Token.arrow1b = new Token("arrow1b");
Token.arrow2a = new Token("arrow2a");
Token.arrow2b = new Token("arrow2b");
Token.at = new Token("at");
Token.attr = new Token("attr");
Token.autoplace_cost90 = new Token("autoplace_cost90");
Token.autoplace_cost180 = new Token("autoplace_cost180");
Token.aux_axis_origin = new Token("aux_axis_origin");
Token.blind = new Token("blind");
Token.blind_buried_vias_allowed = new Token("blind_buried_vias_allowed");
Token.bold = new Token("bold");
Token.bottom = new Token("bottom");
Token.center = new Token("center");
Token.chamfer = new Token("chamfer");
Token.circle = new Token("circle");
Token.clearance = new Token("clearance");
Token.comment = new Token("comment");
Token.company = new Token("company");
Token.connect = new Token("connect");
Token.connect_pads = new Token("connect_pads");
Token.copperpour = new Token("copperpour");
Token.crossbar = new Token("crossbar");
Token.date = new Token("date");
Token.descr = new Token("descr");
Token.die_length = new Token("die_length");
Token.dimension = new Token("dimension");
Token.diff_pair_width = new Token("diff_pair_width");
Token.diff_pair_gap = new Token("diff_pair_gap");
Token.drawings = new Token("drawings");
Token.drill = new Token("drill");
Token.edge = new Token("edge");
Token.edge_width = new Token("edge_width");
Token.effects = new Token("effects");
Token.end = new Token("end");
Token.feature1 = new Token("feature1");
Token.feature2 = new Token("feature2");
Token.fill = new Token("fill");
Token.fill_segments = new Token("fill_segments");
Token.filled_polygon = new Token("filled_polygon");
Token.fillet = new Token("fillet");
Token.font = new Token("font");
Token.fp_arc = new Token("fp_arc");
Token.fp_circle = new Token("fp_circle");
Token.fp_curve = new Token("fp_curve");
Token.fp_line = new Token("fp_line");
Token.fp_poly = new Token("fp_poly");
Token.fp_text = new Token("fp_text");
Token.full = new Token("full");
Token.general = new Token("general");
Token.grid_origin = new Token("grid_origin");
Token.gr_arc = new Token("gr_arc");
Token.gr_circle = new Token("gr_circle");
Token.gr_curve = new Token("gr_curve");
Token.gr_line = new Token("gr_line");
Token.gr_poly = new Token("gr_poly");
Token.gr_text = new Token("gr_text");
Token.hatch = new Token("hatch");
Token.hide = new Token("hide");
Token.italic = new Token("italic");
Token.justify = new Token("justify");
Token.keepout = new Token("keepout");
Token.kicad_pcb = new Token("kicad_pcb");
Token.last_trace_width = new Token("last_trace_width");
Token.layer = new Token("layer");
Token.layers = new Token("layers");
Token.left = new Token("left");
Token.links = new Token("links");
Token.locked = new Token("locked");
Token.micro = new Token("micro");
Token.min_thickness = new Token("min_thickness");
Token.mirror = new Token("mirror");
Token.mod_edge_width = new Token("mod_edge_width");
Token.mod_text_size = new Token("mod_text_size");
Token.mod_text_width = new Token("mod_text_width");
Token.mode = new Token("mode");
Token.model = new Token("model");
Token.module = new Token("module");
Token.net = new Token("net");
Token.net_class = new Token("net_class");
Token.net_name = new Token("net_name");
Token.nets = new Token("nets");
Token.no = new Token("no");
Token.no_connects = new Token("no_connects");
Token.none = new Token("none");
Token.not_allowed = new Token("not_allowed");
Token.np_thru_hole = new Token("np_thru_hole");
Token.offset = new Token("offset");
Token.oval = new Token("oval");
Token.pad = new Token("pad");
Token.pads = new Token("pads");
Token.pad_drill = new Token("pad_drill");
Token.pad_size = new Token("pad_size");
Token.pad_to_mask_clearance = new Token("pad_to_mask_clearance");
Token.solder_mask_min_width = new Token("solder_mask_min_width");
Token.pad_to_paste_clearance = new Token("pad_to_paste_clearance");
Token.pad_to_paste_clearance_ratio = new Token("pad_to_paste_clearance_ratio");
Token.page = new Token("page");
Token.path = new Token("path");
Token.pcb_text_size = new Token("pcb_text_size");
Token.pcb_text_width = new Token("pcb_text_width");
Token.pcbplotparams = new Token("pcbplotparams");
Token.placed = new Token("placed");
Token.plus = new Token("plus");
Token.polygon = new Token("polygon");
Token.portrait = new Token("portrait");
Token.priority = new Token("priority");
Token.pts = new Token("pts");
Token.radius = new Token("radius");
Token.rev = new Token("rev");
Token.rect = new Token("rect");
Token.rect_delta = new Token("rect_delta");
Token.reference = new Token("reference");
Token.right = new Token("right");
Token.rotate = new Token("rotate");
Token.roundrect = new Token("roundrect");
Token.roundrect_rratio = new Token("roundrect_rratio");
Token.scale = new Token("scale");
Token.segment = new Token("segment");
Token.segment_width = new Token("segment_width");
Token.setup = new Token("setup");
Token.size = new Token("size");
Token.smd = new Token("smd");
Token.smoothing = new Token("smoothing");
Token.solder_mask_margin = new Token("solder_mask_margin");
Token.solder_paste_margin = new Token("solder_paste_margin");
Token.solder_paste_margin_ratio = new Token("solder_paste_margin_ratio");
Token.solder_paste_ratio = new Token("solder_paste_ratio");
Token.start = new Token("start");
Token.status = new Token("status");
Token.tags = new Token("tags");
Token.target = new Token("target");
Token.title = new Token("title");
Token.title_block = new Token("title_block");
Token.tedit = new Token("tedit");
Token.thermal_width = new Token("thermal_width");
Token.thermal_gap = new Token("thermal_gap");
Token.thermal_bridge_width = new Token("thermal_bridge_width");
Token.thickness = new Token("thickness");
Token.top = new Token("top");
Token.trace_width = new Token("trace_width");
Token.tracks = new Token("tracks");
Token.trace_min = new Token("trace_min");
Token.trace_clearance = new Token("trace_clearance");
Token.trapezoid = new Token("trapezoid");
Token.thru = new Token("thru");
Token.thru_hole = new Token("thru_hole");
Token.thru_hole_only = new Token("thru_hole_only");
Token.tstamp = new Token("tstamp");
Token.user = new Token("user");
Token.user_trace_width = new Token("user_trace_width");
Token.user_via = new Token("user_via");
Token.uvia_dia = new Token("uvia_dia");
Token.uvia_drill = new Token("uvia_drill");
Token.uvia_min_drill = new Token("uvia_min_drill");
Token.uvia_min_size = new Token("uvia_min_size");
Token.uvia_size = new Token("uvia_size");
Token.uvias_allowed = new Token("uvias_allowed");
Token.value = new Token("value");
Token.version = new Token("version");
Token.via = new Token("via");
Token.vias = new Token("vias");
Token.via_dia = new Token("via_dia");
Token.via_drill = new Token("via_drill");
Token.via_min_drill = new Token("via_min_drill");
Token.via_min_size = new Token("via_min_size");
Token.via_size = new Token("via_size");
Token.virtual = new Token("virtual");
Token.visible_elements = new Token("visible_elements");
Token.width = new Token("width");
Token.x = new Token("x");
Token.xy = new Token("xy");
Token.xyz = new Token("xyz");
Token.yes = new Token("yes");
Token.zone = new Token("zone");
Token.zone_45_only = new Token("zone_45_only");
Token.zone_clearance = new Token("zone_clearance");
Token.zone_connect = new Token("zone_connect");
Token.zone_type = new Token("zone_type");
Token.zones = new Token("zones");
//# sourceMappingURL=kicad_pcb_token.js.map