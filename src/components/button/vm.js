"use strict";

var ko = require("knockout");

var base = require("../../base/vm");
var buttonCore = require("./core");
var css = require("./css");

css({});

module.exports = buttonCore({
	base: base,
	ko: ko
});