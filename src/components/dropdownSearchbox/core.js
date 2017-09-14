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
	labels: "optional object",
};

var defaultLabels = {};

module.exports = function pagedListCore(dependencies) {
	superschema.check(dependencies, dependencyPattern, "dependencies");

	var ko = dependencies.ko;
	var createList = dependencies.createList;
	var extend = dependencies.extend;

	return function createDropdownSearchbox(config) {
		superschema.check(config, configPattern, "config");

		var label = extend(true, {}, defaultLabels, config.labels);

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
			reset: reset,
			handleNotFound: handleNotFound,
			handleSelected: handleSelected,
			validator: validator,

			label: label
		};
	};
};
