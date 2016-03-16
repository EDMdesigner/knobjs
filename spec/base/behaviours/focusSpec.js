var ko = require("knockout");
var focusBehaviour = require("../../../src/base/behaviours/focus");


describe("focus behaviour", function() {

	describe("with invalid config", function() {
		it(" - falsy", function() {
			expect(focusBehaviour).toThrowError("vm is mandatory!");
		});

		it(" - config.state is not observable", function() {
			expect(function() {
				focusBehaviour({});
			}).toThrowError("vm.state has to be a knockout observable!");

			expect(function() {
				focusBehaviour({
					state: function() {}
				});
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("with valid config", function() {
		var vm;
		var actState = "active";

		beforeEach(function() {
			vm = {
				state: ko.observable(actState)
			};
			focusBehaviour(vm);
		});

		it("interface check", function() {
			expect(ko.isObservable(vm.state)).toBe(true);
			expect(typeof vm.eventHandlers).toBe("object");
			expect(typeof vm.eventHandlers.focus).toBe("function");
			expect(typeof vm.eventHandlers.blur).toBe("function");
		});

		it("should set state to 'focus' on focus call", function() {
			vm.eventHandlers.focus();
			expect(vm.state()).toBe("active");
		});

		it("should set state to the previous state on blur call", function() {
			vm.eventHandlers.focus();
			expect(vm.state()).toBe("active");
			vm.eventHandlers.blur();
			expect(vm.state()).toBe("default");
		});

		it("should not set the state on focus call when the state is 'disabled' or 'default'", function() {
			vm.state("disabled");

			vm.eventHandlers.focus();
			expect(vm.state()).toBe("disabled");

			vm.eventHandlers.blur();
			expect(vm.state()).toBe("disabled");

			vm.state("active");

			vm.eventHandlers.focus();
			expect(vm.state()).toBe("active");

			vm.eventHandlers.blur();
			expect(vm.state()).toBe("default");
		});
	});
});
