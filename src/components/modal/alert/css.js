"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var textColor = function(color) { 
	return tinycolor(color).isDark() ? "white" : "black";
};

let cssTemplate = `
.knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons {
	text-align: center;
}
.knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > knob-button > .knob-button {
	background-color: ${ tinycolor(config.primary) };
	color: ${ textColor(config.primary) };
	fill: ${ textColor(config.primary) };
	border-color: transparent;
}
.knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal {
	border: 1px solid ${ tinycolor(config.darkGray) };
}
.knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__header {
  text-align: center;
}
.variation-warning > .knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > knob-button > .knob-button {
	background-color: ${ tinycolor(config.warning) };
	color: ${ textColor(config.warning) };
	fill: ${ textColor(config.warning) };
}
.variation-info > .knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > knob-button > .knob-button {
	background-color: ${ tinycolor(config.info) };
	color: ${ textColor(config.info) };
	fill: ${ textColor(config.info) };
}
.variation-success > .knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > knob-button > .knob-button {
	background-color: ${ tinycolor(config.success) };
	color: ${ textColor(config.success) };
	fill: ${ textColor(config.success) };
}
.variation-error > .knob-modal-alert > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > knob-button > .knob-button {
	background-color: ${ tinycolor(config.error) };
	color: ${ textColor(config.error) };
	fill: ${ textColor(config.error) };
}

`;
	return cssTemplate;
};
