/*jslint node: true */
"use strict";

var ko = require("knockout");

var base = require("../../base/vm");
var inputCore = require("./core");

module.exports = inputCore({
	base: base,
	ko: ko
});