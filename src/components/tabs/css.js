"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var textColor = function(color) {
  return tinycolor(color).isDark() ? "white" : "black";
};
var colorShades = createColorShades(baseColor);
var activeTabColor = tinycolor(baseColor).isDark() ? tinycolor(baseColor) : colorShades.color6;
var activeButtonColor = "white";


let cssTemplate = `
  .knob-tab button {
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
    border-width: 0px;
    color: ${ textColor(config.default) };
    fill: ${ textColor(config.default) };
    background-color: ${ tinycolor(config.default) };
  }
  .knob-tab .active button{
    border-top: 3px solid ${ activeTabColor };
    font-weight: bold;
    color: ${ textColor(config.default) };
    fill: ${ textColor(config.default) };
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-left: 1px solid ${ tinycolor(config.darkGray) };
    border-right: 1px solid ${ tinycolor(config.darkGray) };
    border-bottom: transparent;
    background-color: ${ activeButtonColor };
    cursor: not-allowed;
  }
  .knob-tab .active {
    margin-bottom: 2px;    
  }
  .knob-tab.orientation-left-top .active button{
    border-top: none;
    border-right: none;
    background-color: ${ tinycolor(config.default) };
    border-left: 4px solid ${ activeTabColor };
    font-weight: bold;    
    cursor: not-allowed;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }
  .knob-tab.orientation-left-top button {
    border-bottom: 1px solid ${ tinycolor(config.darkGray) };
  }
  .knob-tab.orientation-left-top .active {
    margin-bottom: 0px;    
  }
  .knob-radio-wrapper {
    border-bottom: 1px solid ${ tinycolor(config.darkGray) };
  }
  .knob-radio {
    margin-bottom: -1px;
  }
  .border-bottom-variation .knob-tabs button {
    background-color: transparent;
    border: none;
  }
  .border-bottom-variation .knob-tabs .active button {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 2px solid ${ activeTabColor };
  }
  .knob-tab.secondary-variation .knob-radio-wrapper {
    border-bottom: none;
    margin-left: 10px;
  }
  .knob-tab.secondary-variation .knob-radio-wrapper button {
    background-color: transparent;
    border: none;
    text-transform: lowercase;
  }
   .knob-tab.secondary-variation .knob-radio-wrapper .active button {
    color: ${ activeTabColor };
    fill: ${ activeTabColor };
  }
  .knob-panel-group {
    background-color: ${ activeButtonColor };
    padding-top: 1px;
  }
  .knob-tabs {
    background-color: ${ tinycolor(config.default) };
  }
  `;

  return cssTemplate;
};