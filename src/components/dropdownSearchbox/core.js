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
		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (!config.store) {
			throw new Error("config.store is mandatory!");
		}

		if (!config.handleSelected) {
			throw new Error("config.handleSelected is mandatory!");
		}

		if (!config.handleNotFound) {
			throw new Error("config.handleNotFound is mandatory!");
		}

		if (!config.icons) {
			throw new Error("config.icons is mandatory!");
		}

		var store = config.store;

		store.load.before.add(beforeLoad);

		config.sort = [{
			label: "By id",
			value: "id"
		},
		{
			label: "By name",
			value: "name"
		}];

		var list = createList(config);

		var defaultValidator = function () {
			return true;
		};

		var displayAlways = config.displayAlways || false;
		var handleSelected = config.handleSelected;
		var handleNotFound = config.handleNotFound;
		var validator = config.validator || defaultValidator;

		var itemsPerPage = ko.observable(10);

		list.listClass = config.listClass || "knob-pagedlist__list";
		list.itemClass = config.itemClass || "knob-pagedlist__item";
		list.itemsPerPage = itemsPerPage;

		initStoreHandling();

		function initStoreHandling() {
			ko.computed(function () {
				list.limit(itemsPerPage());
			});
			list.initStoreHandling();
		}

		function beforeLoad() {
			list.items([]);
		}

		config.select = function (item) {
			handleSelected(item);
			reset();
		};

		var shouldDisplay = ko.computed(function () {
			return list.search() !== "" || displayAlways;
		});

		var noResultLabel = ko.computed(function () {
			if (validator(list.search())) {
				return config.labels.validLabel + list.search();
			}

			return config.labels.invalidLabel + list.search();
		});

		var clickMoreItem = function () {
			var label = list.search();
			if (!validator(label)) {
				return;
			}

			handleNotFound(label);
			reset();
		};

		var reset = function () {
			list.search("");
		};

		return {
			list: list,
			icons: config.icons,
			labels: config.labels,
			select: config.select,
			shouldDisplay: shouldDisplay,
			noResultLabel: noResultLabel,
			clickMoreItem: clickMoreItem,
			selected: config.selected,
			reset: reset,
			handleNotFound: handleNotFound,
			handleSelected: handleSelected,
			validator: validator
		};
	};
};
