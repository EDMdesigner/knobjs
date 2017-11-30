"use strict";

const ko = require("knockout");
const superschema = require("superschema");

const core = require("./core");

let dependencies = {
	ko: ko,
};

let beforeCloseResult = false;
let config = {
	visible: ko.observable(true),
	beforeClose: function() {
		return beforeCloseResult;
	}
};

let interfacePattern = {
	visible: "observable boolean",
	title: "optional string",
	icon: "optional string",
	close: "function"
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
			spyOn(config, "beforeClose").and.callThrough();
			beforeCloseResult = false;
		});

		it("interface check", function() {
			expect(function() {
				superschema.check(vm, interfacePattern, "interface");
			}).not.toThrow();
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
				beforeCloseResult = true;
				vm.close();
				expect(vm.visible()).toBe(true);
			});
		});
	});
});