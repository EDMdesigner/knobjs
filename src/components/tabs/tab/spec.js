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
	tabData: ko.observable(mockedTabData),
	label: ko.observable(null),
	icon: ko.observable(null),
	leftIcon: ko.observable(null),
	rightIcon: ko.observable(null)
};

var interfacePattern = {
	dispose: "function"
};

var createVm, vm;

describe("tab", () => {
	
	describe("config and dependency check", () => {
		beforeEach(() => {
			spyOn(superschema, "check").and.callThrough();
		});

		it("checks dependencies", () => {
			core(dependencies);
			expect(superschema.check.calls.mostRecent().args[0]).toBe(dependencies);
		});

		it("checks config", () => {
			createVm = core(dependencies);
			createVm(config);
			expect(superschema.check.calls.mostRecent().args[0]).toBe(config);
		});
	});

	describe("valid config", () => {
		beforeEach(() => {
			createVm = core(dependencies);
			vm = createVm(config);
		});

		it("interface check", () => {
			expect(() => {
				superschema.check(vm, interfacePattern);
			}).not.toThrow();
		});

		it("updates tabData when the observables in config change", () => {
			expect(mockedTabData.label()).toBe(null);
			expect(mockedTabData.icon()).toBe(null);
			expect(mockedTabData.leftIcon()).toBe(null);
			expect(mockedTabData.rightIcon()).toBe(null);
			config.label("testLabel");
			config.icon("testIcon");
			config.leftIcon("testLeftIcon");
			config.rightIcon("testRightIcon");
			expect(mockedTabData.label()).toBe("testLabel");
			expect(mockedTabData.icon()).toBe("testIcon");
			expect(mockedTabData.leftIcon()).toBe("testLeftIcon");
			expect(mockedTabData.rightIcon()).toBe("testRightIcon");
		});

		it("sets tabData.exists to true", () => {
			expect(mockedTabData.exists()).toBe(true);
		});

		it("vm.dispose sets tabData.exists to false", () => {
			vm.dispose();
			expect(mockedTabData.exists()).toBe(false);
		});
	});
});