"use strict";

var ko = require("knockout");
var createList = require("./vm");
var core = require("./core");

var superdata = require("superdata");
var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

describe("dropdownSearchbox", function () {
    describe("- invalid dependencies", function () {
        it("dependencies.ko", function () {
            expect(function () {
                core({
                });
            }).toThrowError("dependencies.ko is mandatory!");
        });

        it("dependencies.createList", function () {
            expect(function () {
                core({
                    ko: ko
                });
            }).toThrowError("dependencies.createList is mandatory!");
        });
    });

    describe("- valid dependencies", function () {
        var createDropdownSearchbox = core({
            ko: ko,
            createList: createList
        });

        describe("- invalid config", function () {
            it("config", function () {
                expect(function () {
                    createDropdownSearchbox();
                }).toThrowError("config is mandatory!");
            });

            it("config.store", function () {
                expect(function () {
                    createDropdownSearchbox({

                    });
                }).toThrowError("config.store is mandatory!");
            });

            it("config.handleSelected", function () {
                expect(function () {
                    createDropdownSearchbox({
                        store: "store"
                    });
                }).toThrowError("config.handleSelected is mandatory!");
            });

            it("config.handleNotFound", function () {
                expect(function () {
                    createDropdownSearchbox({
                        store: "store",
                        handleSelected: "handleSelected"
                    });
                }).toThrowError("config.handleNotFound is mandatory!");
            });

            it("config.icons", function () {
                expect(function () {
                    createDropdownSearchbox({
                        store: "store",
                        handleSelected: "handleSelected",
                        handleNotFound: "handleNotFound"
                    });
                }).toThrowError("config.icons is mandatory!");
            });

        });

        describe("- with valid config", function () {
            var proxy;
            var model;
            var store;
            var config;
            var selected = ko.observable();
            var dropdownSearchbox;

            describe("With mock createList", function () {
                describe("with stateModel", function () {

                    var createdropdownSearchboxWithMock;
                    var mockList;

                    beforeAll(function () {
                        mockList = {
                            sortOptions: [1],
                            findSortIdx: function () {
                                return 0;
                            },
                            sort: function () {
                                return {
                                    value: 1
                                };
                            },
                            skip: function () { },
                            limit: function () { },
                            search: function () { },
                            initStoreHandling: function () { },
                            items: function () { },
                            itemsPerPage: function () { }
                        };

                        spyOn(mockList, "search").and.callThrough();
                        spyOn(mockList, "initStoreHandling").and.callThrough();
                        spyOn(mockList, "items").and.callThrough();
                        spyOn(mockList, "itemsPerPage").and.callThrough();

                        var mockCreateList = function () {
                            return mockList;
                        };

                        createdropdownSearchboxWithMock = core({
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
                            selected: selected,
                            name: "testdropdownSearchbox",
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
                            },
                            handleNotFound: function () { },
                            handleSelected: function () { }
                        };

                        dropdownSearchbox = createdropdownSearchboxWithMock(config);
                    });

                    it("mockList.search(), mockList.initStoreHandling()", function () {
                        expect(mockList.search).toHaveBeenCalled();
                        expect(mockList.initStoreHandling).toHaveBeenCalled();
                    });
                });
            });

            it("observables", function () {
                expect(ko.isObservable(dropdownSearchbox.noResultLabel)).toBe(true);
                expect(ko.isObservable(dropdownSearchbox.shouldDisplay)).toBe(true);
            });

            it("interface", function () {
                expect(typeof dropdownSearchbox.shouldDisplay).toBe("function");
                expect(typeof dropdownSearchbox.noResultLabel).toBe("function");

                expect(typeof dropdownSearchbox.select).toBe("function");
                expect(typeof dropdownSearchbox.clickMoreItem).toBe("function");
                expect(typeof dropdownSearchbox.reset).toBe("function");
            });

            it("shouldDisplay", function () {
                dropdownSearchbox.shouldDisplay();
                expect(typeof dropdownSearchbox.shouldDisplay()).toBe("boolean");
            });

            it("noResultLabel", function () {
                dropdownSearchbox.noResultLabel();
                expect(typeof dropdownSearchbox.noResultLabel()).toBe("number");
            });

            it("select", function () {
                dropdownSearchbox.select();
                expect(typeof dropdownSearchbox.handleSelected).toBe("function");
                expect(typeof dropdownSearchbox.reset).toBe("function");
            });

            it("clickMoreItem", function () {
                dropdownSearchbox.clickMoreItem();
                if (dropdownSearchbox.validator()) {
                    expect(typeof dropdownSearchbox.handleNotFound).toBe("function");
                }
            });

            it("reset", function () {
                dropdownSearchbox.reset();
                expect(dropdownSearchbox.list.search).toMatch("");
            });
        });
    });
});