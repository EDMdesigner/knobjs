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

	return function createDropdownSearchbox(config) {
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

		if (!config.icons) {
			throw new Error("config.icons is mandatory!");
		}

		if (!config.icons.search) {
			throw new Error("config.icons.search is mandatory!");
		}

		if (!config.icons.dropdown) {
			throw new Error("config.icons.dropdown is mandatory!");
		}

		if (!config.icons.sort) {
			throw new Error("config.icons.sort is mandatory!");
		}

		if (!config.icons.sort.asc) {
			throw new Error("config.icons.sort.asc is mandatory!");
		}

		if (!config.icons.sort.desc) {
			throw new Error("config.icons.sort.desc is mandatory!");
		}

		if (!config.labels) {
			throw new Error("config.labels is mandatory!");
		}

		if (!config.labels.noResults) {
			throw new Error("config.labels.noResults is mandatory!");
		}

		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (!ko.isObservable(config.selected)) {
			throw new Error("config.selected is mandatory, and it has to be an observable!");
		}

		var name = config.name;

		var displayAlways = config.displayAlways || false;
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

		if (stateModel) {
			stateModel.load(name, function (err, result) {
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
			ko.computed(function () {
				var currentPageVal = currentPage();
				var itemsPerPageVal = itemsPerPage();

				list.skip(currentPageVal * itemsPerPageVal);
				list.limit(itemsPerPageVal);
			});


			if (stateModel) {
				list.initStoreHandling();

				ko.computed(function () {
					var sortVal = list.sort().value;
					var searchVal = list.search();
					var itemsPerPageVal = itemsPerPage();

					config.stateModel.create({
						name: name,
						sort: sortVal,
						search: searchVal,
						itemsPerPage: itemsPerPageVal
					}, function (err) {
						if (err) {
							return console.log(err);
						}
					});
				});
			}
		}

		function beforeLoad() {
			list.items([]);
		}

		//SELECT
		config.selected = config.selected;
		config.selected(null);

		config.selectedItem = ko.computed(function () {
			var selectedVal = config.selected();

			if (!selectedVal) {
				return null;
			}

			if (!selectedVal.model || !selectedVal.model.data || typeof selectedVal.model.data.id === undefined) {
				throw new Error("dropdownSearch: Invalid superdata object");
			}

			return selectedVal.model.data.id + " " + selectedVal.model.data.email + " " + selectedVal.model.data.name + " " + selectedVal.model.data.title;
		});

		config.selectedId = ko.computed(function () {
			var selectedVal = config.selected();

			if (!selectedVal) {
				return null;
			}

			if (!selectedVal.model || !selectedVal.model.data || typeof selectedVal.model.data.id === undefined) {
				throw new Error("selectablePagedList: Invalid superdata object");
			}

			return selectedVal.model.data.id;
		});

		config.select = function (item) {
			config.selected(item);
		};
		
		var shouldDisplay = ko.computed(function () {
			//console.log("search: " + list.search() !== "" + "\n");
			//console.log("seleted: " + config.selected() !== "" + "\n");
			return list.search() !== "" || displayAlways;
		});

		var addItem = ko.computed(function () {
			return "Add item " + list.search();
		});

		//return list;

		return {
			list: list,
			shouldDisplay: shouldDisplay,
			addItem: addItem,
			icons: config.icons,
			labels: config.labels,
			select: config.select,
			selectedId: config.selectedId,
			selectedItem: config.selectedItem
		};
	};
};
