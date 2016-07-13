
var ko = require("knockout");
var createVmBase = require("../../src/base/vmCore");

describe("Base vm", function() {
	describe("with invalid config", function() {
		it("config.component", function() {
			var baseVm = createVmBase({
				ko: ko,
				hoverBehaviour: function() {

				},
				focusBehaviour: function() {

				},
				clickBehaviour: function() {

				},
				selectBehaviour: function() {

				}
			});

			expect(baseVm).toThrowError("config.component is mandatory!");
		});

		it("config.style", function() {
			var baseVm = createVmBase({
				ko: ko,
				hoverBehaviour: function() {

				},
				focusBehaviour: function() {

				},
				clickBehaviour: function() {

				},
				selectBehaviour: function() {

				}
			});

			expect(function() {
				baseVm({
					component: "test"
				});
			}).toThrowError("config.style is mandatory!");
		});
	});

	describe("with valid config", function() {
		var baseVm;
		var componentName = "myTestComponent";
		var variation = "myTestVariation";
		var initialState = "myInitialState";
		var mockVm;

		var style = {
			myTestVariation: {
				default: {
					background: "#001"
				},
				myInitialState: {
					background: "#002"
				},
				hover: {
					background: "#003"
				},
				disabled: {
					background: "#004"
				},
				active: {
					background: "#005"
				}
			}
		};

		var mockBehaviours; 

		beforeEach(function() {
			mockBehaviours = {
				ko: ko,
				hoverBehaviour: function() {

				},
				focusBehaviour: function() {

				},
				clickBehaviour: function() {

				},
				selectBehaviour: function() {

				}
			};

			spyOn(mockBehaviours, "hoverBehaviour");
			spyOn(mockBehaviours, "focusBehaviour");
			spyOn(mockBehaviours, "clickBehaviour");
			spyOn(mockBehaviours, "selectBehaviour");

			baseVm = createVmBase(mockBehaviours);

			mockVm = baseVm({
				component: componentName,
				style: style,

				variation: variation,
				state: initialState
			});
		});

		it("interface", function() {
			expect(typeof mockVm.variation).toBe("string");
			expect(ko.isObservable(mockVm.state)).toBe(true);
			expect(ko.isComputed(mockVm.cssClass)).toBe(true);
			expect(ko.isComputed(mockVm.style)).toBe(true);
			expect(typeof mockVm.eventHandlers).toBe("object");
			expect(typeof mockVm.behaviours).toBe("object");

			function expectBehaviourEnabler(enabler) {
				expect(typeof enabler).toBe("object");

				expect(typeof enabler.enable).toBe("function");
				expect(typeof enabler.disable).toBe("function");
			}

			expectBehaviourEnabler(mockVm.behaviours.hover);
			expectBehaviourEnabler(mockVm.behaviours.focus);
			expectBehaviourEnabler(mockVm.behaviours.click);
			expectBehaviourEnabler(mockVm.behaviours.select);
		});

		it("initial values", function() {
			expect(mockVm.cssClass()).toBe("knob-" + componentName + " state-" + initialState + " variation-" + variation);
			expect(mockVm.style()).toBe(style.myTestVariation.myInitialState);
		});

		it("state change", function() {
			mockVm.state("default");
			expect(mockVm.cssClass()).toBe("knob-" + componentName + " state-default" + " variation-" + variation);
			expect(mockVm.style()).toBe(style.myTestVariation.default);
		});

		it("hover behaviour enable/disable", function() {
			mockVm.behaviours.hover.enable();
			expect(mockBehaviours.hoverBehaviour).toHaveBeenCalled();

			mockVm.behaviours.hover.disable();
			expect(mockVm.eventHandlers.mouseover).toBeUndefined();
			expect(mockVm.eventHandlers.mouseout).toBeUndefined();
		});

		it("focus behaviour enable/disable", function() {
			mockVm.behaviours.focus.enable();
			expect(mockBehaviours.focusBehaviour).toHaveBeenCalled();

			mockVm.behaviours.focus.disable();
			expect(mockVm.eventHandlers.focus).toBeUndefined();
			expect(mockVm.eventHandlers.blur).toBeUndefined();
		});

		it("click behaviour enable/disable", function() {
			mockVm.behaviours.click.enable();
			expect(mockBehaviours.clickBehaviour).toHaveBeenCalled();

			mockVm.behaviours.click.disable();
			expect(mockVm.eventHandlers.mousedown).toBeUndefined();
			expect(mockVm.eventHandlers.mouseup).toBeUndefined();
		});

		it("select behaviour enable/disable", function() {
			mockVm.behaviours.select.enable();
			expect(mockBehaviours.selectBehaviour).toHaveBeenCalled();

			mockVm.behaviours.select.disable();
			expect(mockVm.eventHandlers.mousedown).toBeUndefined();
			expect(mockVm.eventHandlers.mouseup).toBeUndefined();
		});
	});
});
