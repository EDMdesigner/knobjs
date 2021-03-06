"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);

let cssTemplate = `
.knob-textarea {
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  display: inline-block;
  padding: 7px 12px;
  min-width: 100%;
  max-width: 100%;
  min-height: 60px;
}
.knob-textarea-wrapper:hover > textarea {
  border-color: ${ colorShades.color2 };
}
.knob-textarea-wrapper.active > textarea {
  border-color: ${ colorShades.color4 };
  outline: none;
}
`;

	return cssTemplate;
};
