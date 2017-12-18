/*jslint node: true */
"use strict";

var ko = require("knockout");

function createRadio(config) {

	config = config || {};

	var selected = config.selected || ko.observable();
	var selectedIdx = config.selectedIdx || ko.observable();
	var blockView = config.view === "block";
	var inlineView = config.view === "inline";
	var variation = config.variation || "default";

	if (!ko.isObservable(config.items) && config.items.length === 0) {
		throw new Error("config.items should not be empty");
	}

	var items = ko.computed(function() {
		var itemList = ko.isObservable(config.items) ? config.items() : config.items;
		return itemList.map(function(item) {
			return createItemVm(item);
		});
	});

	ko.computed(function() {
		var currentItems = items();

		if(config.noOptionsSelected) {
			return;
		}

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

	ko.computed(function() {
		var index = selectedIdx();
		console.log("BEER", index, typeof index);
        if (typeof index === "number" && items.peek()[index]) {
            items.peek()[index].select();
        }
    });

	function createItemVm(item) {
		if (!item.label && !item.icon) {
			throw new Error("Each radiobutton has to have a label and/or icon!");
		}
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
				if (item.index !== undefined) { // This way items can define their own index if necessary - e.g used by the knob-tabs.
					return item.index;
				}
				return items().indexOf(obj);
			}
		});

		return obj;
	}

	if(config.noOptionsSelected) {
		selected(false);
	}

	return {
		items: items,
		selected: selected,
		selectedIdx: selectedIdx,
		variation: variation,
		mainBlockView: blockView,
		mainInlineView: inlineView
	};
}

module.exports = createRadio;
