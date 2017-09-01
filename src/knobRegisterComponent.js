"use strict";

var ko = require("knockout");
var extend = require("extend");

var styleElem = document.createElement("style");
document.head.appendChild(styleElem);

function knobRegisterComponent(config) {
	if (typeof config.name !== "string") {
		throw new Error("config.name has to be a string");
	}

	if (typeof config.createVm !== "function") {
		throw new Error("config.createVm has to be a function");
	}

	if (typeof config.template !== "string") {
		throw new Error("config.template has to be a string");
	}

	var name = config.name;
	var createVm = config.createVm;
	var template = config.template;
	var style = config.style;
	var css = config.css;
	var colors = config.colors;
	var lastTextNode = null;

	var optionalConfig = extend(true, {}, config);
	delete optionalConfig.name;
	delete optionalConfig.createVm;
	delete optionalConfig.template;
	delete optionalConfig.style;
	
	ko.computed(function() {
		if (css) {
			var currentColors = colors();
			var cssTemplate = css(currentColors);
			if(lastTextNode){
				styleElem.removeChild(lastTextNode);
			}
			var cssTextNode = document.createTextNode(cssTemplate);
			lastTextNode = cssTextNode;
			styleElem.appendChild(cssTextNode);
		}
	});

	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				if(params.style) {
					throw new Error("style cannot be parametrized!");
				}
				
				if (style) {
					params.style = style;
				}

				Object.keys(optionalConfig).forEach(function(prop) {
					var actOptConf = optionalConfig[prop];
					params[prop] = extend(true, actOptConf instanceof Array ? [] : {}, actOptConf, params[prop]);
				});

				return createVm(params, componentInfo);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;
