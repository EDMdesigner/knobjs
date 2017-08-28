var tinycolor = require("tinycolor2");

module.exports = function(config) {

var baseColor = config.primary;  
var textColor = tinycolor(config.primary).isDark() ? "white" : "black";

let cssTemplate = `
  .knob-tab button {
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
    border-width: 0px;
    border-bottom-width: 1px;
    color: ${ textColor };
    fill: ${ textColor }
  }
  .knob-tab .active button{
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
    border-width: 0px;
    border-bottom-width: 1px;
    border-top: 5px solid ${ baseColor === config.default ? "black" : baseColor };
    font-weight: bold;
    color: ${ textColor };
    fill: ${ textColor };
    cursor: not-allowed;
  }
 .knob-tab.orientation-left-top button {
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
    border-width: 0px;
    border-bottom-width: 1px;
    color: ${ textColor };
    fill: ${ textColor }
  }
  .knob-tab.orientation-left-top .active button{
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
    border-width: 0px;
    border-bottom-width: 1px;
    border-left: 5px solid ${ baseColor === config.default ? "black" : baseColor };
    font-weight: bold;
    color: ${ textColor };
    fill: ${ textColor };
    cursor: not-allowed;
  }

  .primary .knob-tab .active button {
    background-color: blue;
  }

  .secondary .knob-tab button {
    font-size: 16px;
  }

  .secondary .knob-tab .active button {
    background-color: red;
  }



  
  `;

  return cssTemplate;
};