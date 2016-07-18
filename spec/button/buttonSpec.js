var ko = require("knockout");
var buttonCore = require("../../src/button/core");

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
		var mockBase = {};

		var createButton = buttonCore({
			ko: ko,
			base: mockBase
		});

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
		var createButton;
		var mockBase;
		var buttonVm;

		beforeEach(function() {
			function createMockBaseFunction() {
				return function() {
					var vm = {
						behaviours: {
							hover: {
								enable: function() {

								},
							},
							select: {
								enable: function() {

								},
							},
							click: {
								enable: function() {
								
								}
							}
						},
						state: ko.observable("default")
					};

					spyOn(vm.behaviours.hover, "enable");
					spyOn(vm.behaviours.select, "enable");
					spyOn(vm.behaviours.click, "enable");

					return vm;
				};
			}

			

			mockBase = createMockBaseFunction();

			createButton = buttonCore({
				ko: ko,
				base: mockBase
			});
		});

		

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


			expect(ko.isObservable(buttonVm.leftIcon)).toBe(true);
			expect(ko.isObservable(buttonVm.rightIcon)).toBe(true);
			expect(ko.isObservable(buttonVm.label)).toBe(true);
			expect(typeof buttonVm.value).toBe(typeof config.value);
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
			
			expect(buttonVm.behaviours.hover.enable).toHaveBeenCalled();
			expect(buttonVm.behaviours.select.enable).toHaveBeenCalled();
			expect(buttonVm.behaviours.click.enable).not.toHaveBeenCalled();
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

			expect(buttonVm.behaviours.hover.enable).toHaveBeenCalled();
			expect(buttonVm.behaviours.select.enable).not.toHaveBeenCalled();
			expect(buttonVm.behaviours.click.enable).toHaveBeenCalled();
		});

		it("should call click only once without triggerOnHold", function(done) {
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

			spyOn(config, "click");

			buttonVm = createButton(config);

			buttonVm.state("active");
			setTimeout(function() {
				buttonVm.state("hover");
				expect(config.click).toHaveBeenCalledTimes(1);
				done();
			}, 100);
		});

		it("should call click several times when triggerOnHold is defined", function(done) {
			var config = {
				componentName: componentName,
				variation: variation,
				initialState: initialState,
				style: style,
				leftIcon: leftIcon,
				label: label,
				value: value,
				click: click,
				triggerOnHold: {
					minTimeout: 50,
					timeoutDecrement: 0,
					baseTimeout: 100
				}
			};

			spyOn(config, "click");

			buttonVm = createButton(config);

			buttonVm.state("active");
			setTimeout(function() {
				buttonVm.state("default");
				expect(config.click).toHaveBeenCalledTimes(3);
				done();
			}, 301);
		});
	});
});