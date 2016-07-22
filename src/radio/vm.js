/*jslint node: true */
"use strict";

var ko = require("knockout");

function createRadio(config) {

	config = config || {};

	var vm = {};

	if (config.items.length === 0) {
		throw new Error("config.items should not be empty");
	}

	vm.selected = config.selected || ko.observable();
	vm.selectedIdx = config.selectedIdx || ko.observable();

	vm.variation = config.variation || "default";

	vm.items = [];

	for (var idx = 0; idx < config.items.length; idx += 1) {

		var act = config.items[idx];

		if (!act.label && !act.icon) {
			throw new Error("each element of config.items has to have label and/or icon property");
		}

		vm.items.push(createItemVm(act.label, act.icon, act.value, idx));
	}

	var sel = vm.selectedIdx();

	if (typeof sel === "number") {
		sel = Math.floor(sel);
		sel %= vm.items.length;

		vm.items[sel].select();

	} else {
		vm.items[0].select();
	}

	function createItemVm(label, icon, value, idx) {

		var obj = {
			label: label,
			icon: icon,
			group: config.group,
			value: value,
			select: function() {
				vm.selected(obj);
				vm.selectedIdx(idx);
			},
			isSelected: ko.computed(function() {
				return idx === vm.selectedIdx();
			})
		};

		return obj;
	}

	return vm;
}

module.exports = createRadio;
