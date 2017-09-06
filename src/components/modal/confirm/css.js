"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);
var errorColorShades = createColorShades(config.error);
var successColorShades = createColorShades(config.success);
var infoColorShades = createColorShades(config.info);
var warningColorShades = createColorShades(config.warning);

var textColor = function(color) {
	return tinycolor(color).isDark() ? "white" : "black";
};

let cssTemplate = `
.knob-modal-confirm .knob-modal__buttons {
  	padding: 10px;
  	text-align: right;
  	outline: none;
  	border:none;
}

.knob-modal-confirm .knob-modal__buttons .cancelButton .knob-button:hover {
	background-color: ${ colorShades.color4 };
}
.knob-modal-confirm .knob-modal__buttons .okButton .knob-button:hover {
	background-color: ${ colorShades.color4 };
}
.knob-modal-confirm .knob-modal__buttons .knob-button{
	background-color: ${ tinycolor(baseColor) };
	outline-color: transparent;
	fill: black;
	color: black;
}
.knob-modal-confirm.info .okButton button {
	background-color: ${ infoColorShades.color3 };
	outline: 1px solid ${ infoColorShades.color3 };
	color: ${ textColor(infoColorShades.color3) };
	fill: ${ textColor(infoColorShades.color3) };
}
.knob-modal-confirm.info .knob-modal__buttons .okButton .knob-button:hover {
	background-color: ${ infoColorShades.color4 };
}
.knob-modal-confirm.warning .okButton button {
	background-color: ${ warningColorShades.color3 };
	color: ${ textColor(warningColorShades.color3) };
	fill: ${ textColor(warningColorShades.color3) };
}
.knob-modal-confirm.warning .knob-modal__buttons .okButton .knob-button:hover {
	background-color: ${ warningColorShades.color4 };
}
.knob-modal-confirm.error .okButton button {
	background-color: ${ errorColorShades.color3 };	
	color: ${ textColor(errorColorShades.color3) };
	fill: ${ textColor(errorColorShades.color3) };
}
.knob-modal-confirm.error .knob-modal__buttons .okButton .knob-button:hover {
	background-color: ${ errorColorShades.color4 };
}
.knob-modal-confirm.success .okButton button {
	background-color: ${ successColorShades.color3 };
	color: ${ textColor(successColorShades.color3) };
	fill: ${ textColor(successColorShades.color3) };
}
.knob-modal-confirm.success .knob-modal__buttons .okButton .knob-button:hover {
	background-color: ${ successColorShades.color4 };
}
`;
	return cssTemplate;
};
