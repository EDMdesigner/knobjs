
"use strict";

module.exports = function(dependencies) {

	var ko = dependencies.ko;

	return function createColorPickerBinding() {

		var defaultLabels = {
			currentColor: "Current color: ",
			lastUsedColors: "Last used colors: ",
			colorPickerButton: "OK"
		};

		var colorPickerButton = {
			label: defaultLabels.colorPickerButton,
			click: colorPickerButtonClick
		};

		function colorPickerButtonClick() {

		}
		

		var chosenColor = ko.computed(function() {

		});
		
		/*
		ko.bindingHandlers.colorPicker = {			//valuAccessor lesz az observable
			init: function(element, valueAccessor) {
				// create layer div
				var previewLayer = document.createElement("div");

				previewLayer.setAttribute("class", "previewJSON-layer");
				element.appendChild(previewLayer);
				element.setAttribute("class", "previewJSON");
			},
			update: function(element, valueAccessor) {
				var value = valueAccessor();
				var config = ko.unwrap(value);

				checkParams(config, configPattern, "config");

				var mailJSON = config.mailJSON;
				var scroll = config.scroll;
				var height = config.height;
				var interfaceObj = config.interface || {};
				interfaceObj.callbacks = interfaceObj.callbacks || {};

				var DOMHeightCallback = function() {};
				if (typeof interfaceObj.callbacks.DOMHeight === "function") {
					DOMHeightCallback = interfaceObj.callbacks.DOMHeight;
				}


				var serviceId = generateId();

				var jsonPreviewConfig = {
					id: serviceId,
					parentElement: element,
					documentJSON: mailJSON,
					scroll: scroll,
					height: height,
					callbacks: {
						DOMHeight: function(height) {
							console.log("JSONpreview: " + height + " px DOMHeight received.");
							DOMHeightCallback(height, {
								iframe: pluginConnector.getInstance(serviceId).iframe,
								parentElement: element
							});

							return;
						}
					}
				};

				pluginConnector.create(jsonPreviewConfig);

				ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
					pluginConnector.destroy(serviceId);
				});
			}
		};
		*/

		return {
			defaultLabels: defaultLabels,
			colorPickerButton: colorPickerButton,
			chosenColor: chosenColor
		};
	};
};


