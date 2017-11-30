"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function createModal(config) {

		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (!ko.isObservable(config.visible)) {
			throw new Error("config.visible is mandatory and has be an observable");
		}

		if (config.beforeClose && typeof config.beforeClose !== "function") {
			throw new Error("config.beforeClose must be a function");
		}

		config = config || {};

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