var ko = require("knockout");
var textareaCore = require("../../src/textarea/core");

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

describe("Textarea", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			var mockBase = {};

			var createTextarea = textareaCore({
				ko: ko,
				base: mockBase
			});

			expect(createTextarea).toThrowError("config is mandatory!");
		});

		it("invalid value type", function() {
			var mockBase = {};

			var createTextarea = textareaCore({
				ko: ko,
				base: mockBase
			});

			expect(function() {
				createTextarea({
					type: "text",
					style: style,
					value: "string"
				});
			}).toThrowError("config.value must be an observable");
		});

		it("invalid hasFocus type", function() {
			var mockBase = {};

			var createTextarea = textareaCore({
				ko: ko,
				base: mockBase
			});

			expect(function() {
				createTextarea({
					type: "text",
					style: style,
					hasFocus: "string"
				});
			}).toThrowError("config.hasFocus must be an observable");
		});
	});

	describe("- with valid config", function() {
		var mockBase;
		var createTextarea;
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
			createTextarea = textareaCore({
				ko: ko,
				base: mockBase
			});
		});

		var config = {
			type: "text",
			style: style
		};

		it("interface", function() {
			inputVm = createTextarea(config);

			expect(ko.isObservable(inputVm.hasFocus)).toBe(true);
			expect(ko.isObservable(inputVm.value)).toBe(true);
		});

		it("behaviour check", function() {
			inputVm = createTextarea(config);

			expect(inputVm.behaviours.hover.enable).toHaveBeenCalled();
			expect(inputVm.behaviours.focus.enable).toHaveBeenCalled();
		});
	});
});
