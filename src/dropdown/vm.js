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

	if (!config.selectedIdx) {
		config.selectedIdx = 0;
	}
	var selectedIdx = ko.isObservable(config.selectedIdx) ? config.selectedIdx : ko.observable(config.selectedIdx);

	
	var selected = config.selected || ko.observable();
	var options = ko.observableArray([]);
	ko.computed(function() {
		var newOptions = [];
		var currentItems = items();
		var currentSelectedIdx = selectedIdx();
		var currentSelected = options.peek()[currentSelectedIdx];
		if(!(currentSelectedIdx >= 0 && currentSelectedIdx < currentItems.length)) {
			currentSelectedIdx = 0;
		}
		var found = false;
		
		for (var idx = 0; idx < currentItems.length; idx += 1) {

			if (!currentItems[idx].label && !currentItems[idx].icon) {
				throw new Error("each element of config.items has to have label and/or icon property");
			}
			if (currentSelected) {
				if (currentSelected.value === currentItems[idx].value) {
					currentSelectedIdx = idx;
					found = true;
				}
			}
			newOptions.push(createOption({
				label: currentItems[idx].label,
				icon: currentItems[idx].icon,
				idx: idx,
				value: currentItems[idx].value
			}));
		}
		if(!found) {
			currentSelectedIdx = 0;
		}
		options(newOptions);
		selected(newOptions[currentSelectedIdx]);
		selectedIdx(currentSelectedIdx);
	});
	
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
			idx: config.idx,
			value: config.value,
			select: function() {
				selectedIdx(obj.idx);
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
