"use strict";

module.exports = function() {
	let cssTemplate = `
		[class^=knob-],
		[class^=knob-] *,
		[class^=knob-]:before,
		[class^=knob-]:after {
			box-sizing: border-box;
		}
	`;
	
	return cssTemplate;
};