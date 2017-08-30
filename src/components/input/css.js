"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);
colorShades = colorShades+colorShades;

let cssTemplate = `
.knob-input {
  padding: 7px 12px;
  margin: 3px;
  border-style: solid;
  border-width: 1px;
}
.knob-input input {
  border: 0px none;
  outline: 0px none;
  background: transparent none;
  flex: 1 100%;
  margin-left: 3px;
  margin-right: 3px;
}
.knob-input .icon-wrapper .icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  line-height: 1;
}
.knob-input .preFixText, .knob-input .postFixText {
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
}
`;
	return cssTemplate;
};
