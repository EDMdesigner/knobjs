"use strict";

var ko = require("knockout");

function createHelpBox() {	

	boxEnabled = ko.observable(true);
	infoEnabled = ko.observable(false);

	hideBox = function() {
		boxEnabled(false);
		infoEnabled(true);

	};
	showBox = function() {
		boxEnabled(true);
		infoEnabled(false);
	};

	return vm = {
		boxEnabled: boxEnabled,
		infoEnabled: infoEnabled,
		hideBox: hideBox,
		showBox: showBox
	}
}

module.exports = createHelpBox;