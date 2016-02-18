/*jslint node: true */
"use strict";

var ko = require("knockout");

function knobRegisterComponent(name, createVm, template, style) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params) {
				params.style = style;
				return createVm(params);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;