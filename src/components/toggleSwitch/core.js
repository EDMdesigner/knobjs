"use strict";

module.exports = function(dependencies) {
	if (!dependencies) {
		throw new Error("dependencies are mandatory!");
	}

	if (!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	if (!dependencies.base) {
		throw new Error("dependencies.base is mandatory!");
	}

	var ko = dependencies.ko;
	var base = dependencies.base;
	var active = ko.observable(false);

	return function createToggleSwitch(config) {
		if (!config) {
			config = {};
		}

		if (!ko.isObservable(config.value)) {
			throw new Error("config.value is mandatory and has to be an observable!");
		}

		var vm = {};

		var tickConfig = {
			component: "toggle-tick"
		};

		var trackConfig = {
			component: "toggle-track"
		};

		// Pass the variation if given to style.js for 
		// rectangular toggleswitch buttons
		if (config.variation) {
			trackConfig.variation = config.variation;
			tickConfig.variation = config.variation;
		}

		vm.tick = base(tickConfig);
		vm.track = base(trackConfig);
		
		vm.track.behaviours.hover.enable();


		var value = config.value;
		var click = function() {
			if(active)active=false;
			else active=true;

			return active;
		};
	
		vm.value = value;
		vm.click = click;
		vm.active = active;

		return vm;
	};
};
