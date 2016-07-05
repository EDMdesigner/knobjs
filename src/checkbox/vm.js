"use strict";

var ko = require("knockout");

var base = require("../base/vm");

function createCheckbox(config) {
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

	config.component = "checkbox";

	var vm = base(config);

	vm.behaviours.hover.enable();

	vm.behaviours.click.enable();

	vm.tick = ko.observable(ko.unwrap(icons.tick));
	vm.cross = ko.observable(ko.unwrap(icons.cross));
	vm.value = config.value;
	vm.click = function(){
		vm.value(!vm.value());
	};

	return vm;
}

module.exports = createCheckbox;
