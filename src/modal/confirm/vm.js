"use strict";

function createConfirmModal(config) {
	var visible = config.visible;
	var callback = config.callback;


	function ok() {
		callback(true);
	}

	function cancel() {
		callback(false);
	}

	return {
		visible: visible,

		ok: ok,
		cancel: cancel
	};
}

module.exports = createConfirmModal;