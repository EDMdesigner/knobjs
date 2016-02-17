/*jslint node: true */
"use strict";

var ko = require("knockout");



module.exports = function createList(config) {
	var store = config.store;

	var fields = config.fields;

	var search = ko.observable("").extend({throttle: 500});

	//config.sorters
	// - label
	// - prop

	var sortOptions = [];
	function createQureyObj(prop, asc) {
		var obj = {};
		obj[prop] = asc;
		return obj;
	}
	if (config.sort) {
		for(var idx = 0; idx < config.sort.length; idx += 1) {
			var act = config.sort[idx];
			sortOptions.push({
				icon: "#icon-a-z",
				label: act,
				value: createQureyObj(act, 1)
			});
			sortOptions.push({
				icon: "#icon-z-a",
				label: act,
				value: createQureyObj(act, -1)
			});
		}
	}

	var sort = ko.observable(sortOptions[0]);

	var skip = ko.observable(0);
	var limit = ko.observable(0);


	var items = ko.observableArray([]);
	store.items.forEach(function(item) { //store === this
		items.push(item);
	});

	var count = ko.observable(0); //should be read-only

	var loading = ko.observable(false); //should be read-only
	var error = ko.observable(false); //should be read-only?



	ko.computed(function() {
		var searchVal = search();
		var sortVal = sort().value;
		var skipVal = skip();
		var limitVal = limit();

		var find = {};

		find[config.search] = searchVal;

		store.find = find;
		store.sort = sortVal;
		store.skip = skipVal;
		store.limit = limitVal;
	}).extend({throttle: 0});

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
		fields: fields, //should filter to the fields. (select)

		search: search,

		sort: sort,
		sortOptions: sortOptions,

		skip: skip,
		limit: limit,

		items: items,
		count: readOnlyComputed(count),

		loading: readOnlyComputed(loading),
		error: readOnlyComputed(error)
	};
};
