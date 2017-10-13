"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var textColor = function(color) {
	return tinycolor(color).isDark() ? "white" : "black";
};
textColor = textColor;
config = config;

let cssTemplate = `
.knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal {
	border: 1px solid ${ tinycolor(config.darkGray) };
}
.knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons {
	text-align: center;
}
.knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > .cancelButton > .knob-button {
	background-color: transparent;
	color: ${ tinycolor(config.dark) };
	fill: ${ tinycolor(config.dark) };
}
.variation-info > .knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > .okButton > .knob-button {
	background-color: ${ tinycolor(config.info) };
	color: ${ textColor(config.info) };
	fill: ${ textColor(config.info) };
}
.variation-warning > .knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > .okButton > .knob-button {
	background-color: ${ tinycolor(config.warning) };
	color: ${ textColor(config.warning) };
	fill: ${ textColor(config.warning) };
}
.variation-success > .knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > .okButton > .knob-button {
	background-color: ${ tinycolor(config.success) };
	color: ${ textColor(config.success) };
	fill: ${ textColor(config.success) };
}
.variation-error > .knob-modal-confirm > knob-modal > .knob-modal-overlay > .knob-modal > .knob-modal__body > .knob-modal__buttons > .okButton > .knob-button {
	background-color: ${ tinycolor(config.error) };
	color: ${ textColor(config.error) };
	fill: ${ textColor(config.error) };
}
`;
	return cssTemplate;
};
