"use strict";

var ko = require("knockout");
var base = require("../../base/vm");

var notificationBarCore = require("./core");

module.exports = notificationBarCore({
	ko: ko,
	base: base
});