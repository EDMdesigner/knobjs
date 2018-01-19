"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object"
};

var configPattern = {
	currentColorInUse: "observable string"
};

module.exports = function(dependencies) {
	var checkParams = superschema.check;

	checkParams(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;

	return function createColorPickerBinding(config) {
		checkParams(config, configPattern, "config");

		var currentColorInUse = config.currentColorInUse;

		var pickerEnabled = ko.observable(false);
		
		function togglePicker() {
			if (!pickerEnabled) {
				pickerEnabled(false);
			} else {
				pickerEnabled(true);
			}
		}
		
		return {
			currentColorInUse: currentColorInUse,
			togglePicker: togglePicker,
			pickerEnabled: pickerEnabled
		};
	};
};