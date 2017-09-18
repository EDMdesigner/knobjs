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
    addNewItem: "function",
    select: "function"
};

var createVm, vm;

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
    search: ko.observable(""),
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

var mockStore = {
    load: {
        before: {
            add: function() {}
        }
    }
};

var config = {
    store: mockStore,
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
    newItemCallback: function () {},
    selectCallback: function () {},
    newItemEnabled: true
};

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
            spyOn(mockList, "search").and.callThrough();
            spyOn(mockList, "initStoreHandling").and.callThrough();
            spyOn(mockList, "items").and.callThrough();
            spyOn(mockList, "itemsPerPage").and.callThrough();
            spyOn(config, "selectCallback");
            spyOn(config, "newItemCallback");

            createVm = core(dependencies);
            vm = createVm(config);
        });

        it("interface check", function () {
            expect(function () {
                superschema.check(vm, interfacePattern);
            }).not.toThrow();
        });

        it("mockList.search(), mockList.initStoreHandling()", function () {
            expect(mockList.search).toHaveBeenCalled();
            expect(mockList.initStoreHandling).toHaveBeenCalled();
        });

        it("select", function () {
            vm.list.search("stuff");
            vm.select({
                data: "testData"
            });
            expect(config.selectCallback).toHaveBeenCalledWith("testData");
            expect(vm.list.search()).toBe("");
        });

        it("addNewItem", function () {
            vm.list.search("testItem");
            vm.addNewItem();
            expect(config.newItemCallback).toHaveBeenCalledWith("testItem");
        });

        // More functionality testing needed...
    });
});