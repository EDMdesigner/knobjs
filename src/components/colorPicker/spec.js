"use strict";

var ko = require("knockout");
var extend = require("extend");
var superschema = require("superschema");

var core = require("./core");

var mockedColorjoe = function() {
	return {};
};

var mockedElement = {};
var mockedValueAccessor = ko.observable("mockedValue");

var joeChangeCallback;

var mockedRgb = {
	on: function(param, joeChangeCallbackParam){
		joeChangeCallback = joeChangeCallbackParam;
	},
	set: function() {}
};

mockedColorjoe.rgb = function() {
	return mockedRgb;
};

var dependencies = {
	ko: ko,
	extend: extend,
	colorjoe: mockedColorjoe
};

var mockedCurrentColor = ko.observable("randomColor");

var config = {
	currentColor: mockedCurrentColor,
	hideCallback: jasmine.createSpy()
};

var interfacePattern = {
	labels: {
		currentColorLabel: "string",
		lastUsedColorsLabel: "string",
		transparent: "string",
		colorPickerButton: "string"
	},
	currentColor: "observable",
	lastUsedColors: "observable array",
	colorPickerButton: {
		label: "string",
		click: "function"
	}
};

describe("color picker test", function() {

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
			jasmine.clock().install();
			mockedCurrentColor("randomColor");

			createVm = core(dependencies);
			vm = createVm(config);
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});

		it("interface check", function() {
			expect(function() {
				superschema.check(vm, interfacePattern);
			}).not.toThrow();
		});

		it("creates bindinghandler", function() {
			expect(typeof ko.bindingHandlers.colorjoe).toBe("object");
			expect(typeof ko.bindingHandlers.colorjoe.init).toBe("function");
			expect(typeof ko.bindingHandlers.colorjoe.update).toBe("function");
		});

		it("colorjoe bindinghandler - init", function() {
			spyOn(mockedRgb, "on").and.callThrough();

			ko.bindingHandlers.colorjoe.init(mockedElement, ko.observable(mockedValueAccessor));

			expect(mockedElement.colorjoe).toBe(mockedRgb);
			expect(mockedRgb.on).toHaveBeenCalled();
			joeChangeCallback({
				hex: ko.observable("superTestColor")
			});
			expect(mockedValueAccessor()).toBe("superTestColor");
		});

		it("colorjoe bindinghandler - update", function() {
			spyOn(mockedRgb, "set").and.callThrough();

			ko.bindingHandlers.colorjoe.update(mockedElement, ko.observable(mockedValueAccessor));

			expect(mockedRgb.set).toHaveBeenCalledWith("superTestColor");
		});

		it("creates the color picker", function() {
			spyOn(mockedColorjoe, "rgb").and.callThrough();
			spyOn(mockedRgb, "on").and.callThrough();

			jasmine.clock().tick(3100);
			
			expect(mockedColorjoe.rgb).toHaveBeenCalledWith("rgbPicker", "randomColor");
			expect(mockedRgb.on).toHaveBeenCalled();
			joeChangeCallback({
				hex: ko.observable("anotherTestColor")
			});
			expect(mockedCurrentColor()).toBe("anotherTestColor");
		});

		it("colorPickerButton click", function() {
			spyOn(vm.lastUsedColors, "unshift").and.callThrough();
			spyOn(vm.lastUsedColors, "pop").and.callThrough();

			vm.colorPickerButton.click();
			expect(config.hideCallback).toHaveBeenCalled();
			expect(vm.lastUsedColors.unshift).toHaveBeenCalledWith("randomColor");
			expect(vm.lastUsedColors.pop).toHaveBeenCalled();
		});
	});
});