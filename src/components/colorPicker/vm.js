"use strict";

var ko = require("knockout");
var extend = require("extend");
var colorjoe = require("../../../lib/colorjoe");
var core = require("./core");

module.exports = core({
	ko: ko,
	extend: extend,
	colorjoe: colorjoe
});