"use strict";

var ko = require("knockout");
var core = require("./core");
var extend = require("extend");

var superschema = require("superschema");


var interfacePattern = {
    list: "object",
    icons: "object",
    labels: "object",
    shouldDisplay: "observable boolean",
    noResultLabel: "observable string",
    clickMoreItem: "function",
    reset: "function",
    handleNotFound: "function",
    handleSelected: "function",
    validator: "function"
};

var createVm, vm;

var superdata = require("superdata");
var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var proxy;
var model;
var store;
var config;
var selected = ko.observable();
var dropdownSearchbox;

var createdropdownSearchboxWithMock;

var mockList = {
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

var mockCreateList = function () {
    return mockList;
};

var dependencies = {
    ko: ko,
    createList: mockCreateList,
    extend: extend
};

createdropdownSearchboxWithMock = core({
    ko: ko,
    extend: extend,
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

describe("dropdownSearchbox", function () {
    describe("config and dependency check", function () {
        beforeEach(function () {
            spyOn(superschema, "check").and.callThrough();
        });

        it("checks dependencies", function () {
            core(dependencies);
            expect(superschema.check.calls.mostRecent().args[0]).toBe(dependencies);
        });

        it("checks config", function () {
            createVm = core(dependencies);
            createVm(config);
            expect(superschema.check.calls.mostRecent().args[0]).toBe(config);
        });
    });

    describe("valid config", function () {
        beforeEach(function () {
            createVm = core(dependencies);
            vm = createVm(config);

            describe("With mock createList", function () {
                describe("with stateModel", function () {
                        spyOn(mockList, "search").and.callThrough();
                        spyOn(mockList, "initStoreHandling").and.callThrough();
                        spyOn(mockList, "items").and.callThrough();
                        spyOn(mockList, "itemsPerPage").and.callThrough();
    
                    it("mockList.search(), mockList.initStoreHandling()", function () {
                        expect(mockList.search).toHaveBeenCalled();
                        expect(mockList.initStoreHandling).toHaveBeenCalled();
                    });
                });
            });
        });

        it("interface check", function () {
            expect(function () {
                superschema.check(vm, interfacePattern);
            }).not.toThrow();
        });

        // this is just basic (and unnecessary) interface testing - functionality should be tested...
        it("select", function () {
            dropdownSearchbox.select();
            expect(typeof dropdownSearchbox.handleSelected).toBe("function");
            expect(typeof dropdownSearchbox.reset).toBe("function");
        });

        // this is just basic (and unnecessary) interface testing - functionality should be tested...
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