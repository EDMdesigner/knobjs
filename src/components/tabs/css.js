"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var baseColor = tinycolor(config.primary);  
var textColor = tinycolor(config.primary).isDark() ? "white" : "black";

let cssTemplate = `
  .knob-tab button {
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
    border-width: 0px;
    color: ${ textColor };
    fill: ${ textColor }
    position: relative;
  }
  .knob-tab .active button{
    border-top: 3px solid ${ baseColor === config.default ? "bababa" : baseColor };
    font-weight: bold;
    color: ${ textColor };
    fill: ${ textColor };
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-left: 1px solid ${ tinycolor(config.darkGray) };
    border-right: 1px solid ${ tinycolor(config.darkGray) };
    border-bottom: transparent;
    background-color: white;
    cursor: not-allowed;
  }
  .knob-tab .active {
    margin-bottom: 2px;    
  }
  .knob-tab.orientation-left-top .active button{
    border-top: none;
    border-left: 4px solid ${ baseColor === config.default ? "#bababa" : baseColor };
    font-weight: bold;    
    cursor: not-allowed;
  }
  .knob-radio-wrapper {
    border-bottom: 1px solid ${ tinycolor(config.default) };
  }
  .knob-radio {
    margin-bottom: -3px;
  }
  `;

  return cssTemplate;
};