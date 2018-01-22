"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	window: "object"
};

var configPattern = {
	visible: "observable boolean",
	beforeClose: "optional function",
	icons: "optional object"
};

module.exports = function(dependencies) {
	superschema.check(dependencies, dependencyPattern, "modalDependencies");

	var ko = dependencies.ko;
	var window = dependencies.window;

	return function createModal(config) {
		superschema.check(config, configPattern, "modalConfig");

		if (config.title && typeof config.title !== "string" && !ko.isObservable(config.title)) {
			throw new Error("config.title should be a string or an observable");
		}

		if (config.icon && typeof config.icon !== "string" && !ko.isObservable(config.icon)) {
			throw new Error("config.icon should be a string or an observable");
		}

		if (config.icons && typeof config.icons !== "object") {
			throw new Error("config.icons should be an object");
		}

		var visible = config.visible;
		var beforeClose = config.beforeClose;
		var title = config.title;
		var icon = config.icon;
		var icons = config.icons;

		if(icons){
			var backIcon = icons.back;
		}

		var closeIconOnLeft = config.closeIconOnLeft;

		function listenToWindowClick(event) {
			event.stopPropagation();
			closeButtonClick();
		}

		function closeButtonClick() {
			if (beforeClose && beforeClose()) {
				return;
			}

			visible(false);
		}

		function listenToEscape(event) {
			if(event.key === "Escape") {
				event.stopPropagation();
				closeButtonClick();
			}
		}

		visible.toggle = function() {
			var isVisible = visible();

			if(isVisible) {
				window.removeEventListener("keypress", listenToEscape);
				window.removeEventListener("click", listenToWindowClick);
			} else {
				window.addEventListener("keypress", listenToEscape);
				window.addEventListener("click", closeButtonClick);
			}

			visible(!isVisible);
		};

		return {
			visible: visible,
			title: title,
			icon: icon,
			close: closeButtonClick,
			closeIconOnLeft: closeIconOnLeft,
			icons: icons,
			backIcon: backIcon
		};
	};
};