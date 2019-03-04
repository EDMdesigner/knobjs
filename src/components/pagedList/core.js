/*jslint node: true */
"use strict";

var defaultPaddingInterval = 300; // in ms

module.exports = function pagedListCore(dependencies) {

	var obligatoryDeps = ["ko", "createList", "document"];

	for (var i = 0; i < obligatoryDeps.length; i += 1) {
		if (typeof dependencies[obligatoryDeps[i]] === "undefined") {
			throw new Error("dependencies." + obligatoryDeps[i] + " is mandatory!");
		}
	}

	var ko = dependencies.ko;
	var createList = dependencies.createList;
	const document = dependencies.document;
	let customId = 0;

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

		if(!config.icons) {
			throw new Error("config.icons is mandatory!");
		}

		if(!config.icons.search) {
			throw new Error("config.icons.search is mandatory!");
		}

		if(!config.icons.dropdown) {
			throw new Error("config.icons.dropdown is mandatory!");
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

		if(config.itemsPerPageList && !Array.isArray(config.itemsPerPageList)) {
			throw new Error("config.itemsPerPageList has to be an array!");
		}

		if(config.fakeListItems && config.fakeListItems.paddingInterval && typeof config.fakeListItems.paddingInterval !== "number") {
			throw new Error("config.padding has to be a number");
		}

		customId += 1;
		var actId = customId;

		var name = config.name;
		var hasFakeItems = !!config.fakeListItems;

		var stateModel = config.stateModel;
		var store = config.store;

		store.load.before.add(beforeLoad);
		store.load.after.add(() => setTimeout(afterLoad));

		var list = createList(config);
		list.customId = customId;
		list.actId = actId;

		var numOfPages = ko.observable();
		var itemsPerPage = ko.observable(10);
		var currentPage = ko.observable(0);

		list.listClass = config.listClass || "knob-pagedlist__list";
		list.itemClass = config.itemClass || "knob-pagedlist__item";
		list.numOfPages = numOfPages;
		list.itemsPerPage = itemsPerPage;
		list.itemsPerPageList = config.itemsPerPageList;
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

		list.randomID = "knob-paged-list-" + Math.random().toString().slice(2);

		list.paddingWidth = ko.observable(0);
		list.paddingHeight = ko.observable(0);
		list.paddingCount = ko.observable(0);

		list.paddingItems = ko.computed(function() {
			if (!hasFakeItems) {
				return [];
			}
			var count = list.paddingCount();
			var result = [];
			for (var i = 0; i < count; i += 1) {
				result.push({});
			}
			return result;
		});

		function calculatePaddingSizes() {
			var listContainer = document.getElementById(list.randomID);
			if (!listContainer) {
				return;
			}
			var listItems = listContainer.getElementsByTagName("li");
			var itemCount = listItems.length;
			var listItem = listItems[0];
			if (!itemCount) {
				list.paddingCount(0);
				return;
			}
			var listWidth = listContainer.clientWidth;
			var itemWidth = listItem.clientWidth;
			var itemHeight = listItem.clientHeight;
			if (!itemWidth) {
				return;
			}
			var itemsPerRow = Math.floor(listWidth / itemWidth);
			var lastRowLength = (itemCount % itemsPerRow) || itemsPerRow;

			list.paddingWidth(itemWidth + "px");
			list.paddingHeight(itemHeight + "px");
			list.paddingCount(itemsPerRow - lastRowLength);
		}

		if (hasFakeItems) {
			window.addEventListener("resize", calculatePaddingSizes);
			// SO HACKY...

			var paddingInterval = config.fakeListItems.paddingInterval || defaultPaddingInterval;
			window.setInterval(calculatePaddingSizes, paddingInterval);
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

		function afterLoad() {
			return setTimeout(() => {
				const input = document.getElementsByClassName(`pagedlist-search${actId}`)[0];

				if (input.value !== list.search()) {
					input.value = "";
				}

				return input ? input.removeAttribute("disabled") : console.warn(`No input found for class: pagedlist-search${actId}!`);
			}, 2500);
		}

		return list;
	};
};
