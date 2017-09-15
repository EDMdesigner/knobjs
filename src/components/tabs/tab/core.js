"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object"
};

var configPattern = {
	tabData: {
		__type: "observable",
		__value: {
			label: "observable",
			icon: "observable",
			leftIcon: "observable",
			rightIcon: "observable",
			exists: "observable"
		}
	}
};

module.exports = function(dependencies) {

	superschema.check(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;

	function createTab(config) {

		superschema.check(config, configPattern, "config");

		var tabData = config.tabData;

		var label = ko.isObservable(config.label) ? config.label : ko.observable(config.label);
		var icon = ko.isObservable(config.icon) ? config.icon : ko.observable(config.icon);
		var leftIcon = ko.isObservable(config.leftIcon) ? config.leftIcon : ko.observable(config.leftIcon);
		var rightIcon = ko.isObservable(config.rightIcon) ? config.rightIcon : ko.observable(config.rightIcon);		

		ko.computed(function() {
			tabData().label(label());
			tabData().icon(icon());
			tabData().leftIcon(leftIcon());
			tabData().rightIcon(rightIcon());
		});

		tabData().exists(true);
		
		return {
			dispose: function() {
				tabData().exists(false);
			}
		};
	}

	return createTab;
};