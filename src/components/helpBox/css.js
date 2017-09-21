"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);
var infoColorShades = createColorShades(config.info);
var warningColorShades = createColorShades(config.warning);
var successColorShades = createColorShades(config.success);
var errorColorShades = createColorShades(config.error);

let cssTemplate = `
.knob-helpbox-wrapper {
  position: relative;
  padding: 1rem;
}
.knob-helpbox-container {
  position: relative;  
  width: 100%;
  height: auto;
  border: 1px solid ${ colorShades.color4 };
  padding: 1rem;
}
.knob-helpbox-body {
  padding: 1rem;
}
.hide {
  position: absolute;
  top: 0;
  right: 0;
  fill: ${ colorShades.color4 };
}
.hide:hover {
  fill: ${ colorShades.color7 };
}
.info {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: -40px;
  fill: ${ colorShades.color4 };
}
.info:hover {
  fill: ${ colorShades.color7 };
}
.knob-helpbox-container a {
  color: ${ colorShades.color4 };
}
.knob-helpbox-container a:hover {
  color: ${ colorShades.color7 };
}
.variation-info .knob-helpbox-container {
  border: 1px solid ${ tinycolor(config.info) };
}
.variation-info .hide {
  fill: ${ infoColorShades.color1 };
}
.variation-info .hide:hover {
  fill: ${ infoColorShades.color4 };
}
.variation-info .info {
  fill: ${ infoColorShades.color1 };
}
.variation-info .info:hover {
  fill: ${ infoColorShades.color4 };
}
.variation-info .knob-helpbox-container a {
  color: ${ infoColorShades.color1 };
}
.variation-info .knob-helpbox-container a:hover {
  color: ${ infoColorShades.color4 };
}
.variation-warning .knob-helpbox-container {
  border: 1px solid ${ tinycolor(config.warning) };
}
.variation-warning .hide {
  fill: ${ warningColorShades.color1 };
}
.variation-warning .hide:hover {
  fill: ${ warningColorShades.color4 };
}
.variation-warning .info {
  fill: ${ warningColorShades.color1 };
}
.variation-warning .info:hover {
  fill: ${ warningColorShades.color4 };
}
.variation-warning .knob-helpbox-container a {
  color: ${ warningColorShades.color1 };
}
.variation-warning .knob-helpbox-container a:hover {
  color: ${ warningColorShades.color4 };
}
.variation-success .knob-helpbox-container {
  border: 1px solid ${ tinycolor(config.success) };
}
.variation-success .hide {
  fill: ${ successColorShades.color1 };
}
.variation-success .hide:hover {
  fill: ${ successColorShades.color4 };
}
.variation-success .info {
  fill: ${ successColorShades.color1 };
}
.variation-success .info:hover {
  fill: ${ successColorShades.color4 };
}
.variation-success .knob-helpbox-container a {
  color: ${ successColorShades.color1 };
}
.variation-success .knob-helpbox-container a:hover {
  color: ${ successColorShades.color4 };
}
.variation-error .knob-helpbox-container {
  border: 1px solid ${ tinycolor(config.error) };
}
.variation-error .hide {
  fill: ${ errorColorShades.color2 };
}
.variation-error .hide:hover {
  fill: ${ errorColorShades.color5 };
}
.variation-error .info {
  fill: ${ errorColorShades.color2 };
}
.variation-error .info:hover {
  fill: ${ errorColorShades.color5 };
}
.variation-error .knob-helpbox-container a {
  color: ${ errorColorShades.color2 };
}
.variation-error .knob-helpbox-container a:hover {
  color: ${ errorColorShades.color6 };
}
`;

  return cssTemplate;
};

