"use strict";

module.exports = function() {

let cssTemplate = `
	.main-color {
		width: 20px;
		height: 20px;
		margin: 5px;
		margin-left: 50px;
		border: 1px solid black;
		display: inline-flex;
	}
	.color-picker-container {
		width: 380px;
		height: auto;
		border: 1px solid #000;
		background-color: #ffffff;
	}
	.cube {
		display: inline-flex;
		width: 100px;
		margin: 20px;
	}
	.small-wrapper {
		display: inline-flex;
		flex-direction: column;
		margin: 15px;
		width: 180px;
	}
	.label {
		margin: .5rem;
	}
	#valueSpan {
		display: inline-flex;
	}
	#styleSpan {
		width: 20px;
		height: 20px;
		margin: 5px;
		display: inline-flex;
	}
	.sample {
		width: 20px;
		height: 20px;
		margin: 5px;
		display: inline-flex;
	}
	.sample-wrapper {
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	.picker-btn {
		margin-left: auto;
		margin-right: 15px;
	}
`;
	return cssTemplate;
};