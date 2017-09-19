/*jslint node: true */
"use strict";

var ko = require("knockout");
var nextTabsGroupIdx = 0;

function convertParamsToObject(params) {
	params = params.replace(/'/g, "\"");

	var params = params.split(",");

	var convertedParams = [];

	for (var idx = 0; idx < params.length; idx += 1) {
		var act = params[idx];

		act = act.trim();

		act = act.split(":");

		if (act.length !== 2) {
			continue;
		}

		act = "\"" + act[0] + "\"" + ":" + act[1];
		convertedParams.push(act);
	}

	return JSON.parse("{" + convertedParams.join(",") + "}");
}

function createTabs(config, componentInfo) {
	config = config || {};
	componentInfo = componentInfo || {};
	componentInfo.templateNodes = componentInfo.templateNodes || [];

	var defaultTab = config.defaultTab;
	var variation = config.variation || "tab";

	var vm = {};


	var tabButtons = [];
	var tabPanels = [];

	var tabIdx = 0;

	for (var idx = 0; idx < componentInfo.templateNodes.length; idx += 1) {
		var actTemplateNode = componentInfo.templateNodes[idx];

		if (actTemplateNode.nodeName.toLowerCase() !== "knob-tab") {
			continue;
		}

		var tabButtonData = convertParamsToObject(actTemplateNode.getAttribute("params"));

		tabButtonData.tabIdx = tabIdx;
		tabIdx += 1;

		tabButtons.push(tabButtonData);

		tabPanels.push(actTemplateNode.childNodes);
	}

	if (tabPanels.length < 1) {
		throw new Error("knob-tabs component should have at least one knob-tab component as a child component!");
	}

	for (var idx = 0; idx < tabButtons.length; idx += 1) {
		var act = tabButtons[idx];

		if (!act.icon && !act.leftIcon && !act.rightIcon && !act.label) {
			throw new Error("The child knob-tab components should have proper params (icon and/or label) just like with buttons!");
		}
	}

	vm.tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
	nextTabsGroupIdx += 1;

	if (ko.isObservable(config.selectedIdx)) {
		vm.selectedIdx = config.selectedIdx;
	} else {
		vm.selectedIdx = ko.observable();
	}

	if (typeof defaultTab === "number") {
		vm.selectedIdx(defaultTab);
	} else if (!vm.selectedIdx()) {
		vm.selectedIdx(0);
	}

	vm.buttons = tabButtons;
	vm.variation = variation;
	vm.panels = tabPanels;

	return vm;
}

module.exports = createTabs;
