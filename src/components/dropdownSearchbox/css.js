"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;
var colorShades = createColorShades(baseColor);
var textColor = tinycolor(baseColor).isDark() ? "white" : "black";
var selectedColor = tinycolor(colorShades.color4).isDark() ? colorShades.color2 : colorShades.color5;

let cssTemplate = `
.knob-dropdown-searchbox {
    border: 1px solid #131313;
    overflow: hidden;
  }
  .knob-dropdown-searchbox .selected {
    color: ${ selectedColor };
  }
  .knob-dropdown-searchbox .knob-pagelist__bar {
    overflow: hidden;
    border-bottom: 1px solid  ${ colorShades.color4 };
  }
  .knob-dropdown-searchbox .knob-pagelist__bar .knob-input {
    float: left;
    border-color:  ${ colorShades.color4 };
  }
  .knob-dropdown-searchbox .knob-pagelist__bar .knob-input:hover {
    border-color: ${ colorShades.color4 };
  }
  .knob-dropdown-searchbox .knob-pagelist__bar .knob-button-search {
    float: left;
  }
  .knob-dropdown-searchbox .knob-pagedlist__list {
    list-style: none;
    padding: 0;
  }
  .knob-dropdown-searchbox .no-result {
    text-align: left;
    display: block;
    margin: 0 auto;
    padding: 2px;
    color: #cacaca;
  }
  .knob-dropdown-searchbox .moreItem {
    text-align: left;
    margin: 0 auto;
    padding: 2px;
    background-color: ${ selectedColor };
    color: ${ textColor };
  }
  .knob-dropdown-searchbox .selected-item {
    text-align: left;
    display: block;
    margin: 0 auto;
    padding: 2px;
    background-color: ${ selectedColor };
    color: ${ textColor };
  }
`;

return cssTemplate;

};