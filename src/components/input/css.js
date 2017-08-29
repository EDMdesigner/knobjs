var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);

let cssTemplate = `
.knob-input {
  padding: 7px 12px;
  margin: 3px;
  border-style: solid;
  border-width: 1px;
}
.knob-input:hover {
  border: 1px solid ${ colorShades.color4 } !important	;
}
.knob-input-wrapper.active > div {
  border: 2px solid ${ colorShades.color6 } !important	;
}
.knob-input input {
  border: 0px none !important;
  outline: 0px none !important;
  background: transparent none !important;
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
