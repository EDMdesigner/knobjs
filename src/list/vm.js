/*jslint node: true */
"use strict";

var ko = require("knockout");

module.exports = function createList(config) {
	config = config || {};

	if (!config.hasOwnProperty("store")) {
		throw new Error("config.store is mandatory!");
	}

	if (!config.hasOwnProperty("fields")) {
		throw new Error("config.fields is mandatory!");
	}

	if (!config.hasOwnProperty("sort")) {
		throw new Error("config.sort is mandatory!");
	}

	if (!config.hasOwnProperty("search")) {
		throw new Error("config.search is mandatory!");
	}

	if (typeof config.store !== "object") {
		throw new Error("config.search must be an object!");
	}

	if (!(config.fields instanceof Array)) {
		throw new Error("config.fields must be an array!");
	}

	if (!(config.sort instanceof Array)) {
		throw new Error("config.sort must be an array!");
	}

	if (typeof config.search !== "string") {
		throw new Error("config.search must be a string!");
	}

	if (config.fields.indexOf(config.search) === -1) {
		throw new Error("config.fields must contain the value of config.search!");
	}

	var orderField;

	if (config.orderBy) {
		if (typeof config.orderBy !== "object") {
			throw new Error("config.orderBy must have the format of { <key>: [1;-1] } ");
		}

		orderField = Object.keys(config.orderBy)[0];
		if (config.fields.indexOf(orderField) === -1 || Math.abs(config.orderBy[orderField]) !== 1) {
			throw new Error("config.orderBy must have the format of { <key>: [1;-1] } ");
		}

		var sortContainsOrderField = false;

		config.sort.forEach(function(item) {
			if (item.value === orderField) {
				sortContainsOrderField = true;
				return;
			}
		});

		if (!sortContainsOrderField) {
			throw new Error("config.sort must contain the value of config.orderBy!");
		}
	}

	config.sort.forEach(function(item) {
		if (config.fields.indexOf(item.value) === -1) {
			throw new Error("values of config.sort must be in config.fields!");
		}
	});

	var store = config.store;
	var fields = config.fields;

	var search = ko.observable("").extend({
		throttle: config.throttle || 500
	});

	var sortOptions = [];

	function findSortIdx(orderBy) {
		var idx;

		for (var i = 0; i < sortOptions.length; i += 1) {
			var actOption = sortOptions[i].value;
			var optionField = Object.keys(actOption)[0];
			var orderByField = Object.keys(orderBy)[0];

			if (optionField === orderByField &&
				actOption[optionField] === orderBy[orderByField]) {
				idx = i;
			}
		}
		return idx;
	}

	function createQueryObj(prop, asc) {
		var obj = {};

		obj[prop] = asc;

		return obj;
	}

	for (var idx = 0; idx < config.sort.length; idx += 1) {
		var act = config.sort[idx];

		var ascIcon = config.icons ? config.icons.sort.asc : "";
		var descIcon = config.icons ? config.icons.sort.desc : "";

		sortOptions.push({
			icon: ascIcon,
			label: act.label,
			value: createQueryObj(act.value, 1)
		});
		sortOptions.push({
			icon: descIcon,
			label: act.label,
			value: createQueryObj(act.value, -1)
		});
	}

	var defaultOrderIdx;

	if (orderField) {
		defaultOrderIdx = findSortIdx(config.orderBy);
	}

	var sort = ko.observable(sortOptions[defaultOrderIdx || 0]);

	var sortIdx = ko.computed(function() {
		var sortVal = sort().value;

		return findSortIdx(sortVal);
	});

	var skip = ko.observable(0);
	var limit = ko.observable(0);

	var items = ko.observableArray([]);

	store.items.forEach(function(item) { //store === this
		items.push(item);
	});

	var count = ko.observable(0); //should be read-only

	var loading = ko.observable(false); //should be read-only
	var error = ko.observable(false); //should be read-only?

	var initStoreHandling = function() {
		ko.computed(function() {
			var searchVal = search();
			var sortVal = sort().value;
			var skipVal = skip();
			var limitVal = limit();

			var find = {};

			find[config.search] = (new RegExp(searchVal, "ig")).toString();

			store.find = find;
			store.sort = sortVal;
			store.skip = skipVal;
			store.limit = limitVal;
		}).extend({
			throttle: 0
		});
	};

	if (!config.externalInit) {
		initStoreHandling();
	}


	function beforeLoad() {
		if (loading()) {
			console.log("List is already loading..."); //this might be problematic if there are no good timeout settings.
		}

		loading(true);
	}

	function afterLoad(err) {
		loading(false);
		if (err) {
			return error(err);
		}
		error(null);

		store.items.forEach(function(item) { //store === this
			items.push(item);
		});

		count(store.count);
	}

	function readOnlyComputed(observable) {
		return ko.computed({
			read: function() {
				return observable();
			},
			write: function() {
				throw "This computed variable should not be written.";
			}
		});
	}

	store.load.before.add(beforeLoad);
	store.load.after.add(afterLoad);

	return {
		store: store,

		fields: fields, //should filter to the fields. (select)

		search: search,

		sort: sort,
		sortIdx: sortIdx(),
		sortOptions: sortOptions,

		skip: skip,
		limit: limit,

		items: items,
		count: readOnlyComputed(count),

		findSortIdx: findSortIdx,
		initStoreHandling: initStoreHandling,

		loading: readOnlyComputed(loading),
		error: readOnlyComputed(error)
	};
};
