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

        describe("- valid config", function () {
            var config, store, selected, handleSelected, handleNotFound, icons, dropdownSearchbox, mockSuperDataObject;
            beforeAll(function() { 
				store = {
                    load: function() {

                    }
                };

                store.load.before = {
                    add: function() {

                    }
                };
                
                selected = "selected";
                
                handleSelected = function() {
                    console.log("handleSelected");
                };

                handleNotFound = function() {
                    console.log("handleNotFound");
                };

                icons = {
                    search: "icon"
                };

                config = {
                    store: store,
                    selected: selected,
                    handleSelected: handleSelected,
                    handleNotFound: handleNotFound,
                    icons: icons
                };
                
                mockSuperDataObject = {
                    model: {
                        data: {
                            id: 1
                        }
                    }
                };

                spyOn(store, "load").and.callThrough();
                // spyOn(mockSuperDataObject, "load").and.callThrough();
                

                dropdownSearchbox = createDropdownSearchbox(config);
            });

            it("it should call store.load and fill list porperties", function() {
                expect(store.load).toHaveBeenCalled();
            });

            // it("interface", function () {
            //     expect(dropdownSearchbox).toBe(config);
            //     expect(store.load).toBe("function");
			// 	expect(typeof dropdownSearchbox.select).toBe("function");
			// 	expect(dropdownSearchbox.selected()).toBe(null);
            //     expect(ko.isObservable(dropdownSearchbox.selectedId)).toBe(true);
            //     expect(ko.isObservable(dropdownSearchbox.shouldDisplay)).toBe(true);
            //     expect(ko.isObservable(dropdownSearchbox.noResultLabel)).toBe(true);
            //     expect(typeof dropdownSearchbox.notFoundItem).toBe("function");
            //     expect(typeof dropdownSearchbox.clickMoreItem).toBe("function");
            //     expect(typeof dropdownSearchbox.reset).toBe("function");
			// });

			// it("should throw error with message: 'dropdownSearchbox: Invalid superdata object' ", function () {
			// 	expect(function () {
			// 		dropdownSearchbox.selected({
			// 		});
			// 	}).toThrowError("dropdownSearchbox: Invalid superdata object");
			// });

			// it("should set selectedId to null, if selected is given false", function () {
			// 	expect(function () {
			// 		dropdownSearchbox.selected();
			// 	}).not.toThrow();
			// 	expect(dropdownSearchbox.selectedId()).toBe(null);
			// });

			// it("select should set selected", function () {
			// 	dropdownSearchbox.select(mockSuperDataObject);
			// 	expect(dropdownSearchbox.selected()).toBe(mockSuperDataObject);
			// });

			// it("changing selected should refresh selectedId", function () {
			// 	expect(function () {
			// 		dropdownSearchbox.selected(mockSuperDataObject);
			// 	}).not.toThrow();
			// 	expect(dropdownSearchbox.selectedId()).toBe(1);
			// });

        });
    });
});