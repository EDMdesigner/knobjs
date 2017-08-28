/*jslint node: true */
"use strict";

var ko = require("knockout");
var base = require("../../base/vm");
var core = require("./core");

var dependencies = {
	ko: ko,
	base: base
};

module.exports = core(dependencies);
