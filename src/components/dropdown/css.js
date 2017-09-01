"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);

let cssTemplate = `
.knob-dropdown-menu {
  z-index: 2;
  position: absolute;
  margin-top: 3px;
}
.knob-button {
  text-align: left;
  border-radius: 0px;
  border-width: 1px;
  border-top: 0px;
}
.knob-dropdown-menu button {
  width: 100%;
  text-align: left;
  border-radius: 0px;
  border-width: 1px;
  border-top: 0px;
}
.knob-dropdown div button:hover {
  background-color: ${ colorShades.color4 };
}
.variation-primary .knob-dropdown .knob-button:hover {
  background-color: ${ colorShades.color4 };
}
.knob-dropdown-menu button:hover {
  width: 100%;
  text-align: left;
  border-radius: 0px;
  border-width: 1px;
  border-top: 0px;
  background-color: ${ colorShades.color4 };
}
.knob-dropdown-menu div:first-of-type button {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.knob-dropdown-menu div:last-of-type button {
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
knob-pagelist__bar input:hover {
  border: 1px solid ${ colorShades.color4 } !important;
}
knob-pagelist__bar input:focus {
  border: 1px solid ${ colorShades.color4 } !important;
  outline: none !important
}
`;
	return cssTemplate;
};