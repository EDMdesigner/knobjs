/*jslint node: true */
"use strict";

var ko = require("knockout");

function knobRegisterComponent(name, createVm, template, style, icons, labels) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				if(params.style) {
					throw new Error("style cannot be parametrized!");
				}
				
				params.style = style;

				if(!params.icons) {
					params.icons = icons;
				}
				
				if(!params.labels) {
					params.labels = labels;
				}
				
				return createVm(params, componentInfo);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;
