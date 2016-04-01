"use strict";

function createConfirmModal(config) {
	var visible = config.visible;
	var callback = config.callback;

	var title = config.title;
	var icon = config.icon;
	var message = config.message;

	var okLabel = config.okLabel;
	var cancelLabel = config.cancelLabel;


	function ok() {
		callback(true);
		visible.toggle();
	}

	function cancel() {
		callback(false);
		visible.toggle();
	}

	return {
		visible: visible,

		title: title,
		icon: icon,
		message: message,

		okLabel: okLabel,
		cancelLabel: cancelLabel,

		ok: ok,
		cancel: cancel
	};
}

module.exports = createConfirmModal;