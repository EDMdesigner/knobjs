"use strict";

var ko = require("knockout");
var createPagedList = require("../../src/pagedList/vm");
var superdata = require("superdata");

describe("pagedList", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createPagedList).toThrowError("config.store is mandatory!");
		});

		it("missing name if stateModel is present", function() {
			expect(function() {
				createPagedList({
					store: {},
					stateModel: {}
				});
			}).toThrowError("If state saving is needed, config.name is mandatory!");
		});
	});

	describe("- with valid config", function() {

		var createProxy = superdata.proxy.memory;
		var createModel = superdata.model.model;
		var createStore = superdata.store.store;

		var proxy = createProxy({
			idProperty: "id",
			idType: "number",
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
			idField: "id",
			proxy: proxy
		});

		var store = createStore({
			model: model
		});

		var config = {
			store: store,
			fields: ["title", "id", "name"],
			search: "title",
			sort: [{
				label: "By Id",
				value: "id"
			}, {
				label: "By Name",
				value: "name"
			}]
		};

		var pagedList = createPagedList(config);

		it("interface", function() {
			expect(ko.isObservable(pagedList.numOfPages)).toBe(true);
			expect(ko.isObservable(pagedList.itemsPerPage)).toBe(true);
			expect(ko.isObservable(pagedList.currentPage)).toBe(true);
			expect(ko.isObservable(pagedList.limit)).toBe(true);
			expect(ko.isObservable(pagedList.skip)).toBe(true);
			expect(ko.isObservable(pagedList.sort)).toBe(true);
		});

		it("limit and skip function", function() {
			pagedList.itemsPerPage(100);
			pagedList.currentPage(5);

			expect(pagedList.limit()).toBe(100);
			expect(pagedList.skip()).toBe(500);
		});
	});
});
