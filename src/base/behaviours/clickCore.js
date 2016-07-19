"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	if(!dependencies.window) {
		throw new Error("dependencies.window in mandatory!");
	}

	var ko = dependencies.ko;
	var window = dependencies.window;

	return function clickBehaviour(vm) {
		if (!vm) {
			throw new Error("vm is mandatory!");
		}

		if (!ko.isObservable(vm.state)) {
			throw new Error("vm.state has to be a knockout observable!");
		}

		function mouseUpOnWindow() {
			vm.state("default");
			window.removeEventListener("mouseup", mouseUpOnWindow);
		}

		function mouseDown() {
			var actState = vm.state();

			if (actState === "disabled") {
				return;
			}

			vm.state("active");

			window.addEventListener("mouseup", mouseUpOnWindow);
		}

		function mouseUp() {
			var actState = vm.state();

			if (actState === "disabled") {
				return;
			}

			vm.state("hover");
			window.removeEventListener("mouseup", mouseUpOnWindow);
		}

		if (!vm.eventHandlers) {
			vm.eventHandlers = {};
		}

		vm.eventHandlers.mousedown = mouseDown;
		vm.eventHandlers.mouseup = mouseUp;

		return vm;
	};
};
