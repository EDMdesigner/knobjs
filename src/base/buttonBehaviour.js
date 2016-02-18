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

	function mouseDown() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function mouseUp() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("hover");
	}

	vm.eventHandlers = {
		mouseover: mouseOver,
		mouseout: mouseOut,
		mousedown: mouseDown,
		mouseup: mouseUp
	};


	return vm;
};
