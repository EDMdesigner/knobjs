var ko = require("knockout");
var numericInputCore = require("../core");

describe("Numeric Input", function() {
		
	describe("Invalid Config", function() {
		var createNumericInput = numericInputCore({
				ko: ko
		});

		it("missing dependencies", function() {
			expect(numericInputCore).toThrowError("dependencies is mandatory!");
		});

		it("missing dependencies.ko", function() {
			var f = function() {
				numericInputCore({});
			}; 
			expect(f).toThrowError("dependencies.ko is mandatory!");
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
			}).toThrowError("config.step is mandatory and it should be a number or an observable storing a number!");
		});

		it("config.step invalid", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				step: ko.observable("x"),
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.step is mandatory and it should be a number or an observable storing a number!");
		});

		it("config.precision invalid", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				step: ko.observable(0),
				precision: ko.observable("x"),
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.precision should be a number or an observable storing a number!");
		});

		it("config.updateTimeout invalid", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				step: ko.observable(1),
				precision: ko.observable(1),
				updateTimeout: "beer",
				left: {},
				right: {}
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.updateTimeout has to be a number!");
		});

		it("config.prefix invalid", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				step: ko.observable(1),
				precision: ko.observable(1),
				left: {},
				right: {},
				prefix: ko.observable("Darth Vader really likes skydiving.")
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.prefix should be a string");
		});

		it("config.postfix invalid", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				step: ko.observable(1),
				precision: ko.observable(1),
				left: {},
				right: {},
				postfix: 666
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.postfix should be a string");
		});

		it("config.layoutArrangement invalid", function() {
			var config = {
				maxValue: 20,
				value: ko.observable(0),
				minValue: -20,
				step: ko.observable(1),
				precision: ko.observable(1),
				left: {},
				right: {},
				layoutArrangement: "beer"
			};

			expect(function() {
				createNumericInput(config);
			}).toThrowError("config.layoutArrangement can only take values: 'back'/'front'/'split'!");
		});
	});

	describe("Valid config with fix minValue, maxValue, step, without precision and updateTimeout", function() {
		var createNumericInput = numericInputCore({
			ko: ko
		});
		var value = ko.observable(0);
		var config = {
			minValue: -20,
			maxValue: 20,
			value: value,
			step: 1,
			icons: {
				increase: "up",
				decrease: "down"
			}
		};
		var vm = createNumericInput(config);
		var inputValue = vm.inputValue;
		var increment = vm.increaseButton.click;
		var decrement = vm.decreaseButton.click;
		var wait = 501;	// the default timeout value is 500 ms

		beforeEach(function() {
			value(0);
			jasmine.clock().install();
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});

		it("Interface check", function() {
			var numericInputVm = vm;

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

		it(" has correct step functionality", function() {
			inputValue(2);
			jasmine.clock().tick(wait);
			expect(value()).toBe(2);
			increment();
			jasmine.clock().tick(wait);
			expect(value()).toBe(3);
			decrement();
			decrement();
			jasmine.clock().tick(wait);
			expect(value()).toBe(1);
		});

		it(" correctly validates non-numeric input values", function() {
			inputValue("Darth Vader is drinking beer in the desert");
			jasmine.clock().tick(wait);
			expect(value()).toBe(0);

			inputValue("3 Darth Vaders are drinking beer in the desert");
			jasmine.clock().tick(wait);
			expect(value()).toBe(3);
		});

		it (" correctly validates values outside the boundaries", function() {
			inputValue(-77);
			jasmine.clock().tick(wait);
			expect(value()).toBe(-20);

			inputValue(23.412);
			jasmine.clock().tick(wait);
			expect(value()).toBe(20);
		});

		it (" correctly rounds values", function() {
			inputValue(2.33);
			jasmine.clock().tick(wait);
			expect(value()).toBe(2);

			inputValue(7.835);
			jasmine.clock().tick(wait);
			expect(value()).toBe(8);
		});

	});

	describe("Valid config with fix minValue, maxValue, step and precision", function() {
		var createNumericInput = numericInputCore({
			ko: ko
		});
		var value = ko.observable(0);
		var config = {
			minValue: -20,
			maxValue: 20,
			value: value,
			step: 2,
			precision: 1,
			icons: {
				increase: "up",
				decrease: "down"
			}
		};
		var vm = createNumericInput(config);
		/*var inputValue = vm.inputValue;
		var increment = vm.increaseButton.click;
		var decrement = vm.decreaseButton.click;
		var wait = 501;	// the default timeout value is 500 ms*/

		beforeEach(function() {
			value(0);
			jasmine.clock().install();
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});

		it("Interface check", function() {
			var numericInputVm = vm;

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

	describe("Valid config with observable minValue, maxValue, precision, step", function() {
		var createNumericInput = numericInputCore({
			ko: ko
		});
		var min;
		var max;
		var precision;
		var step;
		var value;
		var updateTimeout = 300;
		var wait = 301; // Just to be sure...
		var config;
		var vm;
		var inputValue;
		var increment;
		var decrement;

		beforeEach(function() {
			min = ko.observable(-20);
			max = ko.observable(20);
			precision = ko.observable(1);
			step = ko.observable(2);
			value = ko.observable(0);
			config = {
				minValue: min,
				maxValue: max,
				precision: precision,
				step: step,
				updateTimeout: updateTimeout,
				value: value,
				icons: {
					increase: "up",
					decrease: "down"
				}
			};
			vm = createNumericInput(config);
			inputValue = vm.inputValue;
			increment = vm.increaseButton.click;
			decrement = vm.decreaseButton.click;

			jasmine.clock().install();
		});

		afterEach(function() {
			jasmine.clock().uninstall();
		});

		it("Interface check", function() {
			var numericInputVm = vm;

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

		it(" has correct step functionality", function() {
			inputValue(1);
			jasmine.clock().tick(wait);
			expect(value()).toBe(1);
			increment();
			jasmine.clock().tick(wait);
			expect(value()).toBe(3);
			step(4);
			decrement();
			jasmine.clock().tick(wait);
			expect(value()).toBe(-1);
		});

		it("doesn't allow stepping outside the limits", function() {
			inputValue(-20);
			jasmine.clock().tick(wait);
			expect(value()).toBe(-20);
			decrement();
			jasmine.clock().tick(wait);
			expect(value()).toBe(-20);

			inputValue(19);
			jasmine.clock().tick(wait);
			expect(value()).toBe(19);
			increment();
			jasmine.clock().tick(wait);
			expect(value()).toBe(20);
		});

		it(" correctly validates non-numeric input values", function() {
			inputValue("Darth Vader is drinking beer in the desert");
			jasmine.clock().tick(wait);
			expect(value()).toBe(0);

			inputValue("3 Darth Vaders are drinking beer in the desert");
			jasmine.clock().tick(wait);
			expect(value()).toBe(3);
		});

		it (" correctly validates values outside the boundaries", function() {
			inputValue(-77);
			jasmine.clock().tick(wait);
			expect(value()).toBe(-20);

			max(10);

			inputValue(23.412);
			jasmine.clock().tick(wait);
			expect(value()).toBe(10);
		});

		it (" correctly rounds values", function() {
			inputValue(2.33);
			jasmine.clock().tick(wait);
			expect(value()).toBe(2);

			precision(0.5);

			inputValue(13.288);
			jasmine.clock().tick(wait);
			expect(value()).toBe(13.5);

			precision(10);
			jasmine.clock().tick(wait);
			expect(value()).toBe(10);
		});

		it ("does no rounding if precision is set to 0", function() {
			precision(0);
			inputValue("11.7462548");
			jasmine.clock().tick(wait);
			expect(value()).toBe(11.7462548);

			decrement();
			jasmine.clock().tick(wait);
			expect(value()).toBe(9.7462548);
		});

		it (" correctly revalidates on change of minValue, maxValue", function() {
			inputValue(2);
			min(10);
			jasmine.clock().tick(wait);
			expect(value()).toBe(10);

			min(-70);
			max(-50);
			jasmine.clock().tick(wait);
			expect(value()).toBe(-50);
		});

		it ("throws error if min > max", function() {
			var f = function() {
				min(30);
			};
			expect(f).toThrowError("minValue cannot be greater than maxValue!");
		});

		it ("throws error if step <= 0", function() {
			var f = function() {
				step(0);
			};
			expect(f).toThrowError("step has to be greater than 0!");
		});

		it ("throws error if precision < 0", function() {
			var f = function() {
				precision(-1);
			};
			expect(f).toThrowError("precision cannot be negative!");
		});

		it ("uses validatedValue on increase/decrease click if inputValue === ''", function() {
			inputValue(3);
			jasmine.clock().tick(wait);
			expect(value()).toBe(3);
			inputValue("");
			decrement();
			jasmine.clock().tick(wait);
			expect(value()).toBe(1);
			inputValue("");
			increment();
			jasmine.clock().tick(wait);
			expect(value()).toBe(3);
		});

		it ("accepts the . character at the end of numbers", function() {
			inputValue("12.");
			jasmine.clock().tick(1);
			expect(inputValue()).toBe("12.");
			jasmine.clock().tick(wait);
			expect(value()).toBe(12);
		});
	});
});