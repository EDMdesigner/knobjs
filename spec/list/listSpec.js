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

		describe("with empty config", function() {
			it("should return an error", function() {
				expect(function() {
					createList({});
				}).toThrowError("config.store is mandatory!");
			});
		});

		describe("only with store", function() {
			it("should return an error", function() {
				expect(function() {
					createList({
						store: {}
					});
				}).toThrowError("config.fields is mandatory!");
			});
		});

		describe("only with fields", function() {
			it("should return an error", function() {
				expect(function() {
					createList({
						fields: {}
					});
				}).toThrowError("config.store is mandatory!");
			});
		});

		describe("only with sort", function() {
			it("should return an error", function() {
				expect(function() {
					createList({
						sort: {}
					});
				}).toThrowError("config.store is mandatory!");
			});
		});

		describe("with store and fields", function() {
			it("should return an error", function() {
				expect(function() {
					createList({
						store: {},
						fields: {}
					});
				}).toThrowError("config.sort is mandatory!");
			});
		});

		describe("with store and sort", function() {
			it("should return an error", function() {
				expect(function() {
					createList({
						store: {},
						sort: {}
					});
				}).toThrowError("config.fields is mandatory!");
			});
		});

		describe("with fields and sort", function() {
			it("should return an error", function() {
				expect(function() {
					createList({
						fields: {},
						sort: {}
					});
				}).toThrowError("config.store is mandatory!");
			});
		});

	});


	describe("with valid config", function() {
		var config = {
			store: store,
			fields: fields,
			sort: ["id", "name"]
		};

		var list = createList(config);

		it("- store should be an object", function() {
			expect(typeof list.store).toBe("object");	
		});

		it("- fields should be an object", function() {
			expect(typeof list.fields).toBe("object");	
		});

		it("- search should be an observable", function() {
			expect(ko.isObservable(list.search)).toBe(true);	
		});

		/* TODO
		it("- sort should be az object", function() {
			expect(typeof list.sort).toBe("object");	
		});
		*/

		it("- sortOptions should be an array", function() {
			expect(list.sortOptions instanceof Array).toBe(true);	
		});

		/* TODO
		it("- skip should be a number", function() {
			expect(typeof list.skip).toBe("number");	
		});

		it("- limit should be a number", function() {
			expect(typeof list.limit).toBe("number");	
		});
		*/

		// items

		// count

		// loading

		// error
	});

});
