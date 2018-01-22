"use strict";

var ko = require("knockout");
var superschema = require("superschema");

var core = require("./core");

var dependencies = {
	ko: ko
};

var mockedCurrentColorInUse = ko.observable("#00bee6");

var config = {
	currentColorInUse: mockedCurrentColorInUse
};

var interfacePattern = {
	pickerEnabled: "observable",
	hidePicker: "function",
	showPicker: "function"
};

describe("color picker in use test", function() {

	var createVm, vm;

	describe("config and dependency check", function() {
		beforeEach(function() {
			spyOn(superschema, "check").and.callThrough();
		});

		it("checks dependencies", function() {
			core(dependencies);
			expect(superschema.check.calls.mostRecent().args[0]).toBe(dependencies);
		});

		it("checks config", function() {
			createVm = core(dependencies);
			createVm(config);
			expect(superschema.check.calls.mostRecent().args[0]).toBe(config);
		});
	});

	describe("valid config", function() {
		beforeEach(function() {
			createVm = core(dependencies);
			vm = createVm(config);
		});

		it("interface check", function() {
			expect(function() {
				superschema.check(vm, interfacePattern);
			}).not.toThrow();
		});

		it("showPicker function", function() {
			expect(vm.pickerEnabled()).toBe(false);
			vm.showPicker();
			expect(vm.pickerEnabled()).toBe(true);
		});

		it("hidePicker function", function() {
			vm.pickerEnabled(false);
			vm.hidePicker();
			expect(vm.pickerEnabled()).toBe(false);
		});
	});
});
