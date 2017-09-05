"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);


let cssTemplate = `
.knob-button:hover {
  background-color: ${ colorShades.color4 };
}
`;
	return cssTemplate;
};