"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;
var colorShades = createColorShades(baseColor);
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";

let cssTemplate = `
.knob-pagelist__result {
  border-bottom: 1px solid #ddd;
}
.knob-pagelist .knob-pagelist__bar {
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  min-height: 40px;
}
.knob-pagelist .knob-pagelist__bar .knob-input {
  float: left;
  border-color: #ddd;
  padding-bottom: 5px;
  margin: 0px;
}
.knob-pagelist .knob-pagelist__bar .knob-input:hover {
  border-color: ${ colorShades.color4 };
  outline: none;
}
.knob-pagelist .knob-pagelist__bar .knob-input:focus {
  border-color: ${ colorShades.color6 };
  outline: none;
}
.knob-pagelist .knob-pagelist__bar .knob-dropdown, .knob-pagelist .knob-pagelist__bar .knod-items-per-page {
  float: right;
}
.knob-pagelist .knob-pagelist__bar .knob-button-search {
  float: left;
}
.knob-pagelist .knob-pagedlist__list {
  list-style: none;
  padding: 0;
}
.knob-pagelist .no-result {
  text-align: center;
  display: block;
  margin: 0 auto;
  padding: 30px;
  font-size: 36px;
  color: #cacaca;
}
.knob-pagelist .loading {
  text-align: center;
}
.knob-pagelist .knob-pagelist__bar .knob-button-search button:hover {
  background-color: ${ colorShades.color4 };
  color: ${ textColor };
  fill: ${ textColor };
}
.knob-pagelist .knob-pagelist__bar .knob-dropdown button {
  color: ${ textColor };
  fill: ${ textColor };
}
.knob-pagelist .knob-pagelist__bar .knob-dropdown button:hover {
  background-color: ${ colorShades.color4 };
  color: ${ textColor };
  fill: ${ textColor };
}
`;

return cssTemplate;

};"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;
var colorShades = createColorShades(baseColor);
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";

let cssTemplate = `
.knob-pagelist__result {
  border-bottom: 1px solid #ddd;
}
.knob-pagelist .knob-pagelist__bar {
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  min-height: 40px;
}
.knob-pagelist .knob-pagelist__bar .knob-input {
  float: left;
  border-color: #ddd;
  padding-bottom: 5px;
  margin: 0px;
}
.knob-pagelist .knob-pagelist__bar .knob-input:hover {
  border-color: ${ colorShades.color4 };
  outline: none;
}
.knob-pagelist .knob-pagelist__bar .knob-input:focus {
  border-color: ${ colorShades.color6 };
  outline: none;
}
.knob-pagelist .knob-pagelist__bar .knob-dropdown, .knob-pagelist .knob-pagelist__bar .knod-items-per-page {
  float: right;
}
.knob-pagelist .knob-pagelist__bar .knob-button-search {
  float: left;
}
.knob-pagelist .knob-pagedlist__list {
  list-style: none;
  padding: 0;
}
.knob-pagelist .no-result {
  text-align: center;
  display: block;
  margin: 0 auto;
  padding: 30px;
  font-size: 36px;
  color: #cacaca;
}
.knob-pagelist .loading {
  text-align: center;
}
.knob-pagelist .knob-pagelist__bar .knob-button-search button:hover {
  background-color: ${ colorShades.color4 };
  color: ${ textColor };
  fill: ${ textColor };
}
.knob-pagelist .knob-pagelist__bar .knob-dropdown button {
  color: ${ textColor };
  fill: ${ textColor };
}
.knob-pagelist .knob-pagelist__bar .knob-dropdown button:hover {
  background-color: ${ colorShades.color4 };
  color: ${ textColor };
  fill: ${ textColor };
}
`;

return cssTemplate;

};