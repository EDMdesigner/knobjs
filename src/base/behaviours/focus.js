"use strict";

var ko = require("knockout");
var focusCore = require("./focusCore");

/*if(typeof window === "undefined") {
	var window = {};
}*/

module.exports = focusCore({
	ko: ko
	//window: window
});