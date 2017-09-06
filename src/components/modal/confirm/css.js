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

let cssTemplate = `
.knob-modal-confirm .knob-modal__buttons {
  padding: 10px;
  text-align: right;
}
.knob-modal-confirm .knob-modal__buttons .knob-button:hover {
	background-color: ${ colorShades.color3 };
}
.knob-modal-confirm .knob-modal__buttons .knob-button{
	background-color: ${ tinycolor(baseColor) };
	border-color: transparent;
	fill: black;
	color: black;
}
`;
	return cssTemplate;
};
