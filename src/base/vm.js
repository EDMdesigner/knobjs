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

	var previousState;
	function mouseOver() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		state("hover");
	}

	function mouseOut() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		state(previousState);
	}

	function mouseDown() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		state("active");
	}

	function mouseUp() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		state("hover");
	}

	return {
		variation: variation,
		state: state,	

		cssClass: cssClassComputed,
		style: styleComputed,

		mouseOver: mouseOver,
		mouseOut: mouseOut,
		mouseDown: mouseDown,
		mouseUp: mouseUp
	};
}

module.exports = createBaseVm;
