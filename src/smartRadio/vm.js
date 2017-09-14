/*jslint node: true */
"use strict";

var ko = require("knockout");

function createRadio(config) {

	config = config || {};

	var selected = config.selected || ko.observable();
	var selectedIdx = config.selectedIdx || ko.observable();

	var variation = config.variation || "default";

	var items = ko.computed(function() {
		var itemList = config.items();
		return itemList.map(function(item) {
			return createItemVm(item);
		});
	});

	var sel = selectedIdx();

	if (typeof sel === "number") {
		sel = Math.floor(sel);
		sel %= items.length;

		items[sel].select();

	} else {
		items[0].select();
	}

	function createItemVm(item) {

		var obj = {
			label: item.label,
			icon: item.icon,
			group: config.group,
			value: item.value,
			select: function() {
				selected(obj);
				selectedIdx(obj.index);
			},
			isSelected: ko.computed(function() {
				return obj === selected();
			})
		};

		Object.defineProperty(obj, "index", {
			get: function() {
				return items.indexOf(obj);
			}
		});

		return obj;
	}

	return {
		items: items,
		selected: selected,
		selectedIdx: selectedIdx,
		variation: variation
	};
}

module.exports = createRadio;
