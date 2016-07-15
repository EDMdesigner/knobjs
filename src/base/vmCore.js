"use strict";

module.exports = function(dependencies) {

	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	if(!dependencies.hoverBehaviour) {
		throw new Error("dependencies.hoverBehaviour is mandatory!");
	}

	if(!dependencies.focusBehaviour) {
		throw new Error("dependencies.clickBehaviour is mandatory!");
	}

	if(!dependencies.clickBehaviour) {
		throw new Error("dependencies.clickBehaviour is mandatory!");
	}

	if(!dependencies.selectBehaviour) {
		throw new Error("dependencies.selectBehaviour is mandatory!");
	}

	var ko = dependencies.ko;
	var hoverBehaviour = dependencies.hoverBehaviour;
	var focusBehaviour = dependencies.focusBehaviour;
	var clickBehaviour = dependencies.clickBehaviour;
	var selectBehaviour = dependencies.selectBehaviour;

	return function createBaseVm(config) {
		config = config || {};

		if (!config.component) {
			throw new Error("config.component is mandatory!");
		}

		if (!config.style) {
			throw new Error("config.style is mandatory!");
		}

		var component = config.component;
		var style = config.style;

		var state = ko.observable(config.state || "default");
		var variation = config.variation || "default";


		var cssClassComputed = ko.computed(function() {
			return "knob-" + component + " state-" + state() + " variation-" + variation;
		});
		var styleComputed = ko.computed(function() {
			var stateVal = state();

			return style[variation][stateVal];
		});

		var vm = {
			variation: variation,
			state: state,

			cssClass: cssClassComputed,
			style: styleComputed,

			eventHandlers: {}
		};


		function createEnabler(behaviour, props) {
			return {
				enable: function() {
					behaviour(vm, config);
				},
				disable: function() {
					props.forEach(function(prop) {
						if (vm.eventHandlers[prop]) {
							delete vm.eventHandlers[prop];
						}
					});
				}
			};
		}

		vm.behaviours = {
			hover: createEnabler(hoverBehaviour, ["mouseover", "mouseout"]),
			focus: createEnabler(focusBehaviour, ["focus", "blur"]),
			click: createEnabler(clickBehaviour, ["mousedown", "mouseup"]),
			select: createEnabler(selectBehaviour, ["mousedown", "mouseup"])
		};

		return vm;
	};
};