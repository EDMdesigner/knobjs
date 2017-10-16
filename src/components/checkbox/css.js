"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

let cssTemplate = `
knob-checkbox svg {
  cursor: pointer;
}
knob-checkbox .disabled{
	fill: #d3d3d3;
}
knob-checkbox .disabled svg {
  cursor: not-allowed;
  fill: #d3d3d3;
}
knob-checkbox .icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  line-height: 1;
}
.checkbox {
  border: 1px solid ${ tinycolor(config.darkGray) };
  width: 24px;
  height: 24px;
}
.checkbox:hover {
  border-color: gray;
}
`;
	return cssTemplate;
};