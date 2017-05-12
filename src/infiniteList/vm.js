/* jslint node: true */
"use strict";

var ko = require("knockout");
var createList = require("../list/vm");
var core = require("./core");

module.exports = core({
	ko: ko,
	createList: createList
});
