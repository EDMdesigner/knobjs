/*jslint node: true */
"use strict";

var ko = require("knockout");

module.exports = function clickBehaviour(vm) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	function mouseDown() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function mouseUp() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("hover");
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mousedown = mouseDown;
	vm.eventHandlers.mouseup = mouseUp;

	return vm;
};
