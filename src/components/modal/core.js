"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object"
};

var configPattern = {
	visible: "observable boolean",
	beforeClose: "optional function",
	title: "optional string",
	icon: "optional string"
};

module.exports = function(dependencies) {
	superschema.check(dependencies, dependencyPattern, "modalDependencies");

	//var ko = dependencies.ko;

	return function createModal(config) {
		superschema.check(config, configPattern, "modalConfig");

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

		return {
			visible: visible,
			title: title,
			icon: icon,
			close: closeButtonClick
		};
	};
};