"use strict";

var ko = require("knockout");

var base = require("../base/vm");
var buttonCore = require("./core"); 

module.exports = buttonCore({
	base: base,
	ko: ko
});
