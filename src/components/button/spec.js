var ko = require("knockout");
var buttonCore = require("./core");

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

var window = {
	addEventListener: (type, callback) => callback(mockedEvent),
	removeEventListener: jasmine.createSpy()
};

const mockedEvent = {
	stopPropagation: jasmine.createSpy(),
	event: "mouseup"
};

describe("Button", function() {

	describe("Invalid config", function() {
		var mockBase = {};

		var createButton = buttonCore({
			ko: ko,
			base: mockBase,
			window: window
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
			spyOn(window, "addEventListener").and.callThrough();

			window.addEventListener.calls.reset();
			window.removeEventListener.calls.reset();

			function createMockBaseFunction() {
				return function() {
					var vm = {};

					return vm;
				};
			}

			mockBase = createMockBaseFunction();

			createButton = buttonCore({
				ko: ko,
				base: mockBase,
				window: window
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
				click: click,

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


		it("adds event listeners", () => {
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
			expect(window.addEventListener).toHaveBeenCalledTimes(1);
		});	

		it("should call click only once without triggerOnHold", function() {
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

			buttonVm.click();
			expect(config.click).toHaveBeenCalledTimes(1);
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

			buttonVm.currentStyle("active");
			setTimeout(function() {
				buttonVm.currentStyle("default");
				expect(config.click.calls.count()).toBeGreaterThan(2);
				done();
			}, 301);
		});
	});
});