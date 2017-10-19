"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var baseColor = tinycolor(config.primary);

let cssTemplate = `
.knob-radio {
  overflow: hidden;
}
.knob-radio > div  {
  display: inline-block;
}
.knob-radio.knob-radio-block > div {
  display: block;
}
.knob-tab.orientation {
  width: 100%;
}
.knob-tab.orientation-top-left {
  text-align: left;
}
.knob-tab.orientation-top-center {
  text-align: center;
}
.knob-tab.orientation-top-right {
  text-align: right;
}
.knob-tab.orientation-left-top .knob-radio, .knob-tab.orientation-left-top .knob-panel-group {
  float: left;
}
.knob-tab.orientation-left-top .knob-radio {
  width: 20%;
}
.knob-tab.orientation-left-top .knob-radio > div {
  width: 100%;
  display: block;
}
.knob-tab.orientation-left-top .knob-radio > div .knob-button {
  width: 100%;
  text-align: left;
}
.knob-tab.orientation-left-top .knob-panel-group {
  width: 80%;
}
.knob-tab.orientation-left-top .knob-tab {
  padding-top: 0;
}
.knob-tab.orientation-left-top .knob-tab p:nth-child(1) {
  margin-top: 0;
}
.knob-radio > .active > .knob-button {
  background-color: ${ baseColor };
  outline: none;
}
.knob-radio-block.knob-radio > div > .knob-button {
  float: left;
  padding: 0;
  border-radius: 100px;
  width: 16px;
  height: 16px;
  color: transparent;
  fill: transparent;
  margin-right: 4px;
}
.knob-radio-block.knob-radio > div > .knob-button:active {
  outline: none;
}
.knob-radio-block.knob-radio > .active > .knob-button {
  background-color: ${ baseColor };
  outline: none;
}
.knob-radio-block.knob-radio > .blockLabel {
  padding-bottom: 5px;
}
`;

return cssTemplate;
};