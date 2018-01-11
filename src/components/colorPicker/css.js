"use strict";

//var tinycolor = require("tinycolor2");

module.exports = function() {
/*
var baseColor = config.default;  
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";
*/
let cssTemplate = `
	.color-picker-container {
		width: 300px;
		height: 150px;
		border: 1px solid #000;
	}
	.cube {
		display: inline-flex;
		width: 90px;
		margin: 15px;
	}
	.small-wrapper {
		display: inline-flex;
		border: 1px solid #ccc;
		flex-direction: column;
		padding: 15px;
	}
	#styleSpan {
		border: .5px solid #ddd;
		width: 20px;
		height: 20px;
		margin: 5px;
	}
`;
	return cssTemplate;
};