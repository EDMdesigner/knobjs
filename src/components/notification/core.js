"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	extend: "function",
	interfaceObject: "object"
};

var configPattern = {
	labels: "optional object"
};

var defaultLabels = {
	error: "Error",
	warning: "Warning",
	success: ""
};
var defaultTTL = 10000; // in ms
var maxLoadingTTL = 20000; // in ms

module.exports = function(dependencies) {
	superschema.check(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var extend = dependencies.extend;
	var interfaceObject = dependencies.interfaceObject;

	return function createNotificationHandler(config) {
		superschema.check(config, configPattern, "config");

		var labels = extend(true, {}, defaultLabels, config.labels);

		var notifications = ko.observableArray();

		function insert(message, variation, ttl) {
			var item = {
				message: message,
				variation: variation
			};

			item.remove = function() {
				var index = notifications().indexOf(item);
				if (index === -1) {
					return;
				}
				notifications.splice(index, 1);
			};

			notifications.push(item);
			setTimeout(item.remove, ttl);
			return item;
		}

		interfaceObject.showError = function showError(message, ttl) {
			return insert(message, "error", ttl || defaultTTL);
		};

		interfaceObject.showSuccess = function showError(message, ttl) {
			return insert(message, "success", ttl || defaultTTL);
		};

		interfaceObject.showWarning = function showError(message, ttl) {
			return insert(message, "warning", ttl || defaultTTL);
		};

		interfaceObject.showLoading = function showError(message, ttl) {
			return insert(message, "loading", ttl || maxLoadingTTL);
		};

		return {
			notifications: notifications,
			labels: labels
		};
	};
};