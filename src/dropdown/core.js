/*jslint node: true */
"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;
	//var window;

	return function createButtonDropdown(config) {
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
		if (config.selectedIdx) {
			if (!ko.isObservable(config.selectedIdx) && typeof config.selectedIdx !== "number") {
				throw new Error("config.selectedIdx has to be an observable or a number!");
			}
		}
		if (!Array.isArray(config.items) && !ko.isObservable(config.items)) {
			throw new Error("config.items should be an array or an observableArray!");
		}
		if (Array.isArray(config.items)) {
			if (config.items.length === 0) {
				throw new Error("config.items should not be empty!");
			}
		}
		if (ko.isObservable(config.items)) {
			if (config.items().length === 0) {
				throw new Error("The value of config.items should not be empty!");
			}
		}

		/*if (config.window) {
			window = config.window;
		}*/

		var rightIcon = ko.observable(config.rightIcon);

		var items = config.items;

		if(!ko.isObservable(items)) {
			items = ko.observableArray(items);
		}
		
		var selected = config.selected || ko.observable();
		var options = ko.observableArray([]);

		var initItems = items();
		for (var i = 0; i < initItems.length; i = i + 1) {
			checkItem(initItems[i]);
			options.push(createOption({
				label: initItems[i].label,
				icon: initItems[i].icon,
				idx: i,
				value: initItems[i].value
			}));
		}

		var selectedValue = ko.isObservable(config.selectedValue) ? config.selectedValue : ko.observable(config.selectedValue);
		var selectedIdx = ko.isObservable(config.selectedIdx) ? config.selectedIdx : ko.observable(config.selectedIdx);
		if (!(0 <= selectedIdx() && selectedIdx() < options().length)) {
			selectedIdx(0);
		}

		// Handles the change of selected - updates selectedIdx and selectedValue.
		ko.computed(function() {
			var currentSelected = selected();
			if (!currentSelected) {
				return;
			}
			var currentOptions = options.peek();
			var index = findIndexByValue(currentSelected.value, currentOptions);
			if (index === -1) {
				throw new Error("Dropdown: invalid selected item set!");
			}
			selectedValue(currentSelected.value);
			selectedIdx(index);
		});

		// Handles the change of selectedValue - updates selected only!
		ko.computed(function() {
			var currentValue = selectedValue();
			if (!currentValue && currentValue !== 0) {
				return;
			}
			var currentOptions = options.peek();
			if (currentOptions.length === 0) {
				return;
			}
			var newIndex = findIndexByValue(currentValue, currentOptions);
			if (newIndex === -1) {
				throw new Error("Dropdown: invalid selectedValue set!");
			}
			var newSelected = currentOptions[newIndex];
			selected(newSelected);
		});

		// Handles the change of selectedIdx - updates selected only!
		ko.computed(function() {
			var currentIndex = selectedIdx();
			if (!currentIndex && currentIndex !== 0) {
				return;
			}
			var currentOptions = options.peek();
			if (currentOptions.length === 0) {
				return;
			}
			if(!(currentIndex >= 0 && currentIndex < currentOptions.length)) {
				throw new Error("Dropdown: invalid selectedIdx set!");
			}
			var newSelected = currentOptions[currentIndex];
			selected(newSelected);
		});

		// Handles the changes of the items list
		ko.computed(function() {
			var newOptions = [];
			var currentItems = items();
			var currentIndex = selectedIdx.peek();
			var currentSelected = options.peek()[currentIndex];
			if(!(currentIndex >= 0 && currentIndex < currentItems.length)) {
				currentIndex = 0;
			}
			
			for (var idx = 0; idx < currentItems.length; idx += 1) {
				checkItem(currentItems[idx]);
				newOptions.push(createOption({
					label: currentItems[idx].label,
					icon: currentItems[idx].icon,
					idx: idx,
					value: currentItems[idx].value
				}));
			}
			options(newOptions);
			
			if (!currentSelected) {
				return;
			}
			var index = findIndexByValue(currentSelected.value, newOptions);
			if(index !== -1) {
				currentIndex = index;
			}
			selected(newOptions[currentIndex]);
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

		// Returns the index of the first item with the given value
		function findIndexByValue(value, list) {
			for (var i=0; i < list.length; i += 1) {
				if (value === list[i].value) {
					return i;
				}
			}
			return -1;
		}

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

		function checkItem(item) {
			if (item === undefined) {
				throw new Error("The items of config.items cannot be undefined!");
			}
			if (item.value === undefined) {
				throw new Error("Each element of config.items has to have a value property!");
			}
			if (!item.label && item.label !== 0 && !item.icon) {
				// Although we might default to item.value
				throw new Error("Each element of config.items has to have label and/or icon property!");
			}
		}

		return {
			rightIcon: rightIcon,

			selected: selected,
			options: options,

			dropdownVisible: dropdownVisible
		};
	};
};