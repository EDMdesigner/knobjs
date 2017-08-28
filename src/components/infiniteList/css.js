var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.primary;  
var colorShades = createColorShades(baseColor);


let cssTemplate = `
.knob-infinite-list .knob-infinite-list__bar {
  overflow: hidden;
  border-bottom: 1px solid #ddd;
}
.knob-infinite-list .knob-infinite-list__bar .knob-input {
  float: left;
  border-color: #ddd;
  margin-top: 0px;
  padding-bottom: 5px;
}
.knob-infinite-list .knob-infinite-list__bar .knob-input:hover {
  border-color: ${ colorShades.color5 };
}
.knob-infinite-list .knob-infinite-list__bar .knob-dropdown, .knob-infinite-list .knob-infinite-list__bar .knob-items-per-page {
  float: right;
}
.knob-infinite-list .knob-infinite-list__bar .knob-button-search {
  float: left;
}
.knob-infinite-list .knob-infinite-list__list {
  list-style: none;
  padding: 0;
}
.knob-infinite-list .no-result {
  text-align: center;
  display: block;
  margin: 0 auto;
  padding: 30px;
  font-size: 36px;
  color: #cacaca;
}
button {
  border-radius: 3px;
}
button:hover {
  background-color: ${ colorShades.color4 };
}
`;
	return cssTemplate;
};