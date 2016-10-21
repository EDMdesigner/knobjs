"use strict";

var ko = require("knockout");

var base = require("../base/vm");
var toggleSwitchCore = require("./core");
var tinycolor = require("tinycolor2"); 

var dependencies = {
	ko: ko,
	base: base,
	tinycolor: tinycolor
};

module.exports = toggleSwitchCore(dependencies);
