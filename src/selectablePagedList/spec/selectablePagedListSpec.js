"use strict";

var ko = require("knockout");
var core = require("../core");

describe("selectablePagedList", function() {
  describe("- invalid dependencies", function() {
    it("dependencies.ko", function () {
      expect(function() {
        core({
        });
      }).toThrowError("dependencies.ko is mandatory!");
    });
  });

  describe("- valid dependencies", function() {
    var createSelectablePagedList = core({
      ko: ko
    });

    describe("- invalid config", function() {

      it("config", function () {
        expect(function() {
          createSelectablePagedList();
        }).toThrowError("config is mandatory!");
      });

      it("config.selected", function () {
        expect(function() {
          createSelectablePagedList({
            selected: "not an observable"
          });
        }).toThrowError("config.selected is mandatory, and it has to be an observable!");
      });
    });

    describe("- valid config", function() {
      var config, selected, selectablePagedList, mockSuperDataObject;

      beforeAll(function () {
        selected = ko.observable("some noisy value");

        config = {
          selected: selected
        };

        mockSuperDataObject = {
          model: {
            data: {
              id: 1
            }
          }
        };

        selectablePagedList = createSelectablePagedList(config);
      });

      it("interface", function () {
        expect(selectablePagedList).toBe(config);
        expect(typeof selectablePagedList.select).toBe("function");
        expect(selectablePagedList.selected()).toBe(null);
        expect(ko.isObservable(selectablePagedList.selectedId)).toBe(true);
      });

      it("should throw error with message: 'selectablePagedList: Invalid superdata object' ", function () {
        expect(function () {
          selectablePagedList.selected({
          });
        }).toThrowError("selectablePagedList: Invalid superdata object");
      });

      it("should set selectedId to null, if selected is given falsie", function () {
        expect(function () {
          selectablePagedList.selected();
        }).not.toThrow();
        expect(selectablePagedList.selectedId()).toBe(null);
      });

      it("select should set selected", function () {
          selectablePagedList.select(mockSuperDataObject);
          expect(selectablePagedList.selected()).toBe(mockSuperDataObject);
      });

      it("changing selected should refresh selectedId", function () {
        expect(function () {
          selectablePagedList.selected(mockSuperDataObject);
        }).not.toThrow();
        expect(selectablePagedList.selectedId()).toBe(1);
      });
    });
  });
});
