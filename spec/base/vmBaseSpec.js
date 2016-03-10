
var ko = require("knockout");
var createVmBase = require("../../src/base/vm");

describe("base vm", function() {
	describe("with invalid config", function() {
		it("config.component", function() {
			expect(createVmBase).toThrowError("config.component is mandatory!");
		});

		it("config.style", function() {
			expect(function() {
				createVmBase({
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

		beforeEach(function() {
			baseVm = createVmBase({
				component: componentName,
				style: style,

				variation: variation,
				state: initialState
			});
		});

		it("interface", function() {
			expect(typeof baseVm.variation).toBe("string");
			expect(ko.isObservable(baseVm.state)).toBe(true);
			expect(ko.isComputed(baseVm.cssClass)).toBe(true);
			expect(ko.isComputed(baseVm.style)).toBe(true);
			expect(typeof baseVm.eventHandlers).toBe("object");
			expect(typeof baseVm.behaviours).toBe("object");

			function expectBehaviourEnabler(enabler) {
				expect(typeof enabler).toBe("object");

				expect(typeof enabler.enable).toBe("function");
				expect(typeof enabler.disable).toBe("function");
			}

			expectBehaviourEnabler(baseVm.behaviours.hover);
			expectBehaviourEnabler(baseVm.behaviours.focus);
			expectBehaviourEnabler(baseVm.behaviours.click);
			expectBehaviourEnabler(baseVm.behaviours.select);
		});

		it("initial values", function() {
			expect(baseVm.cssClass()).toBe("knob-" + componentName + " state-" + initialState + " variation-" + variation);
			expect(baseVm.style()).toBe(style.myTestVariation.myInitialState);
		});

		it("state change", function() {
			baseVm.state("default");
			expect(baseVm.cssClass()).toBe("knob-" + componentName + " state-default" + " variation-" + variation);
			expect(baseVm.style()).toBe(style.myTestVariation.default);
		});

		function describeBehaviour(config) {
			var label = config.label;
			var behaviour = config.behaviour;
			var firstEvent = config.firstEvent;
			var secondEvent = config.secondEvent;


			describe(label, function() {
				it("enable & disable", function() {
					baseVm.behaviours[behaviour].enable();
					expect(typeof baseVm.eventHandlers[firstEvent.name]).toBe("function");
					expect(typeof baseVm.eventHandlers[secondEvent.name]).toBe("function");

					baseVm.behaviours[behaviour].disable();
					expect(baseVm.eventHandlers[firstEvent.name]).toBeUndefined();
					expect(baseVm.eventHandlers[secondEvent.name]).toBeUndefined();
				});

				it("enabled - state change", function() {
					baseVm.behaviours[behaviour].enable();

					baseVm.eventHandlers[firstEvent.name]();
					expect(baseVm.state()).toBe(firstEvent.state);

					baseVm.eventHandlers[secondEvent.name]();
					expect(baseVm.state()).toBe(secondEvent.state);
				});
			});
		}

		describeBehaviour({
			label: "behaviours.hover",
			behaviour: "hover",
			firstEvent: {
				name: "mouseover",
				state: "hover"
			},
			secondEvent: {
				name: "mouseout",
				state: initialState
			}
		});

		describeBehaviour({
			label: "behaviours.focus",
			behaviour: "focus",
			firstEvent: {
				name: "focus",
				state: "active"
			},
			secondEvent: {
				name: "blur",
				state: "default"
			}
		});

		describeBehaviour({
			label: "behaviours.click",
			behaviour: "click",
			firstEvent: {
				name: "mousedown",
				state: "active"
			},
			secondEvent: {
				name: "mouseup",
				state: "hover"
			}
		});

		describeBehaviour({
			label: "behaviours.select",
			behaviour: "select",
			firstEvent: {
				name: "mousedown",
				state: "active"
			},
			secondEvent: {
				name: "mouseup",
				state: "active"
			}
		});
	});
});
