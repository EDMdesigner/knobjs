var ko = require("knockout");
var toggleSwitchCore = require("./core");


describe("==== ToggleSwitch ====", function(){


	describe(" - with invalid config", function(){

		var mockBase = {};

		var createToggleSwitch = toggleSwitchCore({
			ko: ko,
			base: mockBase
		});

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
			value: ko.observable(false),
		};

		var createToggleSwitch;
		var toggleVm;

		beforeAll(function() {
			function mockBase(conf) {
				return {
					state: ko.observable("default"),
					variation: conf.variation
				};
			}

			createToggleSwitch = toggleSwitchCore({
				ko: ko,
				base: mockBase
			});
		});

		it("interface", function() {
			toggleVm = createToggleSwitch(config);

			expect(ko.isObservable(toggleVm.active)).toBe(true);
			expect(typeof toggleVm.click).toBe("function");
		});

		it("click should negate value", function() {
			toggleVm = createToggleSwitch(config);

			expect(toggleVm.value()).toBe(false);

			toggleVm.click();
			expect(toggleVm.active()).toBe(true);

			toggleVm.click();
			expect(toggleVm.active()).toBe(false);
		});
	});
});