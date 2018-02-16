"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;
var colorShades = createColorShades(baseColor);
var infoColorShades = createColorShades(config.info);
var warningColorShades = createColorShades(config.warning);
var successColorShades = createColorShades(config.success);
var errorColorShades = createColorShades(config.error);


let cssTemplate = `
	.variation-small > .knob-modal-overlay > .knob-modal {
		width: 100%;
		max-width: 420px;
		min-width: 380px;
	}

	.variation-medium > .knob-modal-overlay >  .knob-modal {
		width: 100%;
		max-width: 800px;
		min-width: 700px;
	}

	.variation-large > .knob-modal-overlay > .knob-modal {
		width: 100%;
		max-width: 1100px;
		min-width: 1000px;
	}

	.variation-fullscreen > .knob-modal-overlay > .knob-modal {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
	}

	.variation-fullscreen > .knob-modal-overlay > .knob-modal > .knob-modal__header {
		display: none;
	}

	.variation-fullscreen > .knob-modal-overlay > .knob-modal > .knob-modal__body {
		width: 100%;
		height: 100%;
		padding: 0px;
	}

	.knob-modal-overlay {
		background: rgba(256, 256, 256, .7);
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.knob-modal-overlay  > .knob-modal {
		backface-visibility: hidden;
		font-smoothing: antialiased;
		min-width: 240px;
		max-width: 90%;
		max-height: 100%;
		padding: 6px;
		/*	z-index: 22; */
		overflow: hidden;
		background-color: ${ config.mediumGray };
		border-bottom: 2px solid ${ tinycolor(config.primary) };
	}

	.knob-modal > .knob-modal__header > .button-close > .knob-button > .icon-wrapper > .icon {
		vertical-align: initial;
	}

	.leftText > .knob-modal-overlay > .knob-modal > .knob-modal__header > .desc > .icon  {
		float: left;
	}

	.centerText > .knob-modal-overlay > .knob-modal > .knob-modal__header {
		text-align: center;
	}

	.centerText > .knob-modal-overlay > .knob-modal > .knob-modal__header > .desc > .icon {
		vertical-align: middle;
	}

	.variation-info > .knob-modal-overlay  > .knob-modal {
		border-bottom-color: ${ infoColorShades.color1 };
	}

	.variation-info .knob-modal .knob-modal__header .button-close button:hover svg {
		fill: ${ infoColorShades.color2 };
	}

	.variation-info .knob-modal .knob-modal__header .desc .icon {
		fill: ${ infoColorShades.color4 };
	}

	.variation-warning > .knob-modal-overlay  > .knob-modal {
		border-bottom-color: ${ warningColorShades.color1 };
	}

	.variation-warning .knob-modal .knob-modal__header .button-close button:hover svg {
		fill: ${ warningColorShades.color2 };
	}

	.variation-warning .knob-modal .knob-modal__header .desc .icon {
		fill: ${ warningColorShades.color4 };
	}

	.variation-success > .knob-modal-overlay  > .knob-modal {
		border-bottom-color: ${ successColorShades.color1 };
	}

	.variation-success .knob-modal .knob-modal__header .button-close button:hover svg {
		fill: ${ successColorShades.color2 };
	}

	.variation-success .knob-modal .knob-modal__header .desc .icon {
		fill: ${ successColorShades.color4 };
	}

	.variation-error > .knob-modal-overlay  > .knob-modal {
		border-bottom-color: ${ errorColorShades.color1 };
	}

	.variation-error .knob-modal .knob-modal__header .button-close button:hover svg {
		fill: ${ errorColorShades.color2 };
	}

	.variation-error .knob-modal .knob-modal__header .desc .icon {
		fill: ${ errorColorShades.color4 };
	}

	.knob-input.active.primary {
		outline: 2px solid ${ tinycolor(config.primary) };
		fill: red;
	}

	.knob-modal__header .desc {
		padding-right: 10px;
		vertical-align: middle;
		color: black;
	}

	.knob-modal__header .desc span {
		position: relative;
		top: 2px;
	}

	.knob-modal-overlay > .knob-modal > .knob-modal__header > .desc > .icon {
		margin-right: 10px;
		width: 24px;
		height: 24px;
		fill: black;
	}

	.knob-modal__header .button-close {
		float: right;
	}

	.knob-modal__header .button-close button {
		padding: 0;
		background: none;
		border-radius: 0;
		border: 0 none;
	}

	.knob-modal__header .button-close button:hover svg {
		fill: ${ colorShades.color2 };
	}

	.knob-modal__body {
		max-width: 555px;
		padding: 15px;
		width: 100%;
	}

	.knob-modal__content {
		padding: 10px;
	}

	.knob-modal > .knob-modal__header > .button-back > .knob-button {
		float: left;
		background-color: transparent;
		border-color: transparent;
	}
	.knob-modal > .knob-modal__header .button-back button:hover svg {
		fill: ${ colorShades.color2 };
	}
	`;

	return cssTemplate;
};