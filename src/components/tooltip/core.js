"use strict";

module.exports = function(dependencies) {

	var ko = dependencies.ko;
	ko = ko;

	return function createTooltip(config) {
		config = config || {};

		var visible = config.visible;

		var vm = {};

		vm.visible = visible;

		return vm;
	};
};