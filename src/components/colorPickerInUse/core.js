"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object"
};

var configPattern = {
	currentColor: "observable string"
};

module.exports = function(dependencies) {
	var checkParams = superschema.check;

	checkParams(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;

	return function createColorPickerBinding(config) {
		checkParams(config, configPattern, "config");

		var currentColor = ko.observable("#00bee6");

		var pickerEnabled = ko.observable();
		
		function togglePicker() {
			if (pickerEnabled === true) {
				pickerEnabled(false);
			} else {
				pickerEnabled(true);
			}
			
		}
		
		return {
			currentColor: currentColor,
			togglePicker: togglePicker,
			pickerEnabled: pickerEnabled
		};
	};
};