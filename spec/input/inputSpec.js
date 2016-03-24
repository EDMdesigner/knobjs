var ko = require("knockout");
var createInput = require("../../src/input/vm");

var style = {
	default: {
		default: {
			color: "#001",
			borderColor: "#001"
		},
		hover: {
			color: "#003",
			borderColor: "#003"
		},
		active: {
			color: "#005",
			borderColor: "#005"
		}
	}
};

describe("Input", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createInput).toThrowError("config is mandatory!");
		});

		it("invalid value type", function() {
			expect(function() {
				createInput({
					type: "text",
					style: style,
					value: "string"
				});
			}).toThrowError("config.value must be an observable");
		});

		it("invalid hasFocus type", function() {
			expect(function() {
				createInput({
					type: "text",
					style: style,
					hasFocus: "string"
				});
			}).toThrowError("config.hasFocus must be an observable");
		});
	});

	describe("- with valid config", function() {
		var config = {
			type: "text",
			style: style
		};

		var inputVm = createInput(config);

		it("interface", function() {
			expect(typeof inputVm.eventHandlers.mouseover).toBe("function");
			expect(typeof inputVm.eventHandlers.focus).toBe("function");
			expect(ko.isObservable(inputVm.hasFocus)).toBe(true);
		});

		it("style behaviour", function() {
			inputVm.eventHandlers.mouseover();
			expect(inputVm.style()).toBe(style.default.hover);
			inputVm.eventHandlers.mouseout();
			expect(inputVm.style()).toBe(style.default.default);
			inputVm.eventHandlers.focus();
			expect(inputVm.style()).toBe(style.default.active);

		});
	});
});
