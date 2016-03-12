/*jslint node: true */
"use strict";

var ko = require("knockout");

var nextTabsGroupIdx = 0;

function convertParamsToObject(params) {
	params = params.replace(/'/g, "\"");

	var params = params.split(",");

	var convertedParams = [];

	for(var idx = 0; idx < params.length; idx += 1) {
		var act = params[idx];
		act = act.trim();

		act = act.split(":");

		act = "\"" + act[0] + "\"" + ":" + act[1];

		convertedParams.push(act);
	}

	return JSON.parse("{" + convertedParams.join(",") + "}");
}

function createTabs(config, componentInfo) {
	var defaultTab = config.defaultTab;

	var vm = {};

	var tabButtons = [];
	var tabPanels = [];

	var tabIdx = 0;
	for (var idx = 0; idx< componentInfo.templateNodes.length; idx += 1) {
		var actTemplateNode = componentInfo.templateNodes[idx];

		if (actTemplateNode.nodeName === "KNOB-TAB") {
			var tabButtonData = convertParamsToObject(actTemplateNode.getAttribute("params"));
			tabButtonData.tabIdx = tabIdx;
			tabIdx += 1;

			tabButtons.push(tabButtonData);

			tabPanels.push(actTemplateNode.childNodes);
		}
	}


	//child templates
	// - params - label, etc
	// - based on that we can build a knob-radio-button



	vm.tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
	nextTabsGroupIdx += 1;

	vm.selectedIdx = ko.observable(defaultTab);

	vm.buttons = tabButtons;
	vm.panels = tabPanels;

	return vm;
}

module.exports = createTabs;
