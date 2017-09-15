var ko = require("knockout");
var textareaCore = require("./core");

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
		var textareaVm;

		beforeEach(function () {
			function createMockBaseFunction() {
				return function() {
					var vm = {};

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
			textareaVm = createTextarea(config);

			expect(ko.isObservable(textareaVm.hasFocus)).toBe(true);
			expect(ko.isObservable(textareaVm.value)).toBe(true);
		});
	});
});
