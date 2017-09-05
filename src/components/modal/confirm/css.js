"use strict";

var createColorShades = require("../../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);

let cssTemplate = `
.knob-modal-confirm .knob-modal__buttons {
  padding: 10px;
  text-align: right;
}
.knob-modal-confirm .knob-modal__buttons .knob-button:hover {
	background-color: ${ colorShades.color3 };
}
`;
	return cssTemplate;
};
