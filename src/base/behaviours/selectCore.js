"use strict";

var vms = {};

module.exports = function(dependencies) {

	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function selectBehaviour(vm, config) {
		if (!vm) {
			throw new Error("vm is mandatory!");
		}

		if(!ko.isObservable(vm.state)) {
			throw new Error("vm.state has to be a knockout observable!");
		}

		config = config || {};

		var group = config.group || "default";

		if (!vms[group]) {
			vms[group] = [];
		}

		vms[group].push(vm);

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

			var actGroupVms = vms[group];

			for (var idx = 0; idx < actGroupVms.length; idx += 1) {
				var actVm = actGroupVms[idx];

				if (actVm === vm) {
					continue;
				}

				actVm.state("default");
			}
		}

		if (!vm.eventHandlers) {
			vm.eventHandlers = {};
		}

		vm.eventHandlers.mousedown = mouseDown;
		vm.eventHandlers.mouseup = mouseUp;

		return vm;
	};
};