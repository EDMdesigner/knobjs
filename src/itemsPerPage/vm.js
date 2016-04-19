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
		label: 10,
		value: 10
	}, {
		label: 25,
		value: 25
	}, {
		label: 50,
		value: 50
	}, {
		label: 100,
		value: 100
	}];

	var itemsPerPage = ko.observable(itemsPerPageList[0]);

	var numOfPages = config.numOfPages || ko.observable();

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
		numOfPages: numOfPages,

		itemsPerPageList: itemsPerPageList,

		icons: config.icons
	};
};
