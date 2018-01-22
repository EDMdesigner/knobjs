"use strict";

var superschema = require("superschema");
//var colorjoe = require("../../../lib/colorjoe");
 
var dependencyPattern = {
	ko: "object",
	extend: "function",
	colorjoe: "function"
};

var defaultLabels = {
	currentColorLabel: "Current color: ",
	lastUsedColorsLabel: "Last used colors: ",
	colorPickerButton: "OK"
};

var configPattern = {
	labels: "optional object",
	currentColor: "observable string",
	hideCallback: "optional function"
};

module.exports = function(dependencies) {
	var checkParams = superschema.check;

	checkParams(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var extend = dependencies.extend;
	var colorjoe = dependencies.colorjoe;

	ko.bindingHandlers.colorjoe = {
		init: function(element, valueAccessor) {

			var va = valueAccessor();
			var value = ko.unwrap(va);
			var joe = colorjoe.rgb(element, value);

			element.colorjoe = joe;

			joe.on("change", function(color) {
				if (ko.isObservable(va)) {
					va(color.hex());
				}
			});

		},
		update: function(element, valueAccessor) {
			var va = valueAccessor();
			var value = ko.unwrap(va);

			element.colorjoe.set(value);
		}
	};

	return function createColorPickerBinding(config) {
		checkParams(config, configPattern, "config");

		var labels = extend(true, {}, defaultLabels, config.labels);

		var currentColor = config.currentColor;
		var hideCallback = config.hideCallback;

		setTimeout(function() {
			var joe = colorjoe.rgb("rgbPicker", currentColor());

			joe.on("change", function(color) {
				currentColor(color.hex());
			});
		}, 3000);

		var defaultArray = new Array(10);
		defaultArray.fill("ffffff");

		var lastUsedColors = ko.observableArray(defaultArray);
		
		var colorPickerButton = {
			label: defaultLabels.colorPickerButton,
			click: colorPickerButtonClick
		};

		function colorPickerButtonClick() {
			if (hideCallback) {
				hideCallback();
			}
			
			var lastColor = currentColor();
			lastUsedColors.unshift(lastColor);
			lastUsedColors.pop();	
		}
		
		return {
			labels: labels,
			currentColor: currentColor,
			hideCallback: hideCallback,
			lastUsedColors: lastUsedColors,
			colorPickerButton: colorPickerButton
		};
	};
};