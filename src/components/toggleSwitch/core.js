"use strict";

module.exports = function(dependencies) {
	if (!dependencies) {
		throw new Error("dependencies are mandatory!");
	}

	if (!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function createToggleSwitch(config) {
		if (!config) {
			config = {};
		}

		if (!ko.isObservable(config.value)) {
			throw new Error("config.value is mandatory and has to be an observable!");
		}

		var vm = {};
		var active = ko.observable(false);
		var square = ko.observable(false);

		if (config.variation === "square"){
			square(true);
		}

		var value = config.value;
		var click = function() {
			active(!active());
		};
	
		vm.value = value;
		vm.click = click;
		vm.active = active;
		vm.square = square;

		return vm;
	};
};
