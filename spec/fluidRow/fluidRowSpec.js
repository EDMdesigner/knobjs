var fluidRowCore = require("../../src/fluidRow/core");

describe("Fluid Row", function() {
	describe("- with invalid config", function() {
		var mockBase = {};

		var createFluidRow = fluidRowCore({
			base: mockBase
		});

		it("missing config", function() {
			expect(createFluidRow).toThrowError("config is mandatory!");
		});

		it("missing label", function() {
			expect(function() {
				createFluidRow({});
			}).toThrowError("config.label is mandatory!");
		});

		it("invalid multiline type", function() {
			expect(function() {
				createFluidRow({
					label: "asd",
					multiline: 1
				});
			}).toThrowError("config.multiline must be a boolean!");
		});
	});

	describe("- with valid config", function() {
		var style;
		var config;
		var createFluidRow;

		beforeAll(function() {
			style = {
				"default": {
					"default": {
						"backgroundColor": "#696969",
						"borderColor": "#696969"
					}
				}
			};

			config = {
				label: "Label",
				style: style
			};

			createFluidRow = fluidRowCore({
				base: function() { return {}; }
			});
		});

		describe("without multiline", function() {
			var vm;

			beforeEach(function() {
				vm = createFluidRow(config);
			});

			it("should create the viewmodel", function() {
				expect(vm.label).toBe("Label");
				expect(vm.multiline).toBe(false);
			});
		});

		describe("with multiline", function() {
			var vm;

			beforeEach(function() {
				config.multiline = true;
				vm = createFluidRow(config);
			});

			it("should create the viewmodel", function() {
				expect(vm.label).toBe("Label");
				expect(vm.multiline).toBe(true);
			});
		});
	});
});