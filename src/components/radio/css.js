var tinycolor = require("tinycolor2");

module.exports = function(config) {

let cssTemplate = `
.knob-radio {
  overflow: hidden;
}
.knob-radio > div {
  display: inline-block;
}
.knob-radio--block > div > div {
  display: block;
}
.knob-tab.orientation {
  width: 100%;
}
.knob-tab.orientation-top-left {
  text-align: left;
}
.knob-tab.orientation-top-center {
  text-align: center;
}
.knob-tab.orientation-top-right {
  text-align: right;
}
.knob-tab.orientation-left-top .knob-radio, .knob-tab.orientation-left-top .knob-panel-group {
  float: left;
}
.knob-tab.orientation-left-top .knob-radio {
  width: 20%;
}
.knob-tab.orientation-left-top .knob-radio > div {
  width: 100%;
}
.knob-tab.orientation-left-top .knob-radio > div .knob-button {
  width: 100%;
  text-align: left;
}
.knob-tab.orientation-left-top .knob-panel-group {
  width: 80%;
}
.knob-tab.orientation-left-top .knob-tab {
  padding-top: 0;
}
.knob-tab.orientation-left-top .knob-tab p:nth-child(1) {
  margin-top: 0;
}
.knob-radio .active button {
  font-weight: bold;
  border-top: 4px solid ${ config.primary };
}
.knob-radio--block .knob-radio .active button {
  font-weight: bold;
  border-left: 5px solid ${ config.primary };
  border-top: none;
}
`;

return cssTemplate;
}