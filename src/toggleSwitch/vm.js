"use strict";

var ko = require("knockout");

var base = require("../base/vm");
var toggleSwitchCore = require("./core");

var dependencies = {
	ko: ko,
	base: base
};

module.exports = toggleSwitchCore(dependencies);
