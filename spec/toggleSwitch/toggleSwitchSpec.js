var ko = require("knockout");
var toggleSwitchCore = require("../../src/toggleSwitch/core");

var mockBase = {};

var createToggleSwitch = toggleSwitchCore({
	ko: ko,
	base: mockBase
});

describe("==== ToggleSwitch ====", function(){
	describe(" - with invalid config", function(){
		it("config.value should be defined", function() {
			expect(createToggleSwitch).toThrowError("config.value is mandatory and has to be an observable!");
		});

		it("config.value should be an observable", function() {
			expect(function() {
				createToggleSwitch({
					value: "not an observable"
				});
			}).toThrowError("config.value is mandatory and has to be an observable!");
		});
	});



	describe(" - with valid config", function(){
		var config = {
			value: ko.observable(true)
		};

		var vm = createToggleSwitch(config);

		it("interface", function() {
			expect(ko.isObservable(vm.value)).toBe(true);
			expect(typeof vm.click).toBe("function");
		});

		it("click should negate value", function() {
			expect(vm.value()).toBe(false);

			vm.click();
			expect(vm.value()).toBe(true);

			vm.click();
			expect(vm.value()).toBe(false);
		});
	});
});