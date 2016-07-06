"use strict";

var ko = require("knockout");
var pagedListCore = require("../../src/pagedList/core");
var superdata = require("superdata");
var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var createPagedList = require("../../src/pagedList/vm");

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


		var proxy;
		var model;
		var store;
		var pagedList;

		describe("with vm", function() {

			beforeAll(function() {
				proxy = createProxy({
					idProperty: "id",
					idType: "number",
					route: "/user"
				});

				model = createModel({
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

				store = createStore({
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

				pagedList = createPagedList(config);
			});

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

		describe("With mock createList", function() {

			describe("with stateModel", function() {

				var createPagedListWithMockCreateList;
				var mockStateModel;
				var mockList;

				beforeAll(function() {
					mockList = {
						sortOptions: [1],
						findSortIdx: function() {
							return 0;
						},
						sort: function() {
							return {
								value: 1
							};
						},
						skip: function() {},
						limit: function() {},
						search: function() {},
						initStoreHandling: function() {},
						items: function() {},
						itemsPerPage: function() {}
					};

					spyOn(mockList, "findSortIdx").and.callThrough();
					spyOn(mockList, "sort").and.callThrough();
					spyOn(mockList, "skip").and.callThrough();
					spyOn(mockList, "limit").and.callThrough();
					spyOn(mockList, "search").and.callThrough();
					spyOn(mockList, "initStoreHandling").and.callThrough();
					spyOn(mockList, "items").and.callThrough();
					spyOn(mockList, "itemsPerPage").and.callThrough();

					var mockCreateList = function() {
						return mockList;
					};

					createPagedListWithMockCreateList = pagedListCore({
						ko: ko,
						createList: mockCreateList
					});

					proxy = createProxy({
						idProperty: "id",
						idType: "number",
						route: "/user"
					});

					model = createModel({
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

					store = createStore({
						model: model
					});

					mockStateModel = {
						load: function(name, cb) {
							cb(null, {
								data: {
									sort: "sort",
									itemsPerPage: "itemsPerPage",
									seatch: "search"
								}
							});
						},
						create: function() {}
					};

					spyOn(mockStateModel, "load").and.callThrough();
					spyOn(mockStateModel, "create");

					var config = {
						store: store,
						stateModel: mockStateModel,
						name: "testPagedList",
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

					pagedList = createPagedListWithMockCreateList(config);
				});

				it("it should call stateModel.load and fill list porperties", function() {
					expect(mockStateModel.load).toHaveBeenCalled();
					expect(mockList.findSortIdx).toHaveBeenCalled();
					expect(mockList.sort).toHaveBeenCalled();
					// expect(mockList.itemsPerPage).toHaveBeenCalled();
					expect(mockList.search).toHaveBeenCalled();
					expect(mockList.initStoreHandling).toHaveBeenCalled();

					expect(mockStateModel.create).toHaveBeenCalled();

				});
			});
		});
	});
});
