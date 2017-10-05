"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var width = document.getElementsByClassName("tooltip").offsetWidth;
var height = document.getElementsByClassName("tooltip").offsetHeight;

width = width;
height = height;

let cssTemplate = `
	.knob-tooltip-wrapper {
		position: relative;
		display: inline-block;
	}
	.tooltip {
		width: 100%;
		padding: 10px;
		display: inline-block;
		color: #fff;
		text-align: center;
		padding: 5px 0;
		border-radius: 6px;

		/* Fade in tooltip */
		transition: opacity 1s;
		box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2), 0 0px 0px 0 rgba(0,0,0,0.19);
	}

	.arrow-down .tooltip::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
	}

	.arrow-left .tooltip::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 0;
		margin-left: -10px;
		margin-top: -4px;
		border-width: 5px;
		border-style: solid;
	}

	.arrow-right .tooltip::after {
		content: "";
		position: absolute;
		top: 50%;
		right: 0;
		margin-right: -10px;
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
	}

	.arrow-up .tooltip::after {
		content: "";
		position: absolute;
		bottom: 100%;
		left: 15px;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
	}

	.primary .tooltip{
		background-color: ${ tinycolor(config.primary) };
		
	}
	/* Tooltip arrow */
	.primary.arrow-down .tooltip::after {
		border-color: ${ tinycolor(config.primary) } transparent transparent transparent;
	}
	.primary.arrow-left .tooltip::after {
		border-color: transparent ${ tinycolor(config.primary) } transparent transparent;
	}
	.primary.arrow-right .tooltip::after {
		border-color: transparent transparent transparent ${ tinycolor(config.primary) };
	}
	.primary.arrow-up .tooltip::after {	
		border-color: transparent transparent ${ tinycolor(config.primary) } transparent;
	}

	.info .tooltip{
		background-color: ${ tinycolor(config.info) };
	}
	/* Tooltip arrow */
	.info.arrow-down .tooltip::after {
		border-color: ${ tinycolor(config.info) } transparent transparent transparent;
	}
	.info.arrow-left .tooltip::after {
		border-color: transparent ${ tinycolor(config.info) } transparent transparent;
	}
	.info.arrow-right .tooltip::after {
		border-color: transparent transparent transparent ${ tinycolor(config.info) };
	}
	.info.arrow-up .tooltip::after {
		border-color: transparent transparent ${ tinycolor(config.info) } transparent;
	}

	.warning .tooltip{
		background-color: ${ tinycolor(config.warning) };
	}
	/* Tooltip arrow */
	.warning.arrow-down .tooltip::after {
		border-color: ${ tinycolor(config.warning) } transparent transparent transparent;
	}
	.warning.arrow-left .tooltip::after {
		border-color: transparent ${ tinycolor(config.warning) } transparent transparent;
	}
	.warning.arrow-right .tooltip::after {
		border-color: transparent transparent transparent ${ tinycolor(config.warning) };
	}
	.warning.arrow-up .tooltip::after {
		border-color: transparent transparent ${ tinycolor(config.warning) } transparent;
	}

	.success .tooltip{
		background-color: ${ tinycolor(config.success) };
	}
	/* Tooltip arrow */
	.success.arrow-down .tooltip::after {
		border-color: ${ tinycolor(config.success) } transparent transparent transparent;
	}
	.success.arrow-left .tooltip::after {
		border-color: transparent ${ tinycolor(config.success) } transparent transparent;
	}
	.success.arrow-right .tooltip::after {
		border-color: transparent transparent transparent ${ tinycolor(config.success) };
	}
	.success.arrow-up .tooltip::after {
		border-color: transparent transparent ${ tinycolor(config.success) } transparent;
	}

	.error .tooltip{
		background-color: ${ tinycolor(config.error) };
	}
	/* Tooltip arrow */
	.error.arrow-down .tooltip::after {
		border-color: ${ tinycolor(config.error) } transparent transparent transparent;
	}
	.error.arrow-left .tooltip::after {
		border-color: transparent ${ tinycolor(config.error) } transparent transparent;
	}
	.error.arrow-right .tooltip::after {
		border-color: transparent transparent transparent ${ tinycolor(config.error) };
	}
	.error.arrow-up .tooltip::after {
		border-color: transparent transparent ${ tinycolor(config.error) } transparent;
	}

	.knob-tooltip-wrapper .tooltip {
		transition: all 200ms ease-in-out;		
	}

	.knob-tooltip-wrapper .tooltip:hover{
		transform: scale(1.05);
	}
}
`;
	return cssTemplate;
};