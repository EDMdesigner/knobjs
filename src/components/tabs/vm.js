"use strict";

var ko = require("knockout");

var core = require("./core");
var css = require("./css");

module.exports = core({
	ko: ko,
	css: css
});