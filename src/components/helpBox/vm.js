"use strict";

var ko = require("knockout");

var core = require("./core");

var createHelpBox = core({
	ko: ko,
	localStorage: window.localStorage
});

module.exports = createHelpBox;