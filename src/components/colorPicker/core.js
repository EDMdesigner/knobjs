"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	extend: "function"
};

var defaultLabels = {
	currentColorLabel: "Current color: ",
	lastUsedColorsLabel: "Last used colors: ",
	colorPickerButton: "OK"
};

var configPattern = {
	labels: "optional object"
};

module.exports = function(dependencies) {
	var checkParams = superschema.check;

	checkParams(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var extend = dependencies.extend;

	return function createColorPickerBinding(config) {
		checkParams(config, configPattern, "config");

		var labels = extend(true, {}, defaultLabels, config.labels);

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
			labels: labels,
			currentColor: currentColor,
			lastUsedColors: lastUsedColors,
			colorPickerButton: colorPickerButton,
			togglePicker: togglePicker,
			pickerEnabled: pickerEnabled
		};
	};
};


