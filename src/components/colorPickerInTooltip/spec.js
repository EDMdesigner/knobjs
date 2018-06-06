"use strict";

var ko = require("knockout");
var extend = require("extend");
var superschema = require("superschema");

var core = require("./core");

var mockedWindow = {
	addEventListener: (type, callback) => callback(mockedEvent),
	removeEventListener: jasmine.createSpy(),
	setTimeout: () => {}
};

const mockedEvent = {
	event: "click"
};

var dependencies = {
	ko: ko,
	extend: extend,
	window: mockedWindow
};

var mockedColor = ko.observable("#00bee6");

var config = {
	color: mockedColor
};

var interfacePattern = {
	labels: {
		error: "string",
	},
	pickerEnabled: "observable",
	hidePicker: "function",
	showPicker: "function",
	error: "observable"
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
			spyOn(vm, "error").and.callThrough();
			spyOn(dependencies.window, "addEventListener").and.callThrough();
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
			dependencies.window.setTimeout(function() {
				expect(dependencies.window.addEventListener).toHaveBeenCalledWith("click", vm.hidePicker);
			});
		});

		it("hidePicker function", function() {
			vm.pickerEnabled(false);
			vm.hidePicker();
			expect(vm.pickerEnabled()).toBe(false);
			expect(dependencies.window.removeEventListener).toHaveBeenCalled();
		});
	});
});