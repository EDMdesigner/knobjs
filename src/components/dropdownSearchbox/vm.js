/*jslint node: true */
"use strict";

var ko = require("knockout");
var createList = require("../list/vm");
var core = require("./core");
var extend = require("extend");

module.exports = core({
	ko: ko,
	createList: createList,
	extend: extend
});
