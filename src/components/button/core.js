"use strict";

module.exports = function(dependencies) {

	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	const ko = dependencies.ko;

	return function createButton(config) {
		const window = dependencies.window;

		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (config.click && typeof config.click !== "function") {
			throw new Error("click has to be a function!");
		}

		if (!config.label && !config.leftIcon && !config.rightIcon && !config.icon) {
			throw new Error("either label/lefticon/righticon/icon has to be given!");
		}

		var click = config.click;
		var triggerOnHold = config.triggerOnHold || false;

		var disabled = config.disabled || false;


		var vm = {};

		var timeoutId = null;
		var baseTimeout = triggerOnHold.baseTimeout || null;
		var minTimeout = triggerOnHold.minTimeout || null;
		var timeoutDecrement = triggerOnHold.timeoutDecrement || null;
		var timeout = baseTimeout;
		var currentStyle = ko.observable("default");
		vm.currentStyle = currentStyle;

		window.addEventListener("mouseup", (event) => {
			event.stopPropagation();
			currentStyle("default");
		});
		
		var decoratedClick = function() {
			click();
			timeoutId = setTimeout(function() {
				timeout -= timeoutDecrement;

				if (timeout < minTimeout) {
					timeout = minTimeout;
				}


				if (vm.currentStyle() === "active") {
					decoratedClick();
				} else {
					clearTimeout(timeoutId);
					timeoutId = null;
				}
			}, timeout);
		};

		var clickCb;
		
		if (triggerOnHold) {
			ko.computed(function() {
				if (vm.currentStyle() === "active" && timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = null;
					return;
				}

				if(timeoutId) {
					return;
				}

				if(vm.currentStyle() === "active") {
					timeout = baseTimeout;
					decoratedClick();
				}
			});
			
			clickCb = function() {};
			
		} else {
			clickCb = click;
		}

		vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
		vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
		vm.label = ko.isObservable(config.label) ? config.label : ko.observable(config.label);
		vm.leftImage = ko.observable(config.leftImage);
		vm.rightImage = ko.observable(config.rightImage);
		vm.value = config.value;
		vm.disabled = disabled;

		vm.click = clickCb;

		vm.counter = config.counter || ko.observable(false);
		vm.actualNumber = config.actualNumber;
		vm.limitNumber = config.limitNumber;

		return vm;
	};
};