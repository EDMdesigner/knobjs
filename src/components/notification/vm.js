"use strict";

var ko = require("knockout");
var extend = require("extend");
var interfaceObject = require("../../utils/notifications");
var core = require("./core");

module.exports = core({
	ko: ko,
	extend: extend,
	interfaceObject: interfaceObject
});