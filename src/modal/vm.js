"use strict";

var base = require("../base/vm");

function createModal(config) {

	config = config || {};

	var visible = config.visible;
	var title = config.title;
	var icon = config.icon;

	visible.toggle = function() {
		visible(!visible());
	};

	config.component = "modal";

	var vm = base(config);

	vm.visible = visible;
	vm.title = title;
	vm.icon = icon;

	return vm;
}

module.exports = createModal;