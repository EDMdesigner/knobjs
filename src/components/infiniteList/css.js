"use strict";

var tinycolor = require("tinycolor2");

module.exports = function(config) {

var baseColor = config.default;
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";

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
  outline: none;
}
.knob-infinite-list .knob-infinite-list__bar .knob-input:focus {
  outline: none;
}
.knob-infinite-list .knob-infinite-list__bar .knob-dropdown, .knob-infinite-list .knob-infinite-list__bar .knob-items-per-page {
  float: right;
}
.knob-infinite-list > div > .knob-infinite-list__bar > .knob-button-search {
  float: left;
}
.knob-infinite-list > div > .knob-infinite-list__bar > .knob-button-search > .knob-button {
  border: 1px solid transparent;
  background-color: transparent;
  color: ${ textColor };
  fill: ${ textColor }; 
}
.knob-infinite-list > div > .knob-infinite-list__bar > .knob-button-search > .knob-button:hover {
  border-color: ${ tinycolor(config.primary) };  
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
.knob-infinite-list button {
  border-radius: 3px;
}
`;
	return cssTemplate;
};