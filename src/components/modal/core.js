"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object"
};

var configPattern = {
	visible: "observable boolean",
	beforeClose: "optional function"
};

module.exports = function(dependencies) {
	superschema.check(dependencies, dependencyPattern, "modalDependencies");

	var ko = dependencies.ko;

	return function createModal(config) {
		superschema.check(config, configPattern, "modalConfig");

		if (config.title && typeof config.title !== "string" && !ko.isObservable(config.title)) {
			throw new Error("config.title should be a string or an observable");
		}

		if (config.icon && typeof config.icon !== "string" && !ko.isObservable(config.icon)) {
			throw new Error("config.icon should be a string or an observable");
		}

		var visible = config.visible;
		var beforeClose = config.beforeClose;
		var title = config.title;
		var icon = config.icon;

		function closeButtonClick() {
			if (beforeClose && beforeClose()) {
				return;
			}
			visible(false);
		}

		visible.toggle = function() {
			visible(!visible());
		};

		return {
			visible: visible,
			title: title,
			icon: icon,
			close: closeButtonClick
		};
	};
};