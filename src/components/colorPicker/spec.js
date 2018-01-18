/*
"use strict";

var ko = require("knockout");
var extend = require("extend");
var superschema = require("superschema");

var core = require("./core");

var dependencies = {
	ko: ko,
	extend: extend
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
	},
	togglePicker: "function",
	pickerEnabled: "observable"
};

var colorPicker;

describe("color picker test", () => {
	beforeEach(() => {
		colorPicker = core(dependencies);
	});



});


beforeEach(()=> {
	middleware = core({
		User: mockedUser
	});
	mockedReq = getMockedReq();
	mockedRes = getMockedRes();
	mockedUser.errorMessage = null;
	spyOn(mockedRes, "send");
});

beforeEach(function(){
		mockLs = {
			setItem: function(){},
			getItem: function(){}
		};

		spyOn(mockLs, "setItem").and.callThrough();
		spyOn(mockLs, "getItem").and.callThrough();

		var createHelpBox = helpBoxCore({
			ko: ko,
			localStorage: mockLs
		});

	    vm = createHelpBox();
	});
*/