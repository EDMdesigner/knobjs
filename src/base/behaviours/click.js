"use strict";

var ko = require("knockout");
var clickCore = require("./clickCore");

if(typeof window === "undefined") {
	var window = {};
}

module.exports = clickCore({
	ko: ko,
	window: window
});