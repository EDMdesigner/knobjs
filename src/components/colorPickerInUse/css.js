"use strict";

module.exports = function() {

let cssTemplate = `
	.holder-wrapper {
		display: flex;
		width: 120px;
		margin-left: 440px;
	}
	.color-picker-holder {
		display: inline-flex;
		width: 22px;
		height: 22px;
		margin-right: 10px;
		border-radius: 100px;
	}
	.color-input {
		display: inline-flex;
		width: 70px;
		height: 20px;
	}
`;
	return cssTemplate;
};