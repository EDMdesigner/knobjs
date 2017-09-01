"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);


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
  /*	z-index: 22; */
  overflow: hidden;
  border: 2px solid ${ tinycolor(config.default) };
}
.knob-modal:hover {
  border: 2px solid ${ tinycolor(baseColor) };
}
.knob-modal:hover .knob-modal__body .knob-button {
  background-color: ${ colorShades.color3 };
}
.knob-modal__header {
  padding: 10px;
  color: black;
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