"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;
var colorShades = createColorShades(baseColor);
var basicTextColor = tinycolor(baseColor).isDark() ? baseColor : colorShades.color7;
var activeTextColor = tinycolor(baseColor).isDark() ? "white" : "black";

let cssTemplate = `
	.knob-pagination {
		overflow: hidden;
		display: table;
		margin: 0 auto;
	}

	.knob-pagination span button {
		position: relative;
		float: left;
		text-decoration: none;
		background-color: transparent;
		color: ${ basicTextColor };
		fill: ${ basicTextColor };
		font-weight: bold;
		height: 34px;
	}

	.knob-pagination span button:hover {
		position: relative;
		float: left;
		text-decoration: none;
		background-color: ${ colorShades.color4 };
		color: ${ activeTextColor };
		fill: ${ activeTextColor };
		font-weight: bold;
	}

	.knob-pagination span button[disabled] {
		position: relative;
		float: left;
		text-decoration: none;
		color: white;
		background-color: #d3d3d3;
		color: #606060;
		fill: #606060;
		font-weight: bold;
	}

	.knob-pagination span knob-button.active button {
		position: relative;
		float: left;
		text-decoration: none;
		background-color: ${ tinycolor(baseColor) };
		color: ${ activeTextColor };
		fill: ${ activeTextColor };
		font-weight: bold;
	}
	.knob-pagination span knob-button.active button:hover {
		position: relative;
		float: left;
		text-decoration: none;
		background-color: ${ colorShades.color2 };
		fill: ${ activeTextColor };
		font-weight: bold;
	}
	`;

  	return cssTemplate;
};