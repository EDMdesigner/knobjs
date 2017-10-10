"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	createList: "function",
	extend: "function"
};

var configPattern = {
	store: "object",
	fields: "array",
	search: "string",
	newItemEnabled: "optional boolean",
	selectCallback: "function",
	newItemCallback: "optional function",
	validator: "optional function",
	icons: "object",
	itemsPerPage: "optional number",
	labels: "optional object",
};

var defaultLabels = {
	newItem: "Add ",
	invalidItem: "Invalid item: ",
	notFound: "Can't find item ",
	placeholder: "Search..."
};

var defaultItemsPerPage = 10;

function defaultValidator() {
	return true;
}

module.exports = function pagedListCore(dependencies) {
	superschema.check(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var createList = dependencies.createList;
	var extend = dependencies.extend;

	return function createDropdownSearchbox(config) {
		superschema.check(config, configPattern, "config");

		var labels = extend(true, {}, defaultLabels, config.labels);
		var itemsPerPage = ko.observable(config.itemsPerPage || defaultItemsPerPage);
		var newItemEnabled = config.newItemEnabled || false;
		var displayAlways = config.displayAlways || false;
		var newItemCallback = config.newItemCallback;
		var selectCallback = config.selectCallback;
		var validator = config.validator || defaultValidator;

		if (newItemEnabled && !newItemCallback) {
			throw new Error("config.newItemCallback is mandatory if adding new items is enabled!");
		}

		var store = config.store;

		store.load.before.add(beforeLoad);

		config.sort = [{
			value: config.search
		}];

		var list = createList(config);

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

		function select(item) {
			selectCallback(item.data);
			reset();
		}

		var shouldDisplay = ko.computed(function () {
			return list.search() !== "" || displayAlways;
		});

		var noResultLabel = ko.computed(function () {
			if (!newItemEnabled) {
				return labels.notFound;
			}
			if (validator(list.search())) {
				return labels.newItem + list.search();
			}

			return labels.invalidItem + list.search();
		});

		function addNewItem() {
			if (!newItemEnabled) {
				return;
			}
			var newItem = list.search();
			if (!validator(newItem)) {
				return;
			}

			newItemCallback(newItem);
			reset();
		}

		function reset() {
			list.search("");
		}

		return {
			list: list,
			icons: config.icons,
			select: select,
			shouldDisplay: shouldDisplay,
			noResultLabel: noResultLabel,
			addNewItem: addNewItem,

			labels: labels
		};
	};
};
