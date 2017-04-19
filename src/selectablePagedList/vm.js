/*jslint node: true */
"use strict";

var ko = require("knockout");
var createPagedList = require("../pagedList/vm");
var core = require("./core");

module.exports = core({
	ko: ko,
	createPagedList: createPagedList
});
