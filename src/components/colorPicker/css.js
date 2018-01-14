"use strict";

//var tinycolor = require("tinycolor2");

module.exports = function() {
/*
var baseColor = config.default;  
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";
*/
let cssTemplate = `
	.color-picker-container {
		width: 400px;
		height: 250px;
		border: 1px solid #000;
	}
	.cube {
		display: inline-flex;
		width: 100px;
		margin: 30px;
	}
	.small-wrapper {
		display: inline-flex;
		border: 1px solid #ccc;
		flex-direction: column;
		margin: 15px;
		width: 200px;
	}
	.label {
		margin: .5rem;
	}
	#valueSpan {
		border: .5px solid #ddd;
		display: inline-flex;
	}
	#styleSpan {
		border: .5px solid #ddd;
		width: 20px;
		height: 20px;
		margin: 5px;
		display: inline-flex;
	}
	.sample {
		border: .5px solid #ddd;
		width: 20px;
		height: 20px;
		margin: 5px;
		display: inline-flex;
	}
	.sample-wrapper {
		flex-wrap: wrap;
	}
	.picker-btn {
		margin-left: auto;
	}
`;
	return cssTemplate;
};