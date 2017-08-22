var ko = require("knockout");
var toggleSwitchCore = require("../core");


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
			style: {
				tick: {

				},
				track: {

				}
			}
		};

		var createToggleSwitch;
		var toggleVm;

		beforeAll(function() {
			function mockBase(conf) {
				return {
					behaviours: {
						hover: {
							enable: jasmine.createSpy("hover-enable")
						}
					},
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

			expect(toggleVm.tick).toBeDefined();
			expect(toggleVm.track).toBeDefined();
			expect(ko.isObservable(toggleVm.value)).toBe(true);
			expect(typeof toggleVm.click).toBe("function");

			expect(toggleVm.track.behaviours.hover.enable).toHaveBeenCalled();
		});

		it("click should negate value", function() {
			toggleVm = createToggleSwitch(config);

			expect(toggleVm.value()).toBe(false);

			toggleVm.click();
			expect(toggleVm.value()).toBe(true);

			toggleVm.click();
			expect(toggleVm.value()).toBe(false);
		});

		it("should activate subVms when value is true", function() {
			config.value(true);

			expect(toggleVm.tick.state()).toBe("active");
			expect(toggleVm.track.state()).toBe("active");
		});

		it("should de-activate subVms when value is false", function() {
			config.value(false);

			expect(toggleVm.tick.state()).toBe("default");
			expect(toggleVm.track.state()).toBe("default");
		});

		it("should write variation value to the baseVM when called with baseconfig", function() {
			config.variation = "myVar";
			toggleVm = createToggleSwitch(config);
			expect(toggleVm.tick.variation).toEqual("myVar");
			expect(toggleVm.track.variation).toEqual("myVar");
		});

	});
});