"use strict";

var ko = require("knockout");

function createModal(config) {

	var visible = config.visible;
	var title = config.title;
	var icon = config.icon;



	visible.toggle = function() {
		visible(!visible());
	};

	return {
		visible: visible,
		title: title,
		icon: icon
	};
}

module.exports = createModal;