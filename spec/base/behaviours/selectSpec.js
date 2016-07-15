var selectCore = require("../../../src/base/behaviours/selectCore");
var ko = require("knockout");

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

var leftIcon = "lefticon";
var label = "label";
var value = "value";
var config = {
	componentName: componentName,
	variation: variation,
	initialState: initialState,
	style: style,
	leftIcon: leftIcon,
	label: label,
	value: value
};

describe("Select behaviour", function() {

	describe("Invalid configs", function() {
		var selectBehaviour = selectCore({
			ko: ko
		});

		it("vm is missing", function() {
			expect(selectBehaviour).toThrowError("vm is mandatory!");
		});

		var mockVm = {
			state: "notAnObservable"
		};

		it("state has to be an observable", function() {
			expect(function () {
				selectBehaviour(mockVm);
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("Valid config", function() {
		var mockVm;
		var selectBehaviour;
		var buttons;
		var buttonCount;

		beforeAll(function() {
			selectBehaviour = selectCore({
				ko: ko
			});

			buttons = [];
			buttonCount = 5;

			for (var i = 0; i < buttonCount; i += 1) {
				var actButton = {
					state: ko.observable("active")
				};

				selectBehaviour(actButton, {group: "testGroup"});
				buttons.push(actButton);
			}
		});

		beforeEach(function() {
			mockVm = {
				state: ko.observable("default")
			};

			selectBehaviour(mockVm, {group: "testGroup"});
		});

		//interface check
		it("eventHandlers are functions, state is ko.observable", function() {
			expect(typeof mockVm.eventHandlers.mousedown).toBe("function");
			expect(typeof mockVm.eventHandlers.mouseup).toBe("function");
			expect(ko.isObservable(mockVm.state)).toBe(true);
		});

		//mousedown disabled
		it("state remains unchanged when disabled on mousedown", function() {
			mockVm.state("disabled");

			mockVm.eventHandlers.mousedown();
			expect(mockVm.state()).toBe("disabled");
		});

		//mousedown non-disabled
		it("state changes to active when not disabled on mousedown", function() {
			mockVm.eventHandlers.mousedown();
			expect(mockVm.state()).toBe("active");
		});

		//mouseup disabled
		it("state remains unchanged when disabled on mouseup", function() {
			mockVm.state("disabled");

			mockVm.eventHandlers.mouseup();
			expect(mockVm.state()).toBe("disabled");
		});

		//mouseup non-disabled
		it("states of others in the gourp changes to default on mouseup", function() {
			mockVm.eventHandlers.mousedown();
			mockVm.eventHandlers.mouseup();
			expect(mockVm.state()).toBe("active");

			for(var idx = 0; idx < buttonCount; idx += 1) {
				expect(buttons[idx].state()).toBe("default");
			}
		});
	});
});