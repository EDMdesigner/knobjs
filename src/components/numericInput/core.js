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
		if(typeof config.step !== "number" && (!ko.isObservable(config.step) || typeof config.step() !== "number")) {
			throw new Error("config.step is mandatory and it should be a number or an observable storing a number!");
		}
		if (config.precision) {
			if(typeof config.precision !== "number" && (!ko.isObservable(config.precision) || typeof config.precision() !== "number")) {
				throw new Error("config.precision should be a number or an observable storing a number!");
			}
		}
		if(config.prefix && typeof config.prefix !== "string") {
			throw new Error("config.prefix should be a string");
		}
		if(config.postfix && typeof config.postfix !== "string") {
			throw new Error("config.postfix should be a string");
		}
		if(config.layoutArrangement && !(config.layoutArrangement === "back" || config.layoutArrangement === "split" || config.layoutArrangement === "front")) {
			throw new Error("config.layoutArrangement can only take values: 'back'/'front'/'split'!");
		}
		if (config.updateTimeout && typeof config.updateTimeout !== "number") {
			throw new Error("config.updateTimeout has to be a number!");
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
		var stepValue = ko.isObservable(config.step) ? config.step : ko.observable(config.step);
		var reachedMinValue = ko.observable(false);
		var reachedMaxValue = ko.observable(false);

		// If precision is not given, we use the step as default.
		var precisionValue = stepValue;
		if (config.precision || config.precision === 0) {
			precisionValue = config.precision;
			precisionValue = ko.isObservable(precisionValue) ? precisionValue : ko.observable(precisionValue);
		}
		var updateTimeout = config.updateTimeout || 200;
		var validatedValue = config.value;
		var inputValue = ko.observable(validatedValue());
		var minTimeout = config.minTimeout || 50;
		var timeoutDecrement = config.timeoutDecrement || 100;
		var baseTimeout = config.baseTimeout || 500;
		var layoutArrangement = config.layoutArrangement || "back";
		var immediateEvaluation = config.immediateEvaluation || false;

		var icons = config.icons;
		var timer;

		var inputFieldValue = ko.computed({
			read: function() {
				return inputValue();
			},
			write: function(val) {
				inputValue(val);
				if(immediateEvaluation){
					inputChangeHandler();
				}
			}
		});

		function inputChangeHandler(data) {
			clearTimeout(timer); 
			var val;
			if(data){
				val = data.inputValue();
			}else{
				val = inputValue();
			}
			var min = minValue();
			var max = maxValue();
			var step = stepValue();
			var precision = precisionValue();
			//console.log(precision);

			if (min > max) {
				throw new Error("minValue cannot be greater than maxValue!");
			}

			if (step <= 0) {
				throw new Error("step has to be greater than 0!");
			}

			if (precision < 0) {
				throw new Error("precision cannot be negative!");
			}
			
			if(val === "" || val === "-" || val === "+") {
				return;
			}

			var parsed = parseFloat(val);

			if(isNaN(parsed)) {
				inputValue("");
				return;
			}

			if (!(typeof val === "string" && val.match(/^[+-]?\d+\.\d*$/))) {
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

				if (precision !== 0 && parsed !== max) {
					var rounded = min + precision * Math.round((parsed - min) / precision);
					inputValue(rounded);
					validatedValue(rounded);
					return;
				}
				validatedValue(parsed);
			}, updateTimeout); 
		}
		
		var hideOrSeekButtons = function(newVal) {
			
			if(newVal <= minValue()){
				reachedMinValue(true);
				reachedMaxValue(false);
			}
			if(newVal >= maxValue()){
				reachedMaxValue(true);
				reachedMinValue(false);
			}
			if(newVal > minValue() && newVal < maxValue()){
				reachedMaxValue(false);
				reachedMinValue(false);
			}
		};

		ko.computed(function() {
			var newVal = validatedValue();
			inputValue(newVal);
			hideOrSeekButtons(newVal);
		});

		var decreaseButton = {
			icon: icons.decrease,
			click: function() {
				var val = parseFloat(inputValue());
				if (!val && val !== 0) {
					val = validatedValue();
				}	
				var step = stepValue();
				var min = minValue();
				if(val - step > min){
					validatedValue(val - step);
					reachedMinValue(false);
				} else {
					validatedValue(min);
					reachedMinValue(true);
				}
				reachedMaxValue(false);
				inputChangeHandler();
				hideOrSeekButtons(val);
			}
		};

		var increaseButton = {
			icon: icons.increase,
			click: function() {
				var val = parseFloat(inputValue());
				if (!val && val !== 0) {
					val = validatedValue();
				}	
				var step = stepValue();
				var max = maxValue();
				if(val + step < max){
					validatedValue(val + step);
					reachedMaxValue(false);
				} else {
					validatedValue(max);
					reachedMaxValue(true);
				}
				reachedMinValue(false);
				inputChangeHandler();
				hideOrSeekButtons(val);
			}
		};

		var triggerOnHold = {
			minTimeout: minTimeout,
			timeoutDecrement: timeoutDecrement,
			baseTimeout: baseTimeout
		};

		ko.bindingHandlers.enterkey = {
			init: function (element, valueAccessor) {
				let called = false;
				const callback = valueAccessor();
		
				const confirmCallback = function(event) {
					if (!called && (event.key === "Enter" || event.keyCode === 13)) {
						callback();
						called = true;
						return false;		
					}
					return true;
				};
		
				window.addEventListener("keydown", confirmCallback);
		
				ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
					window.removeEventListener("keydown", confirmCallback);
				});
			}
		};

		return {
			inputFieldValue: inputFieldValue,
			inputValue: inputValue,
			inputChangeHandler: inputChangeHandler,
			increaseButton: increaseButton,
			decreaseButton: decreaseButton,
			left: left,
			right: right,
			triggerOnHold: triggerOnHold,
			layoutArrangement: layoutArrangement,
			reachedMinValue: reachedMinValue,
			reachedMaxValue: reachedMaxValue,
			immediateEvaluation: immediateEvaluation
		};
	};
};
