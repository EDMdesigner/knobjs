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
	.tooltip {
		position: relative;
		margin-top: -30px;
		margin-right: 25px;
	}
	.arrow-right.subup .tooltip::after {
	border-color: transparent transparent transparent #d9d9d9;
	}
`;
	return cssTemplate;
};