"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function createNumericInput(config) {

		if(!config) {
			throw new Error("Config is mandatory!");
		}
		if(!ko.isObservable(config.value)|| typeof config.value() !== "number") {
			throw new Error("config.value is mandatory and it should store a number");
		}
		if(typeof config.minValue !== "number" && (!ko.isObservable(config.minValue) || typeof config.minValue() !== "number")) {
			throw new Error("config.minValue is mandatory and it should be a number or an observable storing a number!");
		}
		if(typeof config.maxValue !== "number" && (!ko.isObservable(config.maxValue) || typeof config.maxValue() !== "number")) {
			throw new Error("config.maxValue is mandatory and it should be a number or an observable storing a number!");
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
		if(layoutArrangement === "back" || layoutArrangement === "split" || layoutArrangement === "front") {
			throw new Error("config.layoutArrangement can only take values: 'back'/'front'/'split'!");
		}

		function createInputDeco(config, prop) {
			var returnable = config[prop] || {};
			returnable.icon = returnable.icon || {};
			returnable.text = returnable.text || {};
			returnable.icon.value = ko.observable(ko.unwrap(returnable.icon.value || config.icon) || "");
			returnable.icon.hideOnContent = ko.unwrap(returnable.icon.hideOnContent) || false;
			returnable.icon.visible = ko.observable(true);
			returnable.text.value = ko.observable(ko.unwrap(returnable.text.value) || "");
			returnable.text.hideOnContent = ko.unwrap(returnable.text.hideOnContent) || false;
			returnable.text.visible = ko.observable(true);

			return returnable;
		}

		var left = createInputDeco(config, "left");
		var right = createInputDeco(config, "right");

		var minValue = ko.isObservable(config.minValue) ? config.minValue : ko.observable(config.minValue);
		var maxValue = ko.isObservable(config.maxValue) ? config.maxValue : ko.observable(config.maxValue);
		var validatedValue = config.value;
		var inputValue = ko.observable(validatedValue());
		var step = config.step;
		var minTimeout = config.minTimeout || 50;
		var timeoutDecrement = config.timeoutDecrement || 100;
		var baseTimeout = config.baseTimeout || 500;
		var layoutArrangement = config.layoutArrangement || "back";

		var icons = config.icons;
		var timer;
		
		ko.computed(function() {
			clearTimeout(timer);
			var val = inputValue();
			var min = minValue();
			var max = maxValue();
			
			if(!val || val === "-" || val === "+") {
				return;
			}

			var parsed = parseFloat(val);

			if(isNaN(parsed)) {
				inputValue("");
				return;
			}

			if (!(typeof val === "string" && val.match(/^[+-]?\d+\.$/))) {
				inputValue(parsed);
			}

			timer = setTimeout(function() {

				if(parsed > max) {
					inputValue(max);
					validatedValue(max);
					return;
				} 

				if(parsed < min) {
					inputValue(min);
					validatedValue(min);
					return;
				}

				validatedValue(parsed);
			}, 500);
		});

		var decreaseButton = {
			icon: icons.decrease,
			click: function() {
				if(parseFloat(inputValue()) - step > minValue()){
					inputValue(parseFloat(inputValue()) - step);
				} else {
					inputValue(minValue());
				}
			}
		};

		var increaseButton = {
			icon: icons.increase,
			click: function() {
				if(parseFloat(inputValue()) + step < maxValue()){
					inputValue(parseFloat(inputValue()) + step);
				} else {
					inputValue(maxValue());
				}
			}
		};

		var triggerOnHold = {
			minTimeout: minTimeout,
			timeoutDecrement: timeoutDecrement,
			baseTimeout: baseTimeout
		};

		return {
			inputValue: inputValue,
			increaseButton: increaseButton,
			decreaseButton: decreaseButton,
			left: left,
			right: right,
			triggerOnHold: triggerOnHold,
			layoutArrangement: layoutArrangement
		};
	};
};
