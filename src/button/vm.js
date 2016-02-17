/*jslint node: true */
"use strict";

var ko = require("knockout");

var base = require("../base/vm");

function createButton(config) {
	config.component = "button";

	var vm = base(config);

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;
