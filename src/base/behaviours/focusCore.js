"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	/*if(!dependencies.window) {
		throw new Error("dependencies.window is mandatory!");
	}*/

	var ko = dependencies.ko;
	//var window = dependencies.window;

	return function focusBehaviour(vm) {
		if (!vm) {
			throw new Error("vm is mandatory!");
		}

		if (!ko.isObservable(vm.state)) {
			throw new Error("vm.state has to be a knockout observable!");
		}

		function focus() {
			var actState = vm.state();

			if (actState === "disabled") {
				return;
			}

			vm.state("active");
		}

		function blur() {
			var actState = vm.state();

			if (actState === "disabled") {
				return;
			}

			vm.state("default");
		}

		if (!vm.eventHandlers) {
			vm.eventHandlers = {};
		}

		vm.eventHandlers.focus = focus;
		vm.eventHandlers.blur = blur;

		return vm;
	};
};