"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);
var selectedColor = tinycolor(colorShades.color4).isDark() ? colorShades.color2 : colorShades.color5;

let cssTemplate = `
.knob-selectable-paged-list .selected {
  color: ${ selectedColor };
}
`;
	return cssTemplate;
};