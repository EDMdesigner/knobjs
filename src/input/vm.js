/*jslint node: true */
"use strict";

var ko = require("knockout");

var base = require("../base/vm");
var inputBehaviour = require("../base/inputBehaviour");

function createInput(config) {
	config.component = "input";
	config.type = config.type || "text";

	var vm = base(config);
	inputBehaviour(vm);

	vm.type = config.type;
	vm.value = config.value || ko.observable();

	return vm;
}

module.exports = createInput;
