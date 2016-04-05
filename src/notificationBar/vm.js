"use strict";
var ko = require("knockout");
var base = require("../base/vm");

function createNotification(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (!config.message) {
		throw new Error("config.message element is mandatory!");
	}

	if (config.visible && !ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	config = config || {};

	var visible = config.visible;
	var message = config.message;
	var icon = config.icon;

	visible.toggle = function() {
		visible(!visible());
	};

	config.component = "notification";

	var vm = base(config);

	vm.visible = visible;
	vm.message = message;
	vm.icon = icon;

	return vm;
}

module.exports = createNotification;