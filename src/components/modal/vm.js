"use strict";
var ko = require("knockout");
var base = require("../../base/vm");

var modalCore = require("./core");

module.exports = modalCore({
	ko: ko,
	base: base
});