"use strict";

const extend = require("extend");
const ko = require("knockout");
const superschema = require("superschema");

const core = require("./core");

let interfaceObject;

let dependencies = {
	ko: ko,
	extend: extend
};

let config = {};

let interfacePattern = {
	notifications: "observable array"
};

let globalInterfacePattern = {
	showError: "function",
	showWarning: "function",
	showSuccess: "function"
};

let createVm, vm;

describe("notificationHandler component tests", () => {

	describe("config and dependency check", () => {
		beforeEach(() => {
			spyOn(superschema, "check").and.callThrough();
			interfaceObject = {};
			dependencies.interfaceObject = interfaceObject;
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

		it("component interface check", () => {
			expect(() => {
				superschema.check(vm, interfacePattern, "interface");
			}).not.toThrow();
		});

		it("notifications check", () => {
			expect(() => {
				superschema.check(interfaceObject, globalInterfacePattern, "interface");
			}).not.toThrow();
		});

		describe("functionalities", () => {
			beforeEach(() => {
				jasmine.clock().install();
			});

			it("showSuccess", () => {
				expect(vm.notifications().length).toBe(0);
				interfaceObject.showSuccess("testMessage");
				expect(vm.notifications().length).toBe(1);
				let notif = vm.notifications()[0];
				expect(notif.message).toBe("testMessage");
				expect(notif.variation).toBe("success");
			});

			it("showError", () => {
				expect(vm.notifications().length).toBe(0);
				interfaceObject.showError("testError");
				expect(vm.notifications().length).toBe(1);
				let notif = vm.notifications()[0];
				expect(notif.message).toBe("testError");
				expect(notif.variation).toBe("error");
			});

			it("showWarning", () => {
				expect(vm.notifications().length).toBe(0);
				interfaceObject.showWarning("testWarning");
				expect(vm.notifications().length).toBe(1);
				let notif = vm.notifications()[0];
				expect(notif.message).toBe("testWarning");
				expect(notif.variation).toBe("warning");
			});

			it("removes items after the given TTL", () => {
				expect(vm.notifications().length).toBe(0);
				interfaceObject.showSuccess("testMessage", 100);
				interfaceObject.showError("testError", 100);
				interfaceObject.showWarning("testWarning", 100);
				expect(vm.notifications().length).toBe(3);
				jasmine.clock().tick(101);
				expect(vm.notifications().length).toBe(0);
			});

			afterEach(() => {
				jasmine.clock().uninstall();
			});
		});
	});
});