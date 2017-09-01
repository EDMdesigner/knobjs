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
  }
  .knob-tab.orientation-left-top .knob-radio {
    border-bottom: none;
  }
  .knob-tab .active button{
    border-top: 5px solid ${ baseColor === config.default ? "bababa" : baseColor };
    font-weight: bold;
    color: ${ textColor };
    fill: ${ textColor };
    cursor: not-allowed;
  }
  .knob-tab.orientation-left-top .active button{
    border-top: none;
    border-left: 4px solid ${ baseColor === config.default ? "#bababa" : baseColor };
    font-weight: bold;
    color: ${ textColor };
    fill: ${ textColor };
    cursor: not-allowed;
    border-bottom: none
  }
  .variation-primary .knob-tab .active button {
    background-color: blue;
  }

  .variation-secondary .knob-tab button {
    font-size: 16px;
  }

  .variation-secondary .knob-tab .active button {
    background-color: red;
  }  
  `;

  return cssTemplate;
};