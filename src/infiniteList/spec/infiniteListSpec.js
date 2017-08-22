"use strict";

var ko = require("knockout");
var superdata = require("superdata");
var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var infiniteListCore = require("../core");
var createInfiniteList = require("../vm");

describe("infiniteList", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createInfiniteList).toThrowError("config.store is mandatory!");
		});

		it("config.store missing", function() {
			expect(function() {
				createInfiniteList({
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon"
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					}
				});
			}).toThrowError("config.store is mandatory!");
		});

		it("config.icons missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					labels: {
						noResults: "result",
						loadMore: "load"
					}
				});
			}).toThrowError("config.icons is mandatory!");
		});

		it("config.icons.search missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						dropdown: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						},
						loading: "icon",
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					}
				});
			}).toThrowError("config.icons.search is mandatory!");
		});

		it("config.icons.dropdown missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					}
				});
			}).toThrowError("config.icons.dropdown is mandatory!");
		});

		it("config.icons.loading missing", function() {
			expect(function() {
				createInfiniteList({
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
						noResults: "result",
						loadMore: "load"
					}
				});
			}).toThrowError("config.icons.loading is mandatory!");
		});

		it("config.icons.sort missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon"
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					}
				});
			}).toThrowError("config.icons.sort is mandatory!");
		});

		it("config.icons.sort.asc missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon",
						sort: {
							desc: "icon"
						}
					}
				});
			}).toThrowError("config.icons.sort.asc is mandatory!");
		});

		it("config.icons.sort.desc missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon",
						sort: {
							asc: "icon"
						}
					}
				});
			}).toThrowError("config.icons.sort.desc is mandatory!");
		});

		it("config.labels missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon",
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
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						loadMore: "load"
					}
				});
			}).toThrowError("config.labels.noResults is mandatory!");
		});

		it("config.labels.loadMore missing", function() {
			expect(function() {
				createInfiniteList({
					store: "store",
					icons: {
						search: "icon",
						dropdown: "icon",
						loading: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result"
					}
				});
			}).toThrowError("config.labels.loadMore is mandatory!");
		});
	});

	describe("- with valid config", function() {
		var proxy;
		var model;
		var store;
		var config;
		var infiniteList;

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
		});

		describe("with vm", function() {
			beforeAll(function() {
				config = {
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
						loading: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					}
				};

				infiniteList = createInfiniteList(config);
			});

			it("interface", function() {
				expect(typeof infiniteList.loadMore).toBe("function");
				expect(typeof infiniteList.listClass).toBe("string");
				expect(typeof infiniteList.itemClass).toBe("string");
				expect(typeof infiniteList.icons).toBe("object");
				expect(typeof infiniteList.labels).toBe("object");
			});
		});

		describe("with loadMoreHandler", function() {
			beforeAll(function() {
				config = {
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
						loading: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					},
					loadMoreHandler: {}
				};

				infiniteList = createInfiniteList(config);
			});

			it("interface", function() {
				expect(typeof infiniteList.loadMore).toBe("function");
				expect(typeof infiniteList.listClass).toBe("string");
				expect(typeof infiniteList.itemClass).toBe("string");
				expect(typeof infiniteList.icons).toBe("object");
				expect(typeof infiniteList.labels).toBe("object");

				expect(typeof config.loadMoreHandler.loadMore).toBe("function");
			});
		});

		describe("with mock createList", function() {
			var mockList;
			var createInfiniteListWithMockedCreateList;

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

				createInfiniteListWithMockedCreateList = infiniteListCore({
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

				config = {
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
						loading: "icon",
						sort: {
							asc: "icon",
							desc: "icon"
						}
					},
					labels: {
						noResults: "result",
						loadMore: "load"
					},
					loadMoreHandler: {}
				};

				infiniteList = createInfiniteListWithMockedCreateList(config);
			});

			it("it should call load and fill list porperties", function() {
				expect(mockList.skip).toHaveBeenCalled();
				expect(mockList.limit).toHaveBeenCalled();
			});

			it("loadMore should call load", function() {
				config.loadMoreHandler.loadMore();

				expect(mockList.skip).toHaveBeenCalled();
				expect(mockList.limit).toHaveBeenCalled();
			});
		});
	});
});
