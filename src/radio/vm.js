/*jslint node: true */
"use strict";

var ko = require("knockout");

function createRadio(config) {
	var vm = {};

	vm.selected = ko.observable();

	vm.items = [];

	for (var idx = 0; idx < config.items.length; idx += 1) {
		var act = config.items[idx];

		vm.items.push(createItemVm(act.label, act.icon));
	}

	vm.items[0].select();

	function createItemVm(label, icon) {
		var obj = {
			label: label,
			icon: icon,
			group: config.group,
			select: function() {
				vm.selected(obj);

			}
		};

		return obj;
	}

	return vm;
}

module.exports = createRadio;
