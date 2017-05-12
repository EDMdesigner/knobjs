/* jslint node: true */
"use strict";

module.exports = function inifiteListCore(dependencies) {
	var obligatoryDeps = ["ko", "createList"];

	for (var i = 0; i < obligatoryDeps.length; i += 1) {
		if (typeof dependencies[obligatoryDeps[i]] === "undefined") {
			throw new Error("dependencies." + obligatoryDeps[i] + " is mandatory!");
		}
	}

	var ko = dependencies.ko;
	var createList = dependencies.createList;

	return function createInfiniteList(config) {
		config = config || {};

		if (!config.store) {
			throw new Error("config.store is mandatory!");
		}

		var store = config.store;
		
		store.load.before.add(beforeLoad);
		store.load.after.add(afterLoad);
		
		var list = createList(config);
		
		var numOfItems = config.numOfItems || 10;
		var numOfItemsToLoad = config.numOfItemsToLoad || 10;
		var loadMoreCalled = ko.observable(false);

		load(0, numOfItems);

		function beforeLoad() {
			if (!loadMoreCalled()) {
				list.items([]);
			}
		}

		function afterLoad() {
			numOfItems += numOfItemsToLoad;
			loadMoreCalled(false);
		}
		
		function load(skip, limit) {
			list.skip(skip);
			list.limit(limit);
		}

		function loadMore() {
			loadMoreCalled(true);
			load(numOfItems, numOfItemsToLoad);
		}

		list.loadMore = loadMore;

		return list;
	};
};
