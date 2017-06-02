/* jslint node: true */
"use strict";

module.exports = function inifiteListCore(dependencies) {
	var obligatoryDeps = ["ko", "createList"];

	obligatoryDeps.forEach(function(dependency) {
		if (typeof dependencies[dependency] === "undefined") {
			throw new Error("dependencies." + dependency + " is mandatory!");
		}
	});

	var ko = dependencies.ko;
	var createList = dependencies.createList;

	return function createInfiniteList(config) {
		config = config || {};

		if (!config.store) {
			throw new Error("config.store is mandatory!");
		}

		if(!config.icons) {
			throw new Error("config.icons is mandatory!");
		}

		if(!config.icons.search) {
			throw new Error("config.icons.search is mandatory!");
		}

		if(!config.icons.dropdown) {
			throw new Error("config.icons.dropdown is mandatory!");
		}

		if(!config.icons.loading) {
			throw new Error("config.icons.loading is mandatory!");
		}

		if(!config.icons.sort) {
			throw new Error("config.icons.sort is mandatory!");
		}

		if(!config.icons.sort.asc) {
		 	throw new Error("config.icons.sort.asc is mandatory!");
		}

		if(!config.icons.sort.desc) {
			throw new Error("config.icons.sort.desc is mandatory!");
		}

		if(!config.labels) {
			throw new Error("config.labels is mandatory!");
		}

		if(!config.labels.noResults) {
			throw new Error("config.labels.noResults is mandatory!");
		}

		if(!config.labels.loadMore) {
			throw new Error("config.labels.loadMore is mandatory!");
		}

		var store = config.store;
		
		store.load.before.add(beforeLoad);
		store.load.after.add(afterLoad);
		
		var numOfInitialItems = config.numOfItems || 10;
		var numOfItemsToLoad = config.numOfItemsToLoad || 10;
		var numOfItems = 0;
		var loadMoreCalled = ko.observable(false);
		
		var list = createList(config);

		list.listClass = config.listClass || "knob-infinite-list__list";
		list.itemClass = config.itemClass || "knob-infinite-list__item";
		list.icons = config.icons;
		list.labels = config.labels;

		list.loadMore = loadMore;

		init();

		function init() {
			loadMoreCalled(true);
			load(numOfItems, numOfInitialItems);
		}

		function loadMore() {
			loadMoreCalled(true);
			load(numOfItems, numOfItemsToLoad);
		}

		function load(skip, limit) {
			list.skip(skip);
			list.limit(limit);
		}

		function beforeLoad() {
			if (!loadMoreCalled()) {
				list.items([]);
				numOfItems = 0;
				load(numOfItems, numOfInitialItems);
			}
		}

		function afterLoad() {
			if (!loadMoreCalled()) {
				numOfItems += numOfInitialItems;
				return;
			}

			loadMoreCalled(false);
			numOfItems += numOfItemsToLoad;
		}

		return list;
	};
};
