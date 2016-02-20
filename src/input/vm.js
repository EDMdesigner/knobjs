/*jslint node: true */
"use strict";

var ko = require("knockout");

var base = require("../base/vm");

function createInput(config) {
	config.component = "input";
	config.type = config.type || "text";

	var vm = base(config);
	vm.behaviours.hover.enable();
	vm.behaviours.focus.enable();

	vm.type = config.type;
	vm.value = config.value || ko.observable();
	vm.hasFocus = config.hasFocus || ko.observable(false);

	if (config.keyDown) {
		vm.eventHandlers.keydown = config.keyDown;
	}

	return vm;
}

module.exports = createInput;
