/*jslint node: true */
"use strict";

var ko = require("knockout");


function createButtonDropdown (config) {
	var rightIcon = ko.observable(config.rightIcon);

	var options = ko.observableArray([]);
	for (var idx = 0; idx < config.items.length; idx += 1) {
		options.push(createOption({
			label: config.items[idx].label,
			icon: config.items[idx].icon,
			value: config.items[idx].value
		}));
	}

	var selected = config.selected || ko.observable();
	selected(options()[0]);


	var dropdownVisible = ko.observable(false);
	dropdownVisible.toggle = function toggleDropdownVisible(item, event) {
		if (event) {
			event.stopPropagation();
		}

		var visible = dropdownVisible();
		dropdownVisible(!visible);


		if (visible) {
			window.removeEventListener("click", toggleDropdownVisible, false);
		} else {
			window.addEventListener("click", toggleDropdownVisible, false);
		}
	};

	function createOption(config) {
		var obj = {
			label: ko.observable(config.label),
			icon: ko.observable(config.icon),
			value: config.value,
			select: function(item) {
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
