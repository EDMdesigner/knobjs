"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function createCheckbox(config) {
		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (!config.value || !ko.isObservable(config.value)) {
			throw new Error("config.value is mandatory and must be an observable!");
		}

		if (!config.icons || typeof config.icons !== "object") {
			throw new Error("config.icons is mandatory and must be an object!");
		}

		if (!config.icons.tick) {
			throw new Error("config.icons.tick is mandatory!");
		}

		var icons = config.icons;
		var disabled = config.disabled || false;
		var variation = config.variation;
		

		config.component = "checkbox";

		var vm = {};

		vm.tick = ko.observable(ko.unwrap(icons.tick));
		vm.plus = ko.observable(ko.unwrap(icons.plus));
		vm.minus = ko.observable(ko.unwrap(icons.minus));
		vm.value = config.value;
		vm.disabled = disabled;
		vm.click = function(){
			if(disabled) {
				return;
			}

			vm.value(!vm.value());
		};
		vm.normalValue = ko.computed(function() {
			if(variation === "normal" && vm.value()) {
				return true;
			}
			return false;				
		});
		vm.itemValue = ko.computed(function() {
			if(variation === "item" && vm.value()) {
				return true;
			}
			return false;				
		});
		vm.itemNotValue = ko.computed(function() {
			if(variation === "item" && !vm.value()) {
				return true;
			}
			return false;				
		});		

		return vm;
	};
};