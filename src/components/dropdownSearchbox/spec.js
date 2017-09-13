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

            var mockSuperDataObject = {
                data: {
                    id: 1
                }
            };

            describe("With mock createList", function () {
                describe("with stateModel", function () {

                    var createdropdownSearchboxWithMock;
                    var mockStateModel;
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

                        mockStateModel = {
                            load: function (name, cb) {
                                cb(null, {
                                    data: {
                                        sort: "sort",
                                        itemsPerPage: "itemsPerPage",
                                        seatch: "search"
                                    }
                                });
                            },
                            create: function () { }
                        };

                        spyOn(mockStateModel, "load").and.callThrough();
                        spyOn(mockStateModel, "create");

                        config = {
                            store: store,
                            selected: selected,
                            stateModel: mockStateModel,
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

                    it("it should call stateModel.load and fill list porperties", function () {
                        expect(mockList.search).toHaveBeenCalled();
                        expect(mockList.initStoreHandling).toHaveBeenCalled();

                        expect(mockStateModel.load).toHaveBeenCalled();
                        expect(mockStateModel.create).toHaveBeenCalled();
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
                expect(typeof dropdownSearchbox.notFoundItem).toBe("function");
                expect(typeof dropdownSearchbox.clickMoreItem).toBe("function");
                expect(typeof dropdownSearchbox.reset).toBe("function");
            });

            it("shouldDisplay", function () {
                dropdownSearchbox.shouldDisplay();
                expect(typeof dropdownSearchbox.shouldDisplay()).toBe("boolean");
            });

            it("noResultLabel", function () {
                dropdownSearchbox.noResultLabel();
                expect(typeof dropdownSearchbox.noResultLabel()).toBe("string");
            });

            it("select", function () {
                dropdownSearchbox.select();
                expect(config.selected).not.toBe(null);
                expect(typeof dropdownSearchbox.handleSelected).toBe("function");
                expect(typeof dropdownSearchbox.reset).toBe("function");
            });

            it("should throw error with message: 'dropdownSearchbox: Invalid superdata object' ", function () {
                expect(function () {
                    dropdownSearchbox.selected({
                    });
                }).toThrowError("dropdownSearchbox: Invalid superdata object");
            });

            it("should set selectedId to null, if selected is given false", function () {
                expect(function () {
                    dropdownSearchbox.selected();
                }).not.toThrow();
                expect(dropdownSearchbox.selectedId()).toBe(null);
            });

            // it("select should set selected", function () {
            //     dropdownSearchbox.select(mockSuperDataObject);
            //     expect(dropdownSearchbox.selected()).toBe(mockSuperDataObject);
            // });

            it("changing selected should refresh selectedId", function () {
                expect(function () {
                    dropdownSearchbox.selected(mockSuperDataObject);
                }).not.toThrow();
                expect(dropdownSearchbox.selectedId()).toBe(1);
            });

            it("notFoundItem", function () {
                dropdownSearchbox.notFoundItem();
                expect(typeof dropdownSearchbox.handleNotFound).toBe("function");
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
                expect(dropdownSearchbox.selected()).toBe(null);
                expect(dropdownSearchbox.list.search).toMatch("");
            });
        });
    });
});