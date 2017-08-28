"use strict";

var ko = require("knockout");

module.exports = function createAlert(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (typeof config.message !== "string") {
		throw new Error("config.message must be a string");
	}

	if (typeof config.okLabel !== "string") {
		throw new Error("config.okLabel must be a string");
	}

	if (!ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	if (typeof config.callback !== "function") {
		throw new Error("config.callback must be a function");
	}

	var visible = config.visible;
	var okLabel = config.okLabel;
	var callback = config.callback;

	var title = config.title || "";
	var icon = config.icon || "";
	var message = config.message;

	var okLabel = config.okLabel;

	function ok() {
		callback();
		visible(!visible());
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
