"use strict";

module.exports = function() {

let cssTemplate = `
	.color-picker-container {
		display: flex;
		width: 400px;
		height: auto;
	}
	.first-wrapper {
		display: inline-flex;
		flex-direction: column;
		margin: 15px;
		width: 200px;
	}
	.second-wrapper {
		display: inline-flex;
		flex-direction: column;
		margin: 10px;
		width: 190px;
	}
	#valueSpan {
		display: inline-flex;
		width: 120px;
		height: 25px;
		margin-left: 8px;
	}
	.picker-label {
		margin: 8px;
		color: #000;
		text-align: left;
	}
	#styleSpan {
		width: 20px;
		height: 20px;
		margin: 8px;
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
		margin-right: 5px;
	}
`;
	return cssTemplate;
};