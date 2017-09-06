"use strict";

var ko = require("knockout");

var buttonCore = require("./core");
var css = require("./css");

css({});

module.exports = buttonCore({
	ko: ko
});