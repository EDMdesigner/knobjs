/*jslint node: true */
"use strict";

var ko = require("knockout");
var superschema = require("superschema");

var configPattern = {
	defaultTab: "optional number",
	variation: "optional string",
	selectedIdx: "optional observable"
};

var nextTabsGroupIdx = 0;

function createTabs(config, componentInfo) {
	superschema.check(config, configPattern, "config");

	componentInfo = componentInfo || {};
	componentInfo.templateNodes = componentInfo.templateNodes || [];

	var defaultTab = config.defaultTab || 0;
	var variation = config.variation || "tab";
	var selectedIdx = config.selectedIdx || ko.observable();

	var tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
	nextTabsGroupIdx += 1;

	var tabsData = ko.observableArray();

	var tabNodes = componentInfo.templateNodes.filter(function(child) {
		return child.nodeName.toLowerCase() === "smart-tab";
	});

	tabNodes.forEach(function(node, index) {
		tabsData.push(createTabData(index));

		var bindings = node.getAttribute("data-bind") || "";
		bindings += "visible: selectedIdx() === " + index + ",";
		node.setAttribute("data-bind", bindings);

		var params = node.getAttribute("params") || "";
		params = "tabData: tabsData()[" + index + "]," + params;
		node.setAttribute("params", params);
	});

	selectedIdx(defaultTab);

	console.log("tabs");

	return {
		tabsData: tabsData,
		variation: variation,
		selectedIdx: selectedIdx,
		tabsGroup: tabsGroup
	};
}

function createTabData(index) {
	return {
		label: ko.observable(),
		icon: ko.observable(),
		leftIcon: ko.observable(),
		rightIcon: ko.observable(),
		exists: ko.observable(false),
		index: index
	};
}

module.exports = createTabs;
