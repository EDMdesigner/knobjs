"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);


let cssTemplate = `
knob-checkbox svg {
  cursor: pointer;
}
knob-checkbox svg:hover {
  cursor: pointer;
  fill: ${ colorShades.color4 };
}
knob-checkbox .disabled svg {
  cursor: not-allowed;
}
knob-checkbox .icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  line-height: 1;
}
`;
	return cssTemplate;
};