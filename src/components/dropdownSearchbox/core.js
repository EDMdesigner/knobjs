"use strict";

var superschema = require("superschema");

var dependencyPattern = {
	ko: "object",
	createList: "function",
	extend: "function"
};

var configPattern = {
	store: "object",
	handleSelected: "function",
	handleNotFound: "function",
	validator: "optional function",
	icons: "object",
	itemsPerPage: "optional number",
	labels: "optional object",
};

var defaultLabels = {
	validLabel: "Add",
	invalidLabel: "Invalid item"
};
var defaultItemsPerPage = 10;

module.exports = function pagedListCore(dependencies) {
	superschema.check(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var createList = dependencies.createList;
	var extend = dependencies.extend;

	return function createDropdownSearchbox(config) {
		superschema.check(config, configPattern, "config");

		var labels = extend(true, {}, defaultLabels, config.labels);
		var itemsPerPage = ko.observable(config.itemsPerPage || defaultItemsPerPage);

		var store = config.store;

		store.load.before.add(beforeLoad);

		config.sort = [{
			value: "id"
		}];

		var list = createList(config);

		var defaultValidator = function () {
			return true;
		};

		var displayAlways = config.displayAlways || false;
		var handleSelected = config.handleSelected;
		var handleNotFound = config.handleNotFound;
		var validator = config.validator || defaultValidator;


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
				return labels.validLabel + list.search();
			}

			return labels.invalidLabel + list.search();
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
			select: config.select,
			shouldDisplay: shouldDisplay,
			noResultLabel: noResultLabel,
			clickMoreItem: clickMoreItem,
			reset: reset,
			handleNotFound: handleNotFound,
			handleSelected: handleSelected,
			validator: validator,

			labels: labels
		};
	};
};
