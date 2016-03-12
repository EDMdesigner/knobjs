/*jslint node: true */
"use strict";

var ko = require("knockout");

function createTab(config, componentInfo) {
	config = config || {};

	var data = config.data;
	var parent = config.parent;


	//parent.tabButtons.push("ddd");


	var vm = {};



	//child templates
	// - params - label, etc
	// - based on that we can build a knob-radio-button

	return vm;
}

module.exports = createTab;
