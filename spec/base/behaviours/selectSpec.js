var selectBehaviour = require("../../../src/base/behaviours/select");
var createButton = require("../../../src/button/vm");

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

describe("SelectSpec", function() {

	describe("Invalid configs", function() {
		it("vm is missing", function() {
			expect(selectBehaviour).toThrowError("vm is mandatory!");
		});

	});

	describe("Valid config", function() {

		it("Behaviour test", function() {

			var buttons = [];
			var buttonCount = 5;

			for (var i = 0; i < buttonCount; i += 1) {
				var actButton = createButton(config);

				selectBehaviour(actButton);
				buttons.push(actButton);
			}

			buttons[0].eventHandlers.mousedown();
			expect(buttons[0].state()).toBe("active");
			buttons[0].eventHandlers.mouseup();
			for (var i = 1; i < buttonCount; i += 1) {
				expect(buttons[i].state()).toBe("default");
			}

			buttons[buttonCount - 1].eventHandlers.mousedown();
			expect(buttons[buttonCount - 1].state()).toBe("active");
			buttons[buttonCount - 1].eventHandlers.mouseup();
			for (var i = 0; i < buttonCount - 1; i += 1) {
				expect(buttons[i].state()).toBe("default");
			}

		});
	});
});
