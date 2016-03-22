"use strict";

var ko = require("knockout");
var createPagedList = require("../../src/pagedList/vm");
var superdata = require("superdata");

describe("pagedList", function() {

	var createProxy = superdata.proxy.memory;
	var createModel = superdata.model.model;
	var createStore = superdata.store.store;

	var proxy = createProxy({
		idProperty: "id",
		route: "/user"
	});

	var model = createModel({
		fields: {
			id: {
				type: "number"
			},
			email: {
				type: "string"
			},
			name: {
				type: "string"
			},
			title: {
				type: "string"
			}
		},
		proxy: proxy
	});

	var store = createStore({
		model: model
	});

	describe('- II -', function() {

		var config = {
			store: store,
			fields: {},
			sort: ["id", "name"]
		}

		var pagedList = createPagedList(config);

		it('pagedList - interface', function() {
			expect(ko.isObservable(pagedList.numOfPages)).toBe(true);
			expect(ko.isObservable(pagedList.itemsPerPage)).toBe(true);
			expect(ko.isObservable(pagedList.currentPage)).toBe(true);
			expect(ko.isObservable(pagedList.limit)).toBe(true);
			expect(ko.isObservable(pagedList.skip)).toBe(true);
			expect(ko.isObservable(pagedList.sort)).toBe(true);
		});

		it('limit and skip function', function() {
			pagedList.itemsPerPage(0);

		});
	});


});