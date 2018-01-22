
"use strict";

var ko = require("knockout");
var extend = require("extend");
var superschema = require("superschema");

var core = require("./core");

var mockedColorjoe = function() {
	return {};
};

var joeChangeCallback;

var mockedRgb = {
	on: function(param, joeChangeCallbackParam){
		joeChangeCallback = joeChangeCallbackParam;
	}
};

mockedColorjoe.rgb = function() {
	return mockedRgb;
};

var dependencies = {
	ko: ko,
	extend: extend,
	colorjoe: mockedColorjoe
};

var mockedHideCallback = function() {};
var mockedCurrentColor = ko.observable("#00bee6");

var config = {
	currentColor: mockedCurrentColor,
	hideCallback: mockedHideCallback
};

var interfacePattern = {
	labels: {
		currentColorLabel: "string",
		lastUsedColorsLabel: "string",
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
			createVm = core(dependencies);
			spyOn(config, "hideCallback").and.callThrough();
			vm = createVm(config);

			jasmine.clock().install();
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});


		it("interface check", function() {
			expect(function() {
				superschema.check(vm, interfacePattern);
			}).not.toThrow();
		});

		it("colorjoe bindinghandler", function() {
			var mockedElement = {};
			var mockedValueAccessor = ko.observable();

			// init
			spyOn(ko.bindingHandlers.colorjoe, "init").and.callThrough();
			spyOn(ko.bindingHandlers.colorjoe, "update").and.callThrough();
			spyOn(mockedRgb, "on").and.callThrough();

			

			expect(ko.bindingHandlers.colorjoe.init).toHaveBeenCalledWith(mockedElement, mockedValueAccessor);

			expect(mockedElement.colorjoe).toEqual(mockedColorjoe.rgb());
			expect(mockedRgb.on).toHaveBeenCalled();

			// update
			expect(ko.bindingHandlers.colorjoe.update).toHaveBeenCalledWith(mockedElement, mockedValueAccessor);
			expect(mockedElement.colorjoe.set).toHaveBeenCalled();
		});

		it("creates the color picker", function() {
			spyOn(mockedColorjoe, "rgb").and.callThrough();
			spyOn(mockedRgb, "on").and.callThrough();

			expect(mockedColorjoe.rgb).toHaveBeenCalledWith("rgbPicker", mockedCurrentColor);
			
			jasmine.clock().tick(3100);
			expect(mockedRgb.on).toHaveBeenCalled();
		});

		it("colorPickerButton click", function() {
			var mockedLastColor = mockedCurrentColor();
			spyOn(vm.lastUsedColors, "unshift").and.callThrough();
			spyOn(vm.lastUsedColors, "pop").and.callThrough();

			vm.colorPickerButton.click();
			expect(config.hideCallback).toHaveBeenCalled();
			expect(vm.lastUsedColors.unshift).toHaveBeenCalledWith(mockedLastColor);
			expect(vm.lastUsedColors.pop).toHaveBeenCalled();
		});
	});
});