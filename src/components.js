/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");
var baseVm = require("./base/vm");

var createButtonStyle = require("./button/style");
var createInputStyle = require("./input/style");


function initKnob(theme) {

	var buttonStyle = createButtonStyle(theme);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(theme));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"));
	registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
	registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"), buttonStyle);
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//