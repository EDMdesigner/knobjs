"use strict";

module.exports = function createAlert(config) {
	var visible = config.visible;
	var callback = config.callback;

	var title = config.title;
	var icon = config.icon;
	var message = config.message;

	var okLabel = config.okLabel;

	function ok() {
		callback();
		visible.toggle();
	}

	return {
		visible: visible,

		title: title,
		icon: icon,
		message: message,

		okLabel: okLabel,

		ok: ok
	};
};
