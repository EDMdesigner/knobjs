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

		it("config.minValue missing", function() {
			var config = {
				maxValue: 20,
				initValue: 0,
				step: 1,
				prefix: "a prefix",
				postfix: "a postfix"
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.minValue is mandatory and it should be a number!");
		});

		it("config.maxValue missing", function() {
			var config = {
				minValue: 20,
				initValue: 0,
				step: 1,
				prefix: "a prefix",
				postfix: "a postfix"
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.maxValue is mandatory and it should be a number!");
		});

		it("config.initValue missing", function() {
			var config = {
				maxValue: 20,
				minValue: 0,
				step: 1,
				prefix: "a prefix",
				postfix: "a postfix"
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.initValue is mandatory and it should be a number!");
		});

		it("config.step missing", function() {
			var config = {
				maxValue: 20,
				initValue: 0,
				minValue: -20,
				prefix: "a prefix",
				postfix: "a postfix"
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.step is mandatory and it should be a number!");
		});

		it("config.prefix missing", function() {
			var config = {
				maxValue: 20,
				minValue: -20,
				initValue: 0,
				step: 1,
				prefix: 123,
				postfix: "a postfix"
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.prefix should be a string");
		});

		it("config.prefix missing", function() {
			var config = {
				maxValue: 20,
				minValue: -20,
				initValue: 0,
				step: 1,
				prefix: "a prefix",
				postfix: 123
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.postfix should be a string");
		});
	});

	describe("Valid config", function() {
		var createNumericInput = numericInputCore({
			ko: ko
		});

		var config = {
			minValue: -20,
			maxValue: 20,
			initValue: 0,
			step: 1,
			prefix: "a prefix",
			postfix: "a postfix",
			icons: {
				increase: "up",
				decrease: "down"
			}
		};

		it("Interface check", function() {
			var numericInputVm = createNumericInput(config);

			expect(typeof numericInputVm.prefix).toBe("string");
			expect(typeof numericInputVm.postfix).toBe("string");
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