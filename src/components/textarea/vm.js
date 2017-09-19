/*jslint node: true */
"use strict";

var ko = require("knockout");
var core = require("./core");

var dependencies = {
	ko: ko
};

module.exports = core(dependencies);
