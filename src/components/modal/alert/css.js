"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;
var colorShades = createColorShades(baseColor); 

let cssTemplate = `
.knob-modal-alert .knob-modal__buttons {
  padding: 10px;
  text-align: right;
}
.knob-modal-alert .knob-modal__buttons .knob-button{
	background-color: ${ tinycolor(baseColor) };
	border-color: transparent;
	fill: black;
	color: black;
}
.knob-modal-alert .knob-modal__buttons .knob-button:hover {
	background-color: ${ colorShades.color3 };
}
`;
	return cssTemplate;
};
