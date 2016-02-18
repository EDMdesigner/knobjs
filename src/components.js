/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");

registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), require("./button/style.js"));
registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), require("./input/style.js"));
registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"));
registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));
//