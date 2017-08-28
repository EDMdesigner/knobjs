var ko = require("knockout");
var inputCore = require("./core");

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
			var mockBase = {};

			var createInput = inputCore({
				ko: ko,
				base: mockBase
			});

			expect(createInput).toThrowError("config is mandatory!");
		});

		it("invalid value type", function() {
			var mockBase = {};

			var createInput = inputCore({
				ko: ko,
				base: mockBase
			});

			expect(function() {
				createInput({
					type: "text",
					style: style,
					value: "string"
				});
			}).toThrowError("config.value must be an observable");
		});

		it("invalid hasFocus type", function() {
			var mockBase = {};

			var createInput = inputCore({
				ko: ko,
				base: mockBase
			});

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
		var mockBase;
		var createInput;
		var inputVm;

		beforeEach(function () {
			function createMockBaseFunction() {
				return function() {
					var vm = {
						behaviours: {
							hover: {
								enable: function() {

								},
							},
							focus: {
								enable: function() {

								},
							}
						}
					};

					spyOn(vm.behaviours.hover, "enable");
					spyOn(vm.behaviours.focus, "enable");

					return vm;
				};
			}

			mockBase = createMockBaseFunction();
			createInput = inputCore({
				ko: ko,
				base: mockBase
			});
		});

		var config = {
			type: "text",
			style: style
		};

		it("interface", function() {
			inputVm = createInput(config);

			expect(ko.isObservable(inputVm.hasFocus)).toBe(true);
			expect(ko.isObservable(inputVm.value)).toBe(true);
			expect(typeof inputVm.type).toBe("string");
		});

		it("behaviour check", function() {
			inputVm = createInput(config);

			expect(inputVm.behaviours.hover.enable).toHaveBeenCalled();
			expect(inputVm.behaviours.focus.enable).toHaveBeenCalled();
		});
	});
});
