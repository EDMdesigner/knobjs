"use strict";

var ko = require("knockout");
var superdata = require("superdata");
var createList = require("./vm");

var createProp = require("./../../../node_modules/superdata/src/model/prop");
var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var proxy = createProxy({
	idProperty: "id",
	idType: "number",
	route: "/user"
});

var fields = {
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
};

var model = createModel({
	fields: fields,
	idField: "id",
	proxy: proxy
});

var store = createStore({
	model: model
});

describe("List", function() {

	describe("without config", function() {
		it("should return an error", function() {
			expect(function() {
				createList();
			}).toThrowError("config.store is mandatory!");
		});
	});

	describe("with invalid config", function() {
		describe("(existence check)", function() {
			describe("with empty config", function() {
				it("should return an error", function() {
					expect(function() {
						createList({});
					}).toThrowError("config.store is mandatory!");
				});
			});

			describe("without search", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: {},
							fields: [],
							sort: []
						});
					}).toThrowError("config.search is mandatory!");
				});
			});

			describe("without sort", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: {},
							fields: [],
							search: ""
						});
					}).toThrowError("config.sort is mandatory!");
				});
			});

			describe("without fields", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: {},
							sort: [],
							search: ""
						});
					}).toThrowError("config.fields is mandatory!");
				});
			});

			describe("without store", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							fields: [],
							sort: [],
							search: ""
						});
					}).toThrowError("config.store is mandatory!");
				});
			});
		});

		describe("(type check)", function() {
			describe("with invalid search type", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: {},
							fields: [],
							sort: [],
							search: undefined
						});
					}).toThrowError("config.search must be a string!");
				});
			});

			describe("with invalid sort type", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: {},
							fields: [],
							sort: undefined,
							search: ""
						});
					}).toThrowError("config.sort must be an array!");
				});
			});

			describe("with invalid fields type", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: {},
							fields: undefined,
							sort: [],
							search: ""
						});
					}).toThrowError("config.fields must be an array!");
				});
			});

			describe("with invalid store type", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: undefined,
							fields: [],
							sort: [],
							search: ""
						});
					}).toThrowError("config.store must be an object!");
				});
			});

			describe("with invalid orderBy format", function() {
				it("should throw Error", function() {
					expect(function() {
						createList({
							store: store,
							fields: Object.keys(fields),
							sort: [
								{ label: "By Id", value: "id" },
								{ label: "By Name", value: "name" }
							],
							search: "name",
							orderBy: "name"
						});
					}).toThrowError("config.orderBy must have the format of { <key>: [1;-1] } ");
				});
			});
		});

		describe("(relation check)", function() {
			describe("with invalid search value", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: store,
							fields: Object.keys(fields),
							sort: [
								{
									label: "By Id",
									value: "id"
								},
								{
									label: "By Name",
									value: "name"
								}
															],
							search: "category"
						});
					}).toThrowError("config.fields must contain the value of config.search!");
				});
			});

			describe("with invalid sort object", function() {
				it("should return an error", function() {
					expect(function() {
						createList({
							store: store,
							fields: Object.keys(fields),
							sort: [
								{
									label: "By Id",
									value: "id"
								},
								{
									label: "By Category",
									value: "category"
								}
															],
							search: "name"
						});
					}).toThrowError("values of config.sort must be in config.fields!");
				});
			});

			describe("with invalid orderBy key", function() {
				it("should throw Error", function() {
					expect(function() {
						createList({
							store: store,
							fields: Object.keys(fields),
							sort: [
								{ label: "By Id", value: "id" },
								{ label: "By Name", value: "name" }
							],
							search: "name",
							orderBy: { category: 1}
						});
					}).toThrowError("config.orderBy must have the format of { <key>: [1;-1] } ");
				});
			});

			describe("with invalid orderBy value", function() {
				it("should throw Error", function() {
					expect(function() {
						createList({
							store: store,
							fields: Object.keys(fields),
							sort: [
								{ label: "By Id", value: "id" },
								{ label: "By Name", value: "name" }
							],
							search: "name",
							orderBy: { name: 2}
						});
					}).toThrowError("config.orderBy must have the format of { <key>: [1;-1] } ");
				});
			});
		});

	});


	describe("with valid config", function() {

		describe("the interface should look like this:", function() {
			var config = {
				store: store,
				fields: Object.keys(fields),
				search: "title",
				sort: [
					{
						label: "By Id",
						value: "id"
					},
					{
						label: "By Name",
						value: "name"
					}
				]
			};

			var list = createList(config);

			it("- store should be an object", function() {
				expect(typeof list.store).toBe("object");
			});

			it("- fields should be an array", function() {
				expect(list.fields instanceof Array).toBe(true);
			});

			it("- search should be an observable", function() {
				expect(ko.isObservable(list.search)).toBe(true);
			});

			it("- sort should be an object observable", function() {
				expect(ko.isObservable(list.sort)).toBe(true);
				expect(typeof list.sort()).toBe("object");
			});

			it("- sortOptions should be an array", function() {
				expect(list.sortOptions instanceof Array).toBe(true);
			});

			it("- skip should be a number observable", function() {
				expect(ko.isObservable(list.skip)).toBe(true);
				expect(typeof list.skip()).toBe("number");
			});

			it("- limit should be a number observable", function() {
				expect(ko.isObservable(list.limit)).toBe(true);
				expect(typeof list.limit()).toBe("number");
			});

			it("- items should be an observable array", function() {
				expect(ko.isObservable(list.items)).toBe(true);
			});

			it("- count should be a read-only computed observable", function() {
				expect(ko.isComputed(list.count)).toBe(true);

				expect(function() {
					list.count("anything");
				}).toThrow("This computed variable should not be written.");
			});

			it("initStoreHandling should be a function", function() {
				expect(typeof list.initStoreHandling).toBe("function");
			});

			it("- loading should be a read-only computed observable", function() {
				expect(ko.isComputed(list.loading)).toBe(true);

				expect(function() {
					list.loading("anything");
				}).toThrow("This computed variable should not be written.");
			});

			it("- error should be a read-only computed observable", function() {
				expect(ko.isComputed(list.error)).toBe(true);

				expect(function() {
					list.error("anything");
				}).toThrow("This computed variable should not be written.");
			});
		});

		describe("should behave like this:", function() {
			describe("without externalInit", function() {

				var mockStore;
				var afterChanges;
				var list;

				beforeAll(function() {
					mockStore = {
						items: [],
						load: {
							before: {
								add: function() {}
							},
							after: {
								add: function() {}
							}
						}
					};

					afterChanges = {
						find: function() {},
						sort: function() {},
						skip: function() {},
						limit: function() {}
					};

					spyOn(afterChanges, "find");
					spyOn(afterChanges, "sort");
					spyOn(afterChanges, "skip");
					spyOn(afterChanges, "limit");

					createProp(mockStore, "find", {
						value: {},
						beforeChange: function() {},
						afterChange: afterChanges.find
					});

					createProp(mockStore, "sort", {
						value: {
							id: -1
						},
						beforeChange: function() {},
						afterChange: afterChanges.sort
					});

					createProp(mockStore, "skip", {
						value: 0,
						beforeChange: function() {},
						afterChange: afterChanges.skip
					});

					createProp(mockStore, "limit", {
						value: 10,
						beforeChange: function() {},
						afterChange: afterChanges.limit
					});

					var config = {
						store: mockStore,
						throttle: 1,
						fields: Object.keys(fields),
						sort: [{
							label: "By Id",
							value: "id"
						}, {
							label: "By Name",
							value: "name"
						}],
						search: "name"
					};

					list = createList(config);
				});

				it("should change store.find", function(done) {
					afterChanges.find.calls.reset();
					expect(afterChanges.find).not.toHaveBeenCalled();
					list.search("expectNotToBeSet");
					setTimeout(function() {
						expect(afterChanges.find).toHaveBeenCalled();
						done();
					}, 20);
				});

				it("should change store.sort", function(done) {
					afterChanges.sort.calls.reset();
					expect(afterChanges.sort).not.toHaveBeenCalled();
					list.sort(list.sortOptions[2]);
					setTimeout(function() {
						expect(afterChanges.sort).toHaveBeenCalled();
						done();
					}, 20);
				});

				it("should change store.skip", function(done) {
					afterChanges.skip.calls.reset();
					expect(afterChanges.skip).not.toHaveBeenCalled();
					list.skip(10);
					setTimeout(function() {
						expect(afterChanges.skip).toHaveBeenCalled();
						done();
					}, 2);
				});

				it("should change store.limit", function(done) {
					afterChanges.limit.calls.reset();
					expect(afterChanges.limit).not.toHaveBeenCalled();
					list.limit(10);
					setTimeout(function() {
						expect(afterChanges.limit).toHaveBeenCalled();
						done();
					}, 2);
				});

				describe("if value of the search observable changed", function() {
					describe("to a string", function() {
						it("should set store.find with the RegExp of the string", function(done) {
							list.search("search");

							setTimeout(function() {
								expect(mockStore.find.name).toEqual("/search/gi");
								done();
							}, 20);
						});
						it("should not convert store.find to RegExp if it's a RegExp already", function(done) {
							list.search(new RegExp("search", "gi"));

							setTimeout(function() {
								expect(mockStore.find.name.toString()).toEqual("/search/gi");
								done();
							}, 20);
						});
					});

					describe("to an array of strings", function() {
						it("should set store.find with an array of RegExps", function(done) {
							list.search(["search", "array"]);

							setTimeout(function() {
								expect(mockStore.find.name).toEqual(["/search/gi", "/array/gi"]);
								done();
							}, 20);
						});
					});
				});
			});

			describe("with externalInit, ", function() {

				var mockStore;
				var afterChanges;
				var list;

				beforeAll(function() {
					mockStore = {
						items: [],
						load: {
							before: {
								add: function() {}
							},
							after: {
								add: function() {}
							}
						}
					};

					afterChanges = {
						find: function() {},
						sort: function() {},
						skip: function() {},
						limit: function() {}
					};

					spyOn(afterChanges, "find");
					spyOn(afterChanges, "sort");
					spyOn(afterChanges, "skip");
					spyOn(afterChanges, "limit");

					createProp(mockStore, "find", {
						value: {},
						beforeChange: function() {},
						afterChange: afterChanges.find
					});

					createProp(mockStore, "sort", {
						value: {
							id: -1
						},
						beforeChange: function() {},
						afterChange: afterChanges.sort
					});

					createProp(mockStore, "skip", {
						value: 0,
						beforeChange: function() {},
						afterChange: afterChanges.skip
					});

					createProp(mockStore, "limit", {
						value: 10,
						beforeChange: function() {},
						afterChange: afterChanges.limit
					});

					var config = {
						store: mockStore,
						externalInit: true,
						throttle: 1,
						fields: Object.keys(fields),
						sort: [{
							label: "By Id",
							value: "id"
						}, {
							label: "By Name",
							value: "name"
						}],
						search: "name"
					};

					list = createList(config);
				});

				it("list should not change store.find", function(done) {
					expect(afterChanges.find).not.toHaveBeenCalled();

					list.search("expectNotToBeSet");

					setTimeout(function() {
						expect(afterChanges.find).not.toHaveBeenCalled();
						done();
					}, 2);
				});

				it("list should not change store.sort", function(done) {
					expect(afterChanges.sort).not.toHaveBeenCalled();

					list.sort(list.sortOptions[0]);
					setTimeout(function() {
						expect(afterChanges.sort).not.toHaveBeenCalled();
						done();
					}, 2);
				});

				it("list should not change store.skip", function(done) {
					expect(afterChanges.skip).not.toHaveBeenCalled();

					list.skip(10);
					setTimeout(function() {
						expect(afterChanges.skip).not.toHaveBeenCalled();
						done();
					}, 2);
				});

				it("list should not change store.limit", function(done) {
					expect(afterChanges.limit).not.toHaveBeenCalled();

					list.limit(10);
					setTimeout(function() {
						expect(afterChanges.limit).not.toHaveBeenCalled();
						done();
					}, 2);
				});
			});
		});
	});
});
