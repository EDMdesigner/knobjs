var ko = require("knockout");
var numericInputCore = require("../../src/numericInput/core");

describe("Numeric Input", function() {
		
	describe("Invalid Config", function() {
		var createNumericInput = numericInputCore({
				ko: ko
		});

		it("missing config", function() {
			expect(createNumericInput).toThrowError("Config is mandatory!");
		});

		it("config.value missing", function() {
			var config = {
				maxValue: 20,
				minValue: -20,
				step: 1,
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.value is mandatory and it should store a number");
		});

		it("config.minValue missing", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				step: 1,
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.minValue is mandatory and it should be a number or an observable storing a number!");
		});

		it("config.minValue invalid", function() {
			var config = {
				maxValue: 20,
				minValue: ko.observable("x"),
				value: ko.observable(0),
				step: 1,
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.minValue is mandatory and it should be a number or an observable storing a number!");
		});

		it("config.maxValue missing", function() {
			var config = {
				minValue: 20,
				value: ko.observable(0),
				step: 1,
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.maxValue is mandatory and it should be a number or an observable storing a number!");
		});

		it("config.maxValue invalid", function() {
			var config = {
				maxValue: ko.observable("x"),
				minValue: 20,
				value: ko.observable(0),
				step: 1,
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.maxValue is mandatory and it should be a number or an observable storing a number!");
		});

		it("config.step missing", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.step is mandatory and it should be a number!");
		});
	});

	describe("Valid config", function() {
		var createNumericInput = numericInputCore({
			ko: ko
		});

		var config = {
			minValue: -20,
			maxValue: 20,
			value: ko.observable(0),
			step: 1,
			icons: {
				increase: "up",
				decrease: "down"
			}
		};

		it("Interface check", function() {
			var numericInputVm = createNumericInput(config);

			expect(typeof numericInputVm.left).toBe("object");
			expect(typeof numericInputVm.right).toBe("object");
			expect(ko.isObservable(numericInputVm.inputValue)).toBe(true);
			expect(typeof numericInputVm.increaseButton.icon).toBe("string");
			expect(typeof numericInputVm.increaseButton.click).toBe("function");
			expect(typeof numericInputVm.decreaseButton.icon).toBe("string");
			expect(typeof numericInputVm.decreaseButton.click).toBe("function");
			expect(typeof numericInputVm.triggerOnHold).toBe("object");
			expect(typeof numericInputVm.triggerOnHold.minTimeout).toBe("number");
			expect(typeof numericInputVm.triggerOnHold.timeoutDecrement).toBe("number");
			expect(typeof numericInputVm.triggerOnHold.baseTimeout).toBe("number");
		});
	});

	describe("Valid config with observable minValue, maxValue", function() {
		var createNumericInput = numericInputCore({
			ko: ko
		});

		var config = {
			minValue: ko.observable(-20),
			maxValue: ko.observable(20),
			value: ko.observable(0),
			step: 1,
			icons: {
				increase: "up",
				decrease: "down"
			}
		};

		it("Interface check", function() {
			var numericInputVm = createNumericInput(config);

			expect(typeof numericInputVm.left).toBe("object");
			expect(typeof numericInputVm.right).toBe("object");
			expect(ko.isObservable(numericInputVm.inputValue)).toBe(true);
			expect(typeof numericInputVm.increaseButton.icon).toBe("string");
			expect(typeof numericInputVm.increaseButton.click).toBe("function");
			expect(typeof numericInputVm.decreaseButton.icon).toBe("string");
			expect(typeof numericInputVm.decreaseButton.click).toBe("function");
			expect(typeof numericInputVm.triggerOnHold).toBe("object");
			expect(typeof numericInputVm.triggerOnHold.minTimeout).toBe("number");
			expect(typeof numericInputVm.triggerOnHold.timeoutDecrement).toBe("number");
			expect(typeof numericInputVm.triggerOnHold.baseTimeout).toBe("number");
		});
	});
});