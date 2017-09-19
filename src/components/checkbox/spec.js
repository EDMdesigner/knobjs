var ko = require("knockout");
var checkboxCore = require("./core");
//var describeEventHandler = require("../base/behaviours/behaviourHelper");

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

var tickIcon = "icon-check";
var crossIcon = "icon-close";
var value = ko.observable(false);

describe("Checkbox", function() {

	describe("Invalid config", function() {
		var mockBase;
		var createCheckbox;

		beforeEach(function() {
			mockBase = {};

			createCheckbox = checkboxCore({
				ko: ko,
				base: mockBase
			});
		});

		it("missing config", function() {
			expect(createCheckbox).toThrowError("config is mandatory!");
		});

		it("config has to contain value", function() {
			expect(function() {
				createCheckbox({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					icons: {
						tick: tickIcon,
						cross: crossIcon
					}
				});
			}).toThrowError("config.value is mandatory and must be an observable!");
		});

		it("config.value has to be an observable", function() {
			expect(function() {
				createCheckbox({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					icons: {
						tick: tickIcon,
						cross: crossIcon
					},
					value: "notAnObservable"
				});
			}).toThrowError("config.value is mandatory and must be an observable!");
		});

		it("config has to contain icons", function() {
			expect(function() {
				createCheckbox({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					value: value
				});
			}).toThrowError("config.icons is mandatory and must be an object!");
		});

		it("config.icons has to be an object", function() {
			expect(function() {
				createCheckbox({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					icons: "notAnObject",
					value: value
				});
			}).toThrowError("config.icons is mandatory and must be an object!");
		});

		it("config.icons has to contain tick icon", function() {
			expect(function() {
				createCheckbox({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					icons: {
						cross: crossIcon
					},
					value: value
				});
			}).toThrowError("config.icons.tick is mandatory!");
		});

		it("config.icons has to contain cross icon", function() {
			expect(function() {
				createCheckbox({
					componentName: componentName,
					variation: variation,
					initialState: initialState,
					style: style,
					icons: {
						tick: tickIcon
					},
					value: value
				});
			}).toThrowError("config.icons.cross is mandatory!");
		});
	});

	describe("With valid config", function() {
		var checkboxVm;
		var createCheckbox;
		var mockBase;

		beforeEach(function() {
			function createMockBaseFunction() {
				return function() {
					var vm = {
						behaviours: {
							hover: {
								enable: function() {

								},
							},
							click: {
								enable: function() {
								}
							}
						}
					};

					spyOn(vm.behaviours.click, "enable");

					return vm;
				};
			}

			

			mockBase = createMockBaseFunction();

			createCheckbox = checkboxCore({
				ko: ko,
				base: mockBase
			});
		});

		it("config.icons", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				icons: {
					tick: tickIcon,
					cross: crossIcon
				},
				value: value
			};


			checkboxVm = createCheckbox(config);

			expect(ko.isObservable(checkboxVm.tick)).toBe(true);
			expect(ko.isObservable(checkboxVm.cross)).toBe(true);
			expect(checkboxVm.tick()).toBe(config.icons.tick);
			expect(checkboxVm.cross()).toBe(config.icons.cross);

		});

		it("interface", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				icons: {
					tick: tickIcon,
					cross: crossIcon
				},
				value: value
			};

			checkboxVm = createCheckbox(config);

			expect(checkboxVm.value).toBe(config.value);
			expect(ko.isObservable(checkboxVm.value)).toBe(true);
			expect(typeof checkboxVm.click).toBe("function");
		});

		it("click behaviour", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				icons: {
					tick: tickIcon,
					cross: crossIcon
				},
				value: value
			};

			checkboxVm = createCheckbox(config);
		});

		it("value change on click", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				icons: {
					tick: tickIcon,
					cross: crossIcon
				},
				value: value
			};

			checkboxVm = createCheckbox(config);
			var initialValue = value();
			checkboxVm.click();
			expect(checkboxVm.value()).toBe(!initialValue);
			checkboxVm.click();
			expect(checkboxVm.value()).toBe(initialValue);
		});

		it("handle disabled state", function() {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				icons: {
					tick: tickIcon,
					cross: crossIcon
				},
				value: value,
				disabled: "disabled"
			};

			checkboxVm = createCheckbox(config);
			var initialValue = value();
			checkboxVm.click();
			expect(checkboxVm.value()).toBe(initialValue);
		});
	});
});
