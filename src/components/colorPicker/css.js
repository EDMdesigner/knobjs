"use strict";

module.exports = function() {

let cssTemplate = `
	.main-color {
		width: 20px;
		height: 20px;
		margin: 5px;
		margin-left: 440px;
		border: 1px solid #a9a9a9;
		border-radius: 3px;
		display: inline-flex;
	}
	.picker-tooltip {
		z-index: 9999;
		margin-left: -440px;
	}
	.color-picker-container {
		width: 400px;
		height: auto;
	}
	.color-input {
		display: inline-flex;
		width: 120px;
		margin-top: 20px;
		margin-right: 20px;
	}
	.small-wrapper {
		display: inline-flex;
		flex-direction: column;
		margin: 15px;
		width: 180px;
	}
	.picker-label {
		margin: 8px;
		color: #000;
		text-align: left;
	}
	#styleSpan {
		width: 20px;
		height: 20px;
		margin: 10px;
		border-radius: 3px;
	}
	.sample-wrapper {
		flex-wrap: wrap;
		margin-bottom: 16px;
	}
	.sample {
		width: 20px;
		height: 20px;
		margin: 5px;
		border-radius: 3px;
		display: inline-flex;
	}
	.picker-btn {
		margin-left: auto;
		margin-right: 15px;
	}
`;
	return cssTemplate;
};