"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var textColor = function(color) {
	return tinycolor(color).isDark() ? "white" : "black";
};
var activeButtonColor = config.white;

let cssTemplate = `
	.knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > div > .knob-button {
		font-size: 14px;
		font-weight: 400;
		border-width: 0px;
		color: ${ textColor(config.default) };
		fill: ${ textColor(config.default) };
		background-color: ${ tinycolor(config.lightGray) };
	}
	.top-border-variation > .knob-tabs > .knob-radio-wrapper .knob-radio > :not(.active) .knob-button {
		box-shadow: inset 0 -1px 0 ${ tinycolor(config.darkGray) };
		margin-left: -4px;
	}
	.top-border-variation > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > .active > .knob-button{
		color: ${ tinycolor(config.primary) };
		fill: ${ tinycolor(config.primary) };
		border-top: 1px solid ${ tinycolor(config.darkGray) };
		border-bottom: transparent;
		background-color: ${ activeButtonColor };
		cursor: not-allowed;
		margin-left: -4px;
		box-shadow: inset 1px 0 0 ${ tinycolor(config.darkGray) }, inset -1px 0 0 ${ tinycolor(config.darkGray) };
	}
	.top-border-variation > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > .active {
		margin-bottom: 2px;    
	}
	.top-border-variation > .knob-tab > .knob-radio-wrapper {
		border-bottom: 1px solid ${ tinycolor(config.darkGray) };
	}
	.top-border-variation > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio {
		margin-bottom: -3px;
	}
	.top-border-variation > .knob-tab > .knob-panel-group {
		background-color: ${ activeButtonColor };
		padding-top: 1px;
	}
	.top-border-variation > .knob-tabs {
		background-color: ${ tinycolor(config.lightGray) };
	}
	.knob-tab.orientation-left-top > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > .active > .knob-button{
		border-top: none;
		border-right: none;
		border-left: 4px solid ${ tinycolor(config.primary) };
		cursor: not-allowed;
		border-top-left-radius: 0px;
		border-top-right-radius: 0px;
	}
	.border-bottom-variation > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > div > .knob-button {
		background-color: transparent;
		border: none;
	}
	.border-bottom-variation > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > .active > .knob-button {
		border-bottom: 2px solid ${ tinycolor(config.primary) };
		color: ${ tinycolor(config.primary) };
		fill: ${ tinycolor(config.primary) };
	}
	.border-bottom-variation > .knob-tab {
		background-color: transparent;
	}
	.border-bottom-variation > .knob-tab > .knob-radio-wrapper > knob-radio > .knob-radio > .active > .knob-button {
		border-top: none;
		border-left: none;
		border-right: none;
	}
	`;

	return cssTemplate;
};