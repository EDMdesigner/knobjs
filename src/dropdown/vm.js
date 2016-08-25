/*jslint node: true */
"use strict";

var ko = require("knockout");


function createButtonDropdown(config) {
	config = config || {};

	if (!config.rightIcon) {
		throw new Error("config.rightIcon element is mandatory!");
	}
	if (!config.items) {
		throw new Error("config.items element is mandatory!");
	}
	if (config.selected && !ko.isObservable(config.selected)) {
		throw new Error("config.selected has to be a knockout observable!");
	}
	if (!Array.isArray(config.items) && !ko.isObservable(config.items)) {
		throw new Error("config.items should be an array or an observableArray!");
	}
	if (Array.isArray(config.items)) {
		if (config.items.length === 0) {
			throw new Error("config.items should not be empty");
		}
	}
	if (ko.isObservable(config.items)) {
		if (config.items().length === 0) {
			throw new Error("value of config.items should not be empty");
		}
	}

	var rightIcon = ko.observable(config.rightIcon);

	var items = config.items;

	if(!ko.isObservable(items)) {
		items = ko.observableArray(items);
	}

	
	var selected = config.selected || ko.observable();
	var options = ko.computed(function() {
		var newOptions = [];
		var selectedIdx = 0;
		for (var idx = 0; idx < items().length; idx += 1) {

			if (!items()[idx].label && !items()[idx].icon) {
				throw new Error("each element of config.items has to have label and/or icon property");
			}
			if (selected.peek() !== undefined) {
				if (selected.peek().value === items()[idx].value) {
					selectedIdx = idx;
				}
			}
			newOptions.push(createOption({
				label: items()[idx].label,
				icon: items()[idx].icon,
				value: items()[idx].value
			}));
		}
		selected(newOptions[selectedIdx]);
		return newOptions;
	});
	

	// console.log(options());

	selected(options()[config.selectedIdx || 0]);

	var dropdownVisible = ko.observable(false);

	var closeDropdown = function() {
		dropdownVisible(false);
	};

	dropdownVisible.toggle = function toggleDropdownVisible(item, event) {
		if (event) {
			event.stopPropagation();
		}

		//var visible = dropdownVisible();

		dropdownVisible(!dropdownVisible());

		// should remove this when test in phantomjs
		if (typeof window === "undefined") {
			return;
		}

		if (dropdownVisible()) {
			window.addEventListener("click", closeDropdown, false);
		} else {
			window.removeEventListener("click", closeDropdown, false);
		}
	};

	function createOption(config) {
		var obj = {
			label: ko.observable(config.label),
			icon: ko.observable(config.icon),
			value: config.value,
			select: function() {
				selected(obj);
				dropdownVisible.toggle();
			}
		};

		return obj;
	}

	return {
		rightIcon: rightIcon,

		selected: selected,
		options: options,

		dropdownVisible: dropdownVisible
	};
}

module.exports = createButtonDropdown;
