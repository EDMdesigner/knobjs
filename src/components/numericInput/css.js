"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);

let cssTemplate = `
.knob-numericInput {
  display: flex;
  align-items: center;
}
.control-button {
  display: inline-flex;
  flex-direction: column-reverse;
}
.knob-numericInput .knob-input:hover {
	outline: 1px solid ${ colorShades.color4 };
}
.knob-numericInput .knob-input-wrapper.active > .knob-input {
	border: none;
	outline: 1px solid ${ colorShades.color6 };
}
.knob-numericInput .knob-button:hover {
	background-color: ${ colorShades.color4 } !important;
}
.knob-numericInput .knob-button:active {
	background-color: ${ colorShades.color6 } !important;
}
`;
	return cssTemplate;
};
