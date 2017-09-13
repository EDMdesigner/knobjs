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
            var dropdownSearchbox;

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

                        var config = {
                            store: store,
                            selected: ko.observable(),
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
        });
    });
});