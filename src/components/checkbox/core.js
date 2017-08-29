"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	if(!dependencies.base) {
		throw new Error("dependencies.base is mandatory!");
	}

	var ko = dependencies.ko;
	//var base = dependencies.base;

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

		if (!config.icons.cross) {
			throw new Error("config.icons.cross is mandatory!");
		}

		var icons = config.icons;
		var disabled = config.disabled || false;

		config.component = "checkbox";

		var vm = {};

		vm.tick = ko.observable(ko.unwrap(icons.tick));
		vm.cross = ko.observable(ko.unwrap(icons.cross));
		vm.value = config.value;
		vm.disabled = disabled;
		vm.click = function(){
			if(disabled) {
				return;
			}

			vm.value(!vm.value());
		};

		return vm;
	};
};