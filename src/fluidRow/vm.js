"use strict";

var base = require("../base/vm");
var core = require("./core");

var dependencies = {
	base: base
};

module.exports = core(dependencies);