var ko = require("knockout");
var createButton = require("../../src/button/vm");
var describeEventHandler = require("../base/behaviours/behaviourHelper");

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
var click = function() {};

describe("Button", function() {

	describe("Invalid config", function() {

		it("missing config", function() {
			expect(createButton).toThrowError("config is mandatory!");
		});

		it("config.click has to be a function", function() {
			expect(function() {
				createButton({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					leftIcon: leftIcon,
					label: label,
					value: value,

					click: "notAFunction"
				});
			}).toThrowError("click has to be a function!");
		});

		it("config has to contain minimum one of label/lefticon/righticon/icon", function() {
			expect(function() {
				createButton({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					value: value,
					click: function() {}
				});
			}).toThrowError("either label/lefticon/righticon/icon has to be given!");
		});
	});

	describe("With valid config", function() {

		var buttonVm;

		it("config.icon", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				icon: leftIcon,
				label: label,
				value: value,
				click: click
			};


			buttonVm = createButton(config);

			expect(buttonVm.leftIcon()).toBe(config.icon);
			expect(ko.isObservable(buttonVm.leftIcon)).toBe(true);

		});

		it("interface", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				leftIcon: leftIcon,
				label: label,
				value: value,
				click: click
			};

			buttonVm = createButton(config);

			expect(buttonVm.leftIcon()).toBe(config.leftIcon);
			expect(buttonVm.rightIcon()).toBe(config.rightIcon);
			expect(buttonVm.label()).toBe(config.label);
			expect(buttonVm.value).toBe(config.value);
			expect(buttonVm.click).toBe(config.click);


			expect(ko.isObservable(buttonVm.leftIcon)).toBe(true);
			expect(ko.isObservable(buttonVm.rightIcon)).toBe(true);
			expect(ko.isObservable(buttonVm.label)).toBe(true);
			expect(typeof buttonVm.value).toBe(typeof config.value);
			expect(typeof buttonVm.click).toBe("function");
		});

		it("radio behaviour", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				leftIcon: leftIcon,
				label: label,
				value: value,
				radio: true,
				click: click
			};

			buttonVm = createButton(config);

			describeEventHandler({
				label: "select",
				vm: buttonVm,
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

		it("click behaviour", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				leftIcon: leftIcon,
				label: label,
				value: value,
				click: click
			};

			buttonVm = createButton(config);

			describeEventHandler({
				label: "clickBehaviour",
				vm: buttonVm,
				firstEvent: {
					name: "mousedown",
					notsetState: "disabled",
					setState: "active"
				},
				secondEvent: {
					name: "mouseup",
					notsetState: "disabled",
					setState: "hover"
				}
			});
		});
	});
});
