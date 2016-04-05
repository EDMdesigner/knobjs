/*jslint node: true */
"use strict";
var ko = require("knockout");
var base = require("../../base/vm");

function createTab(config) {
	config = config || {};
	config.component = "tab";
	config.variation = "tab";
	config.state = "active";

	var vm = base(config);

	vm.notificationVisible = config.visible;

	return vm;
}

module.exports = createTab;
