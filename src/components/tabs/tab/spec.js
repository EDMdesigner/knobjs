"use strict";

var ko = require("knockout");
var superschema = require("superschema");

var core = require("./core");

var dependencies = {
	ko: ko
};

var mockedTabData = {
	label: ko.observable(null),
	icon: ko.observable(null),
	leftIcon: ko.observable(null),
	rightIcon: ko.observable(null),
	exists: ko.observable(false)
};

var config = {
	tabData: ko.observable(mockedTabData)
};

var interfacePattern = {
	dispose: "function"
};

var createVm, vm;

describe("tab", function() {
	
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
	});
});