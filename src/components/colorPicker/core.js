
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

		function colorPickerButtonClick() {
			pickerEnabled(false);
		}

		var pickerEnabled = ko.observable(false);

		function togglePicker() {
			if (!pickerEnabled) {
				pickerEnabled(false);
			}
			pickerEnabled(true);

			/*
			if (pickerEnabled) {
				pickerEnabled(true);
			}
			*/
		}
		/*
		function hidePicker() {
			if (!pickerEnabled) {
				return;
			}

			pickerEnabled(false);
		}
		*/
		return {
			defaultLabels: defaultLabels,

			currentColor: currentColor,
			//backgroundColor: backgroundColor,
			lastUsedColors: lastUsedColors,
			//curColor: curColor,

			colorPickerButton: colorPickerButton,
			//chosenColor: chosenColor,
			//showPicker: showPicker,
			//hidePicker: hidePicker,
			togglePicker: togglePicker,
			pickerEnabled: pickerEnabled
		};
	};
};


