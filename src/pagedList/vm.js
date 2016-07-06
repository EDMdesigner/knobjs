/*jslint node: true */
"use strict";

var ko = require("knockout");
var createList = require("../list/vm");
var pagedListCore = require("./core");

module.exports = pagedListCore({
	ko: ko,
	createList: createList
});
