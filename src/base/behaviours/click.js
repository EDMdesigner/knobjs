"use strict";

var ko = require("knockout");
var clickCore = require("./clickCore");

module.exports = clickCore({
	ko: ko,
	window: window
});