
"use strict";

module.exports = function() {

let cssTemplate = `
	.color-picker-container {
		display: flex;
		width: 400px;
		height: auto;
		border-radius: 6px;
		border: 1px solid #f2f2f2;
		box-shadow: 0 12px 22px 0 rgba(0, 0, 0, 0.24);
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
		width: 180px;
	}
	#valueSpan {
		display: inline-flex;
		width: 114px;
		height: 20px;
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
		margin-right: 5px;
	}
`;
	return cssTemplate;
};