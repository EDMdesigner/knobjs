/*jslint node: true */
"use strict";

var ko = require("knockout");

function knobRegisterComponent(name, createVm, template, style, icons, labels) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				params.style = style;
				params.icons = icons;
				params.labels = labels;
				return createVm(params, componentInfo);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;
