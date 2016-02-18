/*jslint node: true */
"use strict";

var ko = require("knockout");

function createBaseVm(config) {
	var component = config.component;
	var state = ko.observable(config.state || "default");
	var variation = config.variation || "default";

	var style = config.style;

	var cssClassComputed = ko.computed(function() {
		return "knob-" + component + " state-" + state() + " variation-" + variation;
	});
	var styleComputed = ko.computed(function() {
		var stateVal = state();

		return style[variation][stateVal];
	});

	return {
		variation: variation,
		state: state,

		cssClass: cssClassComputed,
		style: styleComputed
	};
}

module.exports = createBaseVm;
