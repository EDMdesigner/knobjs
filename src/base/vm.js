"use strict";

var ko = require("knockout");

var hoverBehaviour = require("./behaviours/hover");
var focusBehaviour = require("./behaviours/focus");
var clickBehaviour = require("./behaviours/click");
var selectBehaviour = require("./behaviours/select");

var vmCore = require("./vmCore");

module.exports = vmCore({
	ko: ko,
	hoverBehaviour: hoverBehaviour,
	focusBehaviour: focusBehaviour,
	clickBehaviour: clickBehaviour,
	selectBehaviour: selectBehaviour
});