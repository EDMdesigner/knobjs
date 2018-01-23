"use strict";
var ko = require("knockout");

var modalCore = require("./core");

module.exports = modalCore({
	ko: ko,
	window: window,
	document: document
});