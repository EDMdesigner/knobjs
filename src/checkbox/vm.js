"use strict";

var ko = require("knockout");

var base = require("../base/vm");
var checkboxCore = require("./core");

module.exports = checkboxCore({
	base: base,
	ko: ko
});
