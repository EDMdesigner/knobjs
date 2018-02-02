"use strict";

module.exports = function() {

let cssTemplate = `
	.color-picker-container {
		display: flex;
		height: auto;
		align-content: space-between;
	}
	.first-wrapper {
		display: inline-flex;
		flex-direction: column;
	}
	.color-picker-container > .first-wrapper > .colorPicker {
		background: 0;
		border: 0;
		margin: 0;
	}
	.color-picker-container > .first-wrapper > .colorPicker > .twod {
		margin-top: 0.5em;
		margin-left: 0.5em;
		margin-bottom: 0.5em;
		margin-right: 0;
	}
	.color-picker-container > .first-wrapper > .colorPicker > .twod,
	.color-picker-container > .first-wrapper > .colorPicker > .twod .bg {
		width: 100px;
		height: 100px;
	}
	.color-picker-container > .first-wrapper > .colorPicker > .oned,
	.color-picker-container > .first-wrapper > .colorPicker > .oned .bg {
		height: 100px;
	}
	.second-wrapper {
		display: inline-flex;
		flex-direction: column;
		width: 140px;
	}
	.picker-label {
		font-family: 'Open Sans', Arial, sans-serif;
		font-size: 14px;
		color: #a9a9a9;
		text-align: left;
		margin-top: 8px;
		margin-right: 8px;
		margin-bottom: 0px;
		margin-left: 8px;
	}
	.sample-wrapper {
		flex-wrap: wrap;
	}
	.sample {
		width: 20px;
		height: 20px;
		margin: 5px;
		border: .5px solid #e6e6e6;
		border-radius: 3px;
		display: inline-flex;
	}
	.transparent {
		background-color: transparent;
		margin-left: 10px;
	}
	.picker-btn {
		margin-left: auto;
		margin-right: 5px;
		position: absolute;
		right: 22px;
		bottom: 5px;
	}

`;
	return cssTemplate;
};