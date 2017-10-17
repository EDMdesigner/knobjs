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
.rounded > .knob-input {
  border-radius: 6px;
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
.knob-input.disabled input {
  cursor: not-allowed;
}
.knob-input:hover {
  border-color:  ${ colorShades.color4 };
 }
.knob-input.active {
  border-color: ${ colorShades.color6 } ;
 }
.variation-primary .knob-input {
  border-color: ${ primaryColorShades.color3 };
 }
.variation-warning .knob-input {
  border-color: ${ warningColorShades.color3 };
 }
.variation-info .knob-input {
  border-color: ${ infoColorShades.color3 };
 }
.variation-success .knob-input {
  border-color: ${ successColorShades.color3 };
 }
.variation-error .knob-input {
  border-color: ${ errorColorShades.color3 };
 }
 .knob-input.active:hover {
  border-color: ${ colorShades.color4 } ;
 }
.variation-primary .knob-input.active {
  border-color: ${ primaryColorShades.color4 };
 }
.variation-warning .knob-input.active {
  border-color: ${ warningColorShades.color4 };
    background-color: transparent;
 }
.variation-info .knob-input.active {
  border-color: ${ infoColorShades.color4 };
 }
.variation-success .knob-input.active {
  border-color: ${ successColorShades.color4 };
 }
.variation-error .knob-input.active {
  border-color: ${ errorColorShades.color4 };
 }
 .variation-primary .knob-input:hover {
  border-color: ${ tinycolor(config.primary) };
  fill: ${ tinycolor(config.primary) };
 }
.variation-warning .knob-input:hover {
  border-color: ${ tinycolor(config.warning) };
 }
.variation-info .knob-input:hover {
  border-color: ${ tinycolor(config.info) };
 }
.variation-success .knob-input:hover {
  border-color: ${ tinycolor(config.success) };
 }
.variation-error .knob-input:hover {
  border-color: ${ tinycolor(config.error) };
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
