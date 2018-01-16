"use strict";

module.exports = function(dependencies) {

	var ko = dependencies.ko;

	return function createColorPickerBinding() {

		var defaultLabels = {
			currentColorLabel: "Current color: ",
			lastUsedColorsLabel: "Last used colors: ",
			colorPickerButton: "OK"
		};

		var currentColor = ko.observable("dddddd");

		var defaultArray = new Array(10);
		defaultArray.fill("ffffff");

		var lastUsedColors = ko.observableArray(defaultArray);

		ko.computed(function() {
			var lastColor = currentColor();
			lastUsedColors.unshift(lastColor);
			lastUsedColors.pop();
		});

		var colorPickerButton = {
			label: defaultLabels.colorPickerButton,
			click: colorPickerButtonClick
		};

		var pickerEnabled = ko.observable(false);

		function colorPickerButtonClick() {
			pickerEnabled(false);
		}

		function togglePicker() {
			if (!pickerEnabled) {
				pickerEnabled(false);
			}
			pickerEnabled(true);
		}
		
		return {
			defaultLabels: defaultLabels,
			currentColor: currentColor,
			lastUsedColors: lastUsedColors,
			colorPickerButton: colorPickerButton,
			togglePicker: togglePicker,
			pickerEnabled: pickerEnabled
		};
	};
};


