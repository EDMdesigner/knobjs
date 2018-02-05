"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	window: "object",
	document: "object"
};

var configPattern = {
	visible: "observable boolean",
	beforeClose: "optional function",
	icons: "optional object"
};

var activeModals = []; //to track shown modals and only hide the last one which became active

module.exports = function(dependencies) {
	superschema.check(dependencies, dependencyPattern, "modalDependencies");

	const ko = dependencies.ko;
	const window = dependencies.window;

	function listenToEscape(event) {
		window.removeEventListener("keydown", listenToEscape);
		if (activeModals.length === 0) {
			return;
		}

		if (event.key === "Escape" || event.keyCode === 27) {
			event.stopPropagation();
			activeModals[activeModals.length - 1].closeButtonClick();
		}
		return true;
	}

	window.addEventListener("beforeunload", (event) => {
		if(activeModals.length > 0 && activeModals.some(item => typeof item.closeButtonClick === "function")) {
			event.returnValue = true;
		}
	});
	window.addEventListener("keyup", () => window.addEventListener("keydown", listenToEscape));
	window.addEventListener("keydown", listenToEscape);

	return function createModal(config, componentInfo) {
		superschema.check(config, configPattern, "modalConfig");

		if (config.title && typeof config.title !== "string" && !ko.isObservable(config.title)) {
			throw new Error("config.title should be a string or an observable");
		}

		if (config.icon && typeof config.icon !== "string" && !ko.isObservable(config.icon)) {
			throw new Error("config.icon should be a string or an observable");
		}

		var visible = config.visible;
		var beforeClose = config.beforeClose;
		var title = ko.unwrap(config.title);
		var icon = config.icon;
		var icons = config.icons;

		let actualComponent = {};

		if (icons) {
			var backIcon = icons.back;
		}

		var closeIconOnLeft = config.closeIconOnLeft;

		function closeButtonClick() {
			if (beforeClose && beforeClose()) {
				return;
			}

			visible(false);
		}

		ko.computed(function () {
			var isVisible = visible();

			if (isVisible) {
				actualComponent = {
					title,
					closeButtonClick,
					beforeClose
				};

				activeModals.push(actualComponent);
			}
		}, null, {
			disposeWhenNodeIsRemoved: componentInfo.element
		});

		visible.toggle = function () {
			var isVisible = visible();

			visible(!isVisible);
		};

		return {
			visible: visible,
			title: title,
			icon: icon,
			close: closeButtonClick,
			closeIconOnLeft: closeIconOnLeft,
			icons: icons,
			backIcon: backIcon,
			listenToEscape: listenToEscape,
			activeModals: activeModals,
			dispose: () => {
				activeModals = activeModals.filter(item => item !== actualComponent);
			}
		};
	};
};