"use strict";

var ko = require("knockout");
var pagedListCore = require("../core");
var superdata = require("superdata");
var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var createPagedList = require("../vm");

describe("pagedList", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createPagedList).toThrowError("config.store is mandatory!");
		});

		it("config.store missing", function() {
			expect(function() {
				createPagedList({
					icons: {
						search: "icon",
						dropdown: "icon",
					},
					labels: {
						noResults: "result"
					}
				});
			}).toThrowError("config.store is mandatory!");
		});

		it("config.icons missing", function() {
			expect(function() {	
				createPagedList({
					store: "store",
					labels: {
						noResults: "result"
					}
				});
			}).toThrowError("config.icons is mandatory!");
		});

		it("config.icons.search missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						dropdown: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result"
					}
				});
			}).toThrowError("config.icons.search is mandatory!");
		});

		it("config.icons.dropdown missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						search: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result"
					}
				});
			}).toThrowError("config.icons.dropdown is mandatory!");
		});

		it("config.icons.sort missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon"
					},
					labels: {
						noResults: "result"
					}
				});
			}).toThrowError("config.icons.sort is mandatory!");
		});

		it("config.icons.sort.asc missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						sort: {
							desc: "icon"
						}
					}
				});
			}).toThrowError("config.icons.sort.asc is mandatory!");
		});

		it("config.icons.sort.desc missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						sort: {
							asc: "icon"
						}
					}
				});
			}).toThrowError("config.icons.sort.desc is mandatory!");
		});

		it("config.labels missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					}
				});
			}).toThrowError("config.labels is mandatory!");
		});

		it("config.labels.noResults missing", function() {
			expect(function() {
				createPagedList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						results: "result"
					}
				});
			}).toThrowError("config.labels.noResults is mandatory!");
		});

		it("missing name if stateModel is present", function() {
			expect(function() {
				createPagedList({
					store: {},
					stateModel: {},
					icons: {
						search: "icon",
						dropdown: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						results: "result"
					}
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
					}],
					icons: {
						search: "icon",
						dropdown: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result"
					}
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
						}],
						icons: {
							search: "icon",
							dropdown: "icon",
							sort: {
								asc: "icon",
								desc: "icon"
							}
						},
						labels: {
							noResults: "result"
						}
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
