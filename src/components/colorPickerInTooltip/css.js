"use strict";

module.exports = function(config) {

let cssTemplate = `
	.color-picker-in-tooltip > .backgroundElementsHolder > .colorpickerHolder {
		display: inline-block;
		width: 22px;
		height: 22px;
		border-radius: 100px;
		margin-left: -3px;
		margin-right: 7px;
		margin-top: 8px;
		margin-bottom: -7px;
	}
	.color-picker-in-tooltip .knob-input {
		display: inline-block;
		border-top-color: transparent;
		border-left-color: transparent;
		border-right-color: transparent;
		width: 70px;
		font-size: 14px;
		letter-spacing: 0.4px;
		border-width: 2px;
		border-bottom-color: ${ config.darkGray };
	}
	.color-picker-in-tooltip .backgroundElementsHolder > knob-input > .knob-input > input {
		margin-left: -13px;
		color: ${ config.darkGray };
	}
	.color-picker-in-tooltip > .backgroundElementsHolder > .error {
		font-family: 'Open Sans', Arial, sans-serif;
		font-size: 14px;
		color: #ff0000;
		position: absolute;
		right: 0;
		margin-right: 15px;
	}
	knob-tooltip.light.arrow-up.subright.picker-tooltip > .knob-tooltip-wrapper > .tooltip {
		margin-top: 10px;
		margin-right: 25px;
		background: #fff;
		width: 93%;
	}
	.picker-tooltip > .knob-tooltip-wrapper {
		position: absolute;
		right: 0;
		margin-right: -7px;
		margin-top: 10px;
	}
	knob-tooltip.light.arrow-up.subright.picker-tooltip > .knob-tooltip-wrapper > .tooltip::after {
		right: 30px;
		margin-bottom: -10px;
	}
`;
	return cssTemplate;
};