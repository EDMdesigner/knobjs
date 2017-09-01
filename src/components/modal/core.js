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
	
	return function createModal(config) {

		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (config.visible && !ko.isObservable(config.visible)) {
			throw new Error("config.visible must be an observable");
		}

		config = config || {};

		var visible = config.visible;
		var title = config.title;
		var icon = config.icon;

		visible.toggle = function() {
			visible(!visible());
		};

		config.component = "modal";

		var vm = {};

		vm.visible = visible;
		vm.title = title;
		vm.icon = icon;

		return vm;
	};
};