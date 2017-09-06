"use strict";

var tinycolor = require("tinycolor2"); 
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;
var defaultToggleTrackStates = createColorShades(config.lightGray);

let cssTemplate = `
.knob-toggle-track {
  display: block;
  width: 40px;
  height: 20px;
  cursor: pointer;
  border: 1px solid ${ defaultToggleTrackStates.color2 };
  background: ${ defaultToggleTrackStates.color1 };
  border-radius: 11px;
  transition: background-color 0.4s ease-in;
}
.knob-toggle-track .knob-toggle-tick {
  display: block;
  width: 16px;
  height: 16px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 11px;
  transition: margin 0.4s;
  box-shadow: 1px 2px 3px rgba(125, 125, 125, .25);
  margin-top: 1px;
  margin-left: 1px;
}
.knob-toggle-track.active {
  background-color: ${ tinycolor(baseColor) };  
}
.knob-toggle-track.active .knob-toggle-tick {
  margin-left: 21px;
  background-color: ${ defaultToggleTrackStates.color1 };  
}
.knob-toggle-track:hover {
  transition: background-color 0.4s ease-in;
}
.knob-toggle-track:hover .knob-toggle-tick {
  transition: all 0.4s;
  box-shadow: 1px 2px 3px rgba(125, 125, 125, .3);
}
.knob-toggle-track.active {
  transition: margin 0.4s ease-in;
}
.knob-toggle-track.square {
  border-radius: 0px;
}
.knob-toggle-track.square .knob-toggle-tick {
  border-radius: 0px;
}
.knob-toggle-track.active.warning {
  background-color: ${ tinycolor(config.warning) }; 
}
.knob-toggle-track.active.info {
  background-color: ${ tinycolor(config.info) }; 
}
.knob-toggle-track.active.error {
  background-color: ${ tinycolor(config.error) }; 
}
.knob-toggle-track.active.success {
  background-color: ${ tinycolor(config.success) }; 
}
.knob-toggle-track.active.disabled {
  background-color: ${ tinycolor(config.lightGray) };
  cursor: not-allowed; 
}
.knob-toggle-track.disabled .knob-toggle-tick {
  background-color: ${ tinycolor(config.darkGray) }; 
}
`;
	return cssTemplate;
};
