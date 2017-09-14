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
	var element = componentInfo.element;

	var defaultTab = config.defaultTab || 0;
	var variation = config.variation || "tab";
	var selectedIdx = config.selectedIdx || ko.observable();

	var tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
	nextTabsGroupIdx += 1;

	var tabsData = ko.observableArray();

	function getIndex(node) {
		var parent = node.parentNode;
		var index = 0;
		var result = -1;
		element.childNodes.forEach(function(child) {
			if (child === parent) {
				result = index;
				return;
			}
			if (child.classList.contains("tab-wrapper")) {
				index += 1;
			}
		});
		return result;
	}

	componentInfo.templateNodes.forEach(function(node) {
		if (node.nodeName.toLowerCase() !== "smart-tab") {
			return;
		}
		var params = node.getAttribute("params") || "";
		params = "tabsData: $parents[1].tabsData," + params;
		params = "getIndex: $parents[1].getIndex," + params;
		node.setAttribute("params", params);
	});

	selectedIdx(defaultTab);

	return {
		tabsData: tabsData,
		getIndex: getIndex,
		variation: variation,
		selectedIdx: selectedIdx,
		tabsGroup: tabsGroup
	};
}

module.exports = createTabs;
