"use strict";

var ko = require("knockout");
var createList = require("../list/vm");
var core = require("./core");

describe("dropdownSearchbox", function () {
    describe("- invalid dependencies", function () {
        it("dependencies.ko", function () {
            expect(function () {
                core({
                });
            }).toThrowError("dependencies.ko is mandatory!");
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

            it("config.selected", function () {
                expect(function () {
                    createDropdownSearchbox({
                        selected: "not an observable"
                    });
                }).toThrowError("config.selected is mandatory, and it has to be an observable!");
            });
        });

        // describe("- valid config", function () {
        //     var config, selected, dropdownSearchbox, mockSuperDataObject;

        //     beforeAll(function () {
        //         selected = ko.observable("some noisy value");

        //         config = {
        //             selected: selected
        //         };

        //         mockSuperDataObject = {
        //             model: {
        //                 data: {
        //                     id: 1
        //                 }
        //             }
        //         };

        //         dropdownSearchbox = createDropdownSearchbox(config);
        //     });

        //     it("interface", function () {
        //         expect(dropdownSearchbox).toBe(config);
        //         expect(typeof dropdownSearchbox.select).toBe("function");
        //         expect(dropdownSearchbox.selected()).toBe(null);
        //         expect(ko.isObservable(dropdownSearchbox.selectedId)).toBe(true);
        //     });

        //     it("should throw error with message: 'dropdownSearchbox: Invalid superdata object' ", function () {
        //         expect(function () {
        //             dropdownSearchbox.selected({
        //             });
        //         }).toThrowError("dropdownSearchbox: Invalid superdata object");
        //     });

        //     it("should set selectedId to null, if selected is given falsie", function () {
        //         expect(function () {
        //             dropdownSearchbox.selected();
        //         }).not.toThrow();
        //         expect(dropdownSearchbox.selectedId()).toBe(null);
        //     });

        //     it("select dropdownSearchbox set selected", function () {
        //         dropdownSearchbox.select(mockSuperDataObject);
        //         expect(dropdownSearchbox.selected()).toBe(mockSuperDataObject);
        //     });

        //     it("changing selected should refresh selectedId", function () {
        //         expect(function () {
        //             dropdownSearchbox.selected(mockSuperDataObject);
        //         }).not.toThrow();
        //         expect(dropdownSearchbox.selectedId()).toBe(1);
        //     });

        // });
    });
});