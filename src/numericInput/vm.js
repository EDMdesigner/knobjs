"use strict";

var ko = require("knockout");

function createNumberInput(config) {
	config = config || {};

	if(!config) {
		throw new Error("Config is mandatory!");
	}
	if(typeof config.minValue !== "number" || typeof config.minValue === "undefined") {
		throw new Error("config.minValue is mandatory and it should be a number!");
	}
	if(typeof config.maxValue !== "number" || typeof config.maxValue === "undefined") {
		throw new Error("config.maxValue is mandatory and it should be a number!");
	}
	if(typeof config.initValue !== "number" || typeof config.initValue === "undefined") {
		throw new Error("config.initValue is mandatory and it should be a number!");
	}
	if(typeof config.step !== "number" || typeof config.step === "undefined") {
		throw new Error("config.step is mandatory and it should be a number!");
	}
	if(config.prefix && typeof config.prefix !== "string") {
		throw new Error("config.prefix should be a string");
	}
	if(config.postfix && typeof config.postfix !== "string") {
		throw new Error("config.postfix should be a string");
	}
	var minValue = config.minValue;
	var maxValue = config.maxValue;
	var initValue = config.initValue;
	var step = config.step;
	var prefix = config.prefix;
	var postfix = config.postfix;

	var inputValue = ko.observable(initValue);

	ko.computed(function() {
		var val = inputValue();
		inputValue(parseFloat(val));
	});

	//var onHoldStep = step;

	var controlButtons = [
		{
			icon: "#icon-arrow-downward",
			click: function() {
				if(parseFloat(inputValue()) - step > minValue){
					inputValue(parseFloat(inputValue()) - step);
				} else {
					inputValue(minValue);
				}
			}
		},
		{
			icon: "#icon-arrow-upward",
			click: function() {
				if(parseFloat(inputValue()) + step < maxValue){
					inputValue(parseFloat(inputValue()) + step);
				} else {
					inputValue(maxValue);
				}
			}
		}
	];

	return {
		inputValue: inputValue,
		controlButtons: controlButtons,
		prefix: prefix,
		postfix: postfix,
		triggerOnHold: true
	};
}

module.exports = createNumberInput;