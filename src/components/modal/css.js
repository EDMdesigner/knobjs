"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;  
var colorShades = createColorShades(baseColor);
var errorColorShades = createColorShades(config.error);
var successColorShades = createColorShades(config.success);
var infoColorShades = createColorShades(config.info);
var warningColorShades = createColorShades(config.warning);


let cssTemplate = `
.knob-modal-overlay {
  background: rgba(0, 0, 0, .7);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.knob-modal {
  backface-visibility: hidden;
  font-smoothing: antialiased;
  background: white;
  min-width: 240px;
  max-width: 90%;
  padding-top: 6px;
  padding-left: 6px;
  /*	z-index: 22; */
  overflow: hidden;
  border: 2px solid ${ tinycolor(config.default) };
}
.knob-modal:hover {
  border: 2px solid ${ colorShades.color4 };
}
.variation-info .knob-modal:hover {
  border: 2px solid ${ tinycolor(config.info) };
}
.variation-info .knob-modal .knob-modal__header .button-close button:hover svg {
  fill: ${ infoColorShades.color2 };
}
.variation-info .knob-modal .knob-modal__header .desc .icon {
  fill: ${ infoColorShades.color4 };
}
.variation-warning .knob-modal:hover {
  border: 2px solid ${ tinycolor(config.warning) };
}
.variation-warning .knob-modal .knob-modal__header .button-close button:hover svg {
  fill: ${ warningColorShades.color2 };
}
.variation-warning .knob-modal .knob-modal__header .desc .icon {
  fill: ${ warningColorShades.color4 };
}
.variation-success .knob-modal:hover {
  border: 2px solid ${ tinycolor(config.success) };
}
.variation-success .knob-modal .knob-modal__header .button-close button:hover svg {
  fill: ${ successColorShades.color2 };
}
.variation-success .knob-modal .knob-modal__header .desc .icon {
  fill: ${ successColorShades.color4 };
}
.variation-error .knob-modal:hover {
  border: 2px solid ${ tinycolor(config.error) };
}
.variation-error .knob-modal .knob-modal__header .button-close button:hover svg {
  fill: ${ errorColorShades.color2 };
}
.knob-modal .knob-modal__header .button-close button:hover {
  background-color: transparent;
}
.variation-error .knob-modal .knob-modal__header .desc .icon {
  fill: ${ errorColorShades.color4 };
}
.knob-input.active.primary { 
  outline: 2px solid ${ tinycolor(config.primary) }; 
  fill: red;
}
.knob-modal__header .desc {
  padding-right: 10px;
  vertical-align: middle;
  color: black;
}
.knob-modal__header .desc span {
  position: relative;
  top: 2px;
}
.knob-modal__header svg {
  float: left;
  margin-right: 10px;
  width: 24px;
  height: 24px;
  fill: black;
}
.knob-modal__header .button-close {
  float: right;
}
.knob-modal__header .button-close button {
  padding: 0;
  background: none;
  border-radius: 0;
  border: 0 none;
}
.knob-modal__header .button-close button:hover svg {
  fill: ${ colorShades.color2 };
}
.knob-modal__body {
  max-width: 555px;
  padding: 15px;
  width: 100%;
}
.knob-modal__content {
  padding: 10px;
}

`;
	return cssTemplate;
};