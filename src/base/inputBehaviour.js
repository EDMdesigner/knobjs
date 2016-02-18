/*jslint node: true */
"use strict";

module.exports = function buttonBehaviour(vm) {
	var previousState;

	function mouseOver() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		vm.state("hover");
	}

	function mouseOut() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state(previousState);
	}

	function focus() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function blur() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("default");
	}

	vm.eventHandlers = {
		mouseover: mouseOver,
		mouseout: mouseOut,
		focus: focus,
		blur: blur
	};

	return vm;
};
