"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);
var primaryColorShades = createColorShades(config.primary);
var errorColorShades = createColorShades(config.error);
var successColorShades = createColorShades(config.success);
var infoColorShades = createColorShades(config.info);
var warningColorShades = createColorShades(config.warning);

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
  cursor: not-allowed;
}
.knob-input.disabled:hover {
  outline: none;
}
.knob-input:hover {
  outline: 1px solid ${ colorShades.color4 };
 }
.knob-input.active {
  outline: 2px solid ${ colorShades.color6 } ;
 }
.variation-primary .knob-input {
  outline: 1px solid ${ primaryColorShades.color3 };
 }
.variation-warning .knob-input {
  outline: 1px solid ${ warningColorShades.color3 };
 }
.variation-info .knob-input {
  outline: 1px solid ${ infoColorShades.color3 };
 }
.variation-success .knob-input {
  outline: 1px solid ${ successColorShades.color3 };
 }
.variation-error .knob-input {
  outline: 1px solid ${ errorColorShades.color3 };
 }
 .variation-primary .knob-input.active {
  outline: 2px solid ${ tinycolor(config.primary) };
  fill: ${ tinycolor(config.primary) };
 }
.variation-warning .knob-input.active {
  outline: 2px solid ${ tinycolor(config.warning) };
  background-color: transparent;
 }
.variation-info .knob-input.active {
  outline: 2px solid ${ tinycolor(config.info) };
 }
.variation-success .knob-input.active {
  outline: 2px solid ${ tinycolor(config.success) };
 }
.variation-error .knob-input.active {
  outline: 2px solid ${ tinycolor(config.error) };
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
