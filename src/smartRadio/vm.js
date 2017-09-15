/*jslint node: true */
"use strict";

var ko = require("knockout");

function createRadio(config) {

	config = config || {};

	var selected = config.selected || ko.observable();
	var selectedIdx = config.selectedIdx || ko.observable();

	var variation = config.variation || "default";

	var items = ko.computed(function() {
		var itemList = config.items().filter(function(item) {
			return item.exists();
		});

		return itemList.map(function(item) {
			return createItemVm(item);
		});
	});

	ko.computed(function() {
		var currentItems = items();
		if (currentItems.length === 0) {
			return;
		}

		var sel = selectedIdx.peek();

		if (typeof sel === "number" && !isNaN(sel)) {
			sel = Math.floor(sel);
			sel %= currentItems.length;

			currentItems[sel].select();

		} else {
			currentItems[0].select();
		}
	});

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
				if (item.index !== undefined) {
					return item.index;
				}
				return items().indexOf(obj);
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