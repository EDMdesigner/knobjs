"use strict";

var ko = require("knockout");

function createHelpBox() {	

	var vm = {};

	vm.boxEnabled = ko.observable(true);
	vm.infoEnabled = ko.observable(false);

	vm.hideBox = function() {
		vm.boxEnabled(false);
		vm.infoEnabled(true);

	};
	vm.showBox = function() {
		vm.boxEnabled(true);
		vm.infoEnabled(false);
	};

	return vm;
}

module.exports = createHelpBox;