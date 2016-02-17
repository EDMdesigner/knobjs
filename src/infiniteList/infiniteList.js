/*jslint node: true */
"use strict";

var ko = require("knockout");

var createList = require("./list");

module.exports = function createInfiniteList(config) {
	var store = config.store;
	var originalNumOfItems = config.numOfItems || 10;
	var numOfItems = originalNumOfItems;
	var numOfItemsToLoad = config.numOfItemsToLoad || 10;
	var skip = 0;


	var list = createList(config);
	//+sorters & filters

	var loadMoreCalled = false;

	store.load.before.add(function(err, result) {
		if (!loadMoreCalled) {
			list.items([]);
		}
	});

	//this should be in list.js
	store.load.after.add(function(err, result) {
		numOfItems += numOfItemsToLoad;
		loadMoreCalled = false;
	});

	load(0, numOfItems);
	function load(skip, limit) {
		store.skip = skip;
		store.limit = limit;
	}

	function loadMore() {
		loadMoreCalled = true;
		load(numOfItems, numOfItemsToLoad);
	}

	list.loadMore = loadMore;

	return list;
};
