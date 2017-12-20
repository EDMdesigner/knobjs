/*jslint node: true */
"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	css: "function"
};

var configPattern = {
	defaultTab: "optional nullable number",
	variation: "optional string",
	selectedIdx: "optional observable",
	onTabClick: "optional function"
};

var componentInfoPattern = {
	templateNodes: {
		__type: "array",
		__elements: {
			nodeName: "string"
		}
	}
};

module.exports = function(dependencies) {
	superschema.check(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var css = dependencies.css;

	css({});

	var nextTabsGroupIdx = 0;

	return function createTabs(config, componentInfo) {
		superschema.check(config, configPattern, "config");
		superschema.check(componentInfo, componentInfoPattern, "componentInfo");

		var defaultTab = config.defaultTab;
		var variation = config.variation || "tab";
		var selectedIdx = config.selectedIdx || ko.observable();
		var displayRadio = ko.observable(false);
		var onTabClick = config.onTabClick;

		var tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
		nextTabsGroupIdx += 1;

		var tabsData = ko.observableArray();

		var tabNodes = componentInfo.templateNodes.filter(function(child) {
			return child.nodeName.toLowerCase() === "knob-tab";
		});

		tabNodes.forEach(function(node, index) {
			tabsData.push(createTabData(index));

			var bindings = node.getAttribute("data-bind") || "";
			bindings = "visible: $parent.selectedIdx() === " + index + "," + bindings;
			node.setAttribute("data-bind", bindings);

			var params = node.getAttribute("params") || "";
			params = "tabData: $parent.tabsData()[" + index + "]," + params;
			node.setAttribute("params", params);
		});

		var buttonData = ko.computed(function() {
			return tabsData().filter(function(item) {
				return item.exists();
			});
		});

		function renderRadio() {
			displayRadio(true);
		}

		if (defaultTab || defaultTab === 0) {
			selectedIdx(defaultTab);
		}

		return {
			tabsData: tabsData,
			buttonData: buttonData,
			variation: variation,
			selectedIdx: selectedIdx,
			tabsGroup: tabsGroup,
			renderRadio: renderRadio,
			displayRadio: displayRadio,
			onTabClick: onTabClick
		};
	};

	function createTabData(index) {
		return {
			label: ko.observable(),
			icon: ko.observable(),
			leftIcon: ko.observable(),
			rightIcon: ko.observable(),
			exists: ko.observable(false),
			click: null,
			index: index
		};
	}
};