/*jslint node: true */
"use strict";

var ko = require("knockout");

var base = require("../base/vm");
var buttonBehaviour = require("../base/buttonBehaviour");

function createButton(config) {
	config.component = "button";

	var vm = base(config);

	buttonBehaviour(vm);

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;
