"use strict";

const ko = require("knockout");
const superschema = require("superschema");

const core = require("./core");

let dependencies = {
	ko: ko,
};

let config = {
	visible: ko.observable(true),
	beforeClose: () => false
};

let interfacePattern = {
	visible: "observable boolean",
	title: "optional string",
	icon: "optional string",
	close: "function",
	icons: "optional object"
};

let createVm, vm;

describe("knob modal tests", function() {

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
				superschema.check(vm, interfacePattern, "interface");
			}).not.toThrow();
		});

		it("visible.toggle toggles the visible value...", function() {
			vm.visible.toggle();
			expect(vm.visible()).toBe(false);
			vm.visible.toggle();
			expect(vm.visible()).toBe(true);
		});

		describe("beforeClose callback", function() {
			it("without beforeClose 'close' closes the modal", function() {
				vm = createVm({
					visible: ko.observable(true)
				});
				vm.close();
				expect(vm.visible()).toBe(false);
			});

			it("'close' closes the modal if beforeClose returns with a falsey value", function() {
				vm.close();
				expect(vm.visible()).toBe(false);
			});

			it("'close' does not close the modal if beforeClose returns with a truthy value", function() {
				vm = createVm({
					visible: ko.observable(true),
					beforeClose: () => true
				});
				vm.close();
				expect(vm.visible()).toBe(true);
			});
		});
	});
});