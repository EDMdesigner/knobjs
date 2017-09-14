/*jslint node: true */
"use strict";

var base = require("../../base/vm");
var ko = require("knockout");

var tabCore = require("./core");

module.exports = tabCore({
	base: base,
	ko: ko
});