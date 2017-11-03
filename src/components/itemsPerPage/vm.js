/*jslint node: true */
"use strict";

var ko = require("knockout");

module.exports = function createItemsPerPage(config) {
	config = config || {};

	if (!config.numOfItems) {
		throw new Error("config.numOfItems element is mandatory!");
	}

	if (config.itemsPerPageList) {
		for (var i = 0; i < config.itemsPerPageList.length; i += 1) {

			if (!config.itemsPerPageList[i].value && !config.itemsPerPageList[i].label) {
				throw new Error("each element of config.items has to have label and/or value property");
			}

		}
	}

	var numOfItems = config.numOfItems;

	var itemsPerPageList = config.itemsPerPageList || [{
		label: 12,
		value: 12
	}, {
		label: 24,
		value: 24
	}, {
		label: 48,
		value: 48
	}, {
		label: 96,
		value: 96
	}];

	var itemsPerPage = ko.observable(itemsPerPageList[0]);
	var selectedIdx = findItemsPerPageIdx(config.itemsPerPage());

	if (config.itemsPerPage && config.itemsPerPage()) {
		if (selectedIdx !== -1) {
			itemsPerPage(itemsPerPageList[selectedIdx]);
		}
	}


	var numOfPages = config.numOfPages || ko.observable();

	function findItemsPerPageIdx(ippValue) {
		for (var i = 0; i < itemsPerPageList.length; i += 1) {
			if (itemsPerPageList[i].value === ippValue) {
				return i;
			}
		}
		return -1;
	}

	ko.computed(function() {
		var numOfItemsVal = numOfItems();
		var itemsPerPageVal = itemsPerPage();

		if (!itemsPerPageVal) {
			return numOfPages(0);
		}

		if (config.itemsPerPage) {
			config.itemsPerPage(itemsPerPageVal.value);
		}

		return numOfPages(Math.ceil(numOfItemsVal / itemsPerPageVal.value));
	});

	return {
		numOfItems: numOfItems,
		itemsPerPage: itemsPerPage,
		selectedIdx: selectedIdx,
		numOfPages: numOfPages,

		itemsPerPageList: itemsPerPageList,

		icons: config.icons
	};
};
