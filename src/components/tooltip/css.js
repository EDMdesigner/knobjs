"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

let cssTemplate = `
	.knob-tooltip-wrapper {
		position: relative;
	}
	.primary .tooltip-down{
		width: 120px;
		background-color: ${ tinycolor(config.primary) };
		color: #fff;
		text-align: center;
		padding: 5px 0;
		border-radius: 6px;

		/* Fade in tooltip */
		transition: opacity 1s;
}

	/* Tooltip arrow */
	.primary.arrow-down .tooltip-down::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 4%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: ${ tinycolor(config.primary) } transparent transparent transparent;
	}
}
`;
	return cssTemplate;
};