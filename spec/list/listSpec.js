"use strict";

var ko = require("knockout");
var superdata = require("superdata");
var createList = require("../../src/list/vm");

var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var proxy = createProxy({
	idProperty: "id",
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
					}).toThrowError("config.search must be an object!");
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
								{ label: "By Id", value: "id" },
								{ label: "By Name", value: "name" }
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
								{ label: "By Id", value: "id" },
								{ label: "By Category", value: "category" }
							],
							search: "name"
						});
					}).toThrowError("values of config.sort must be in config.fields!");
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
			describe("Search", function() {
				it("should set the store's search field properly", function(done) {
					var config = {
						store: store,
						fields: Object.keys(fields),
						sort: [{
							label: "By Id",
							value: "id"
						}, {
							label: "By Name",
							value: "name"
						}],
						throttle: 300,
						search: "title"
					};

					var list = createList(config);

					list.search("My beautiful knob search works ❤!");

					setTimeout(function() {
						expect(list.store.find).toEqual({
							title: "/My beautiful knob search works ❤!/gi"
						});
						done();
					}, config.throttle + 100);
				});
			});

			describe("Sort", function() {
				it("should set the store's sort field properly", function(done) {
					var config = {
						store: store,
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

					var list = createList(config);

					list.sort(list.sortOptions[2]);

					setTimeout(function() {
						expect(list.store.sort).toEqual(list.sortOptions[2].value);
						done();
					}, 100);
				});
			});
		});
	});
});
