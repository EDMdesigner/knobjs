"use strict";

var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

var baseColor = config.default;
var colorShades = createColorShades(baseColor);


let cssTemplate = `
	.knob-button:hover {
		background-color: ${ colorShades.color4 };
	}

	.edit-start {
		margin-left: 5px;
		cursor: pointer;
		height: 15px;
		width: 15px;
	}

	.knob-inlinetext--noedit {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.inline-editor .knob-inlinetext--noedit .edit-start {
		display: none;
	}

	.inline-editor:hover .knob-inlinetext--noedit .edit-start {
		display: block;
	}
	`;


	return cssTemplate;
};