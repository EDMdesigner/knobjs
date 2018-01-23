"use strict";

const ko = require("knockout");
const extend = require("extend");
const superschema = require("superschema");

const core = require("./core");

let dependencies = {
	ko: ko,
	window: {
		addEventListener: (type, callback) => callback(mockedEvent),
		removeEventListener: jasmine.createSpy()
	},
	document: {
		getElementsByClassName: () => {
			return [{
				addEventListener: () => {}
			}];
		}
	}
};

const mockedEvent = {
	stopPropagation: jasmine.createSpy(),
	key: "Escape",
	keyCode: 27
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

		it("error throws", () => {
			const errorConfig = extend(true, {}, config);
			errorConfig.icon = 1;

			createVm = core(dependencies);
			expect(() => {
				createVm(errorConfig);
			}).toThrowError();
		});

		it("error throws", () => {
			const errorConfig = extend(true, {}, config);
			errorConfig.title = 1;

			createVm = core(dependencies);
			expect(() => {
				createVm(errorConfig);
			}).toThrowError();
		});
	});

	describe("valid config", function() {
		beforeEach(function() {
			spyOn(dependencies.window, "addEventListener").and.callThrough();

			dependencies.window.addEventListener.calls.reset();
			dependencies.window.removeEventListener.calls.reset();

			createVm = core(dependencies);
			vm = createVm(config);
		});

		it("interface check", function() {
			expect(function() {
				superschema.check(vm, interfacePattern, "interface");
			}).not.toThrow();
		});

		it("visible.toggle toggles the visible value...", function() {
			vm.visible(true);
			vm.visible.toggle();
			expect(vm.visible()).toBe(false);
			vm.visible.toggle();
			expect(vm.visible()).toBe(true);
		});

		it("cause of the if(icons) branch", () => {
			config.icons = {back: "precisely mocked icon"};

			vm = createVm(config);
		});

		it("adds event listeners", () => {
			expect(dependencies.window.addEventListener).toHaveBeenCalledTimes(3);
		});

		it("removes event listener in listenToEscape", () => {
			vm.visible(true);
			vm.listenToEscape(mockedEvent);

			expect(mockedEvent.stopPropagation).toHaveBeenCalled();
			expect(dependencies.window.removeEventListener).toHaveBeenCalled();
			expect(vm.visible()).toBe(false);
		});

		it("listenToEscape branch coverage", () => {
			mockedEvent.key = "definately not Escape";
			vm.listenToEscape(mockedEvent);

			mockedEvent.keyCode = "not 27 for sure";
			vm.listenToEscape(mockedEvent);

			vm.activeModals.length = 0;
			vm.listenToEscape(mockedEvent);
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