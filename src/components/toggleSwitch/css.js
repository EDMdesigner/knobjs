"use strict";

module.exports = function() {

let cssTemplate = `
.knob-toggle-track {
  display: block;
  width: 40px;
  height: 20px;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
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
.knob-toggle-track .knob-toggle-tick.state-active {
  margin-left: 21px;
}
.knob-toggle-track:hover {
  transition: background-color 0.4s ease-in;
}
.knob-toggle-track:hover .knob-toggle-tick {
  transition: all 0.4s;
  box-shadow: 1px 2px 3px rgba(125, 125, 125, .3);
}
.knob-toggle-track:active {
  transition: margin 0.4s ease-in;
}
`;
	return cssTemplate;
};
