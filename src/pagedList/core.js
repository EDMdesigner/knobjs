/*jslint node: true */
"use strict";

module.exports = function pagedListCore(dependencies) {

	var obligatoryDeps = ["ko", "createList"];

	for (var i = 0; i < obligatoryDeps.length; i += 1) {
		if (typeof dependencies[obligatoryDeps[i]] === "undefined") {
			throw new Error("dependencies." + obligatoryDeps[i] + " is mandatory!");
		}
	}

	var ko = dependencies.ko;
	var createList = dependencies.createList;

	return function createPagedList(config) {
		config = config || {};

		if (!config.store) {
			throw new Error("config.store is mandatory!");
		}

		if (config.stateModel) {
			config.externalInit = true;
			if (!config.name) {
				throw new Error("If state saving is needed, config.name is mandatory!");
			}
		}

		var name = config.name;

		var stateModel = config.stateModel;
		var store = config.store;

		store.load.before.add(beforeLoad);

		var list = createList(config);

		var numOfPages = ko.observable();
		var itemsPerPage = ko.observable(10);
		var currentPage = ko.observable(0);

		list.listClass = config.listClass || "knob-pagedlist__list";
		list.itemClass = config.itemClass || "knob-pagedlist__item";
		list.numOfPages = numOfPages;
		list.itemsPerPage = itemsPerPage;
		list.currentPage = currentPage;

		list.icons = config.icons;
		list.labels = config.labels;

		if (stateModel) {
			stateModel.load(name, function(err, result) {
				if (err !== "NOT_FOUND") {
					if (result.data.sort) {
						list.sortIdx = list.findSortIdx(result.data.sort);
						list.sort(list.sortOptions[list.sortIdx]);
					}

					if (result.data.itemsPerPage) {
						list.itemsPerPage(result.data.itemsPerPage);
					}

					if (result.data.search) {
						list.search(result.data.search);
					}
				}
				initStoreHandling();
			});
		} else {
			initStoreHandling();
		}

		function initStoreHandling() {
			ko.computed(function() {
				var currentPageVal = currentPage();
				var itemsPerPageVal = itemsPerPage();

				list.skip(currentPageVal * itemsPerPageVal);
				list.limit(itemsPerPageVal);
			});


			if (stateModel) {
				list.initStoreHandling();

				ko.computed(function() {
					var sortVal = list.sort().value;
					var searchVal = list.search();
					var itemsPerPageVal = itemsPerPage();

					config.stateModel.create({
						name: name,
						sort: sortVal,
						search: searchVal,
						itemsPerPage: itemsPerPageVal
					}, function(err) {
						if (err) {
							return console.log(err);
						}
					});
				});
			}
		}

		/*
		ko.computed(function() {
			var count = list.count();
			list.pagination.numOfItems(count);
		});
		*/

		function beforeLoad() {
			list.items([]);
		}

		return list;
	};
};
