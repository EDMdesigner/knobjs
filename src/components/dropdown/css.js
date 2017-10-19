"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var baseColor = config.default;  
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";

let cssTemplate = `
.knob-dropdown-menu {
  z-index: 2;
  position: absolute;
  margin-top: 3px;
}
.knob-dropdown > div > .knob-button:hover {
  border-color: ${ tinycolor(config.primary) };  
}
.knob-dropdown > div > .knob-button {
  outline: none;
}
.knob-dropdown > div > .knob-button {
  background-color: transparent;
  border: 1px solid transparent;
  color: ${ textColor };
  fill: ${ textColor }; 
}
.knob-dropdown > .knob-dropdown-menu > div > button {
  background-color: white;
  border: 1px solid transparent;
  width: 100%; 
}
.knob-dropdown > .knob-dropdown-menu > div > button:hover {
  background-color:#f8f4f4;
  border-top-color: ${ tinycolor(config.primary) };  
  border-bottom-color: ${ tinycolor(config.primary) }; 
}
`;
	return cssTemplate;
};