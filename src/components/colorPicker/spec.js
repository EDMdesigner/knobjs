"use strict";

var ko = require("knockout");
var extend = require("extend");
var superschema = require("superschema");
var colorjoe = require("../../../lib/colorjoe");

var core = require("./core");

var dependencies = {
	ko: ko,
	extend: extend
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

/*

var colorPicker;

describe("color picker test", () => {
	beforeEach(() => {
		colorPicker = core(dependencies);
	});
});
*/

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
		});

		it("interface check", function() {
			expect(function() {
				superschema.check(vm, interfacePattern);
			}).not.toThrow();
		});

		
	});
});
