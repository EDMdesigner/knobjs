/*jslint node: true */
"use strict";

var ko = require("knockout");

var base = require("../base/vm");

function createButton(config) {
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

	console.log(config.triggerOnHold);
	
	var triggerOnHold = config.triggerOnHold || false;
	var click = config.click;

	var vm = base(config);

	vm.behaviours.hover.enable();

	if (config.radio) {
		vm.behaviours.select.enable();
	} else {
		vm.behaviours.click.enable();
	}


	var timeoutId = null;
	var timeout = 500;
	// var timeoutMin = 50;
	// var timeoutDiff = 100;
	var x = 0;
	function decoratedClick() {
		click();
		timeoutId = setTimeout(function() {
			console.log("asdf", x);
			x += 1;
			timeout -= 100;

			if (timeout < 50) {
				timeout = 50;
			}


			if (vm.state() === "active") {
				decoratedClick();
			} else {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		}, timeout);
	}

	ko.computed(function() {
		if(timeoutId) {
			return;
		}

		if(triggerOnHold === true && vm.state() === "active") {
			timeout = 500;
			decoratedClick();
		}
	});

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.value = config.value;
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;
