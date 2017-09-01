"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);

let cssTemplate = `
.knob-input {
  display: -webkit-flex;
  display: flex;
  padding: 7px 12px;
  margin: 3px;
  border: 1px solid ${ config.darkGray };
}
.knob-input input {
  border: 0px none;
  outline: 0px none;
  background: transparent none;
  flex: 1 100%;
  margin-left: 3px;
  margin-right: 3px;
}
.knob-input.disabled {
  background-color: ${ tinycolor(config.lightGray) };
}
.knob-input.disabled:hover {
  outline: none;
}
.knob-input:hover {
  outline: 1px solid ${ colorShades.color4 };
 }
.knob-input.active {
  outline: 1px solid ${ colorShades.color6 } ;
 }
.knob-input .icon-wrapper .icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  line-height: 1;
}
.knob-input .preFixText, .knob-input .postFixText {
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
}
`;
	return cssTemplate;
};
