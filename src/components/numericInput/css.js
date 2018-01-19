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
.knob-numericInput .control-button > knob-button > .knob-button:hover > .icon-wrapper > .icon {
	fill: ${ colorShades.color4 };
	outline: none;
}
.knob-numericInput .control-button > knob-button > .knob-button:active > .icon-wrapper > .icon {
	fill: ${ colorShades.color6 };
	outline: none;
}
.numerInputIncreaseWrapper > .control-button > knob-button > .knob-button {
	background: transparent;
	border-color: transparent;
	outline: none;
}
.numerInputDecreaseWrapper > .control-button > knob-button > .knob-button {
	background: transparent;
	border-color: transparent;
	outline: none;
}
.reachedMaxValue .knob-button {
	opacity: 0.2;
	cursor: not-allowed;
}
.reachedMinValue .knob-button {
	opacity: 0.2;
	cursor: not-allowed;
}
.knob-numericInput .control-button > .reachedMaxValue > .knob-button:hover > .icon-wrapper > .icon {
	fill: black;
}
.knob-numericInput .control-button > .reachedMaxValue > .knob-button:active > .icon-wrapper > .icon {
	fill: black;
}
.knob-numericInput .control-button > .reachedMinValue > .knob-button:hover > .icon-wrapper > .icon {
	fill: black;
}
.knob-numericInput .control-button > .reachedMinValue > .knob-button:active > .icon-wrapper > .icon {
	fill: black;
}
.numericInputButtonsWrapper {
	transform: scale(0.71);
}
`;
	return cssTemplate;
};
