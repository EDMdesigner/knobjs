"use strict";

module.exports = function(dependencies) {

	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	if(!dependencies.base) {
		throw new Error("dependencies.base is mandatory!");
	}

	var ko = dependencies.ko;
	var base = dependencies.base;

	return function createButton(config) {
		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (config.click && typeof config.click !== "function") {
			throw new Error("click has to be a function!");
		}

		if (!config.label && !config.leftIcon && !config.rightIcon && !config.icon) {
			throw new Error("either label/lefticon/righticon/icon has to be given!");
		}

		config.component = "button";

		var click = config.click;
		var triggerOnHold = config.triggerOnHold || false;

		var vm = base(config);

		vm.behaviours.hover.enable();

		if (config.radio) {
			vm.behaviours.select.enable();
		} else {
			vm.behaviours.click.enable();
		}

		var timeoutId = null;
		var baseTimeout = triggerOnHold.baseTimeout || null;
		var minTimeout = triggerOnHold.minTimeout || null;
		var timeoutDecrement = triggerOnHold.timeoutDecrement || null;
		var timeout = baseTimeout;

		var decoratedClick = function() {
			click();
			timeoutId = setTimeout(function() {
				timeout -= timeoutDecrement;

				if (timeout < minTimeout) {
					timeout = minTimeout;
				}


				if (vm.state() === "active") {
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
				var state = vm.state();

				if (state !== "active" && timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = null;
					return;
				}

				if(timeoutId) {
					return;
				}

				if(state === "active") {
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
		vm.value = config.value;

		vm.click = clickCb;

		return vm;
	};
};