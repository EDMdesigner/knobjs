var ko = require("knockout");
var clickBehaviour = require("../../../src/base/behaviours/click");

describe("click behaviour", function() {

	describe("with invalid config", function() {
		it(" - falsy", function() {
			expect(clickBehaviour).toThrowError("vm is mandatory!");
		});

		it(" - config.state is not observable", function() {
			expect(function() {
				clickBehaviour({});
			}).toThrowError("vm.state has to be a knockout observable!");

			expect(function() {
				clickBehaviour({
					state: function() {}
				});
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("with valid config", function() {
		var vm;
		var actState = "hover";

		beforeEach(function() {
			vm = {
				state: ko.observable(actState)
			};
			clickBehaviour(vm);
		});

		it("interface check", function() {
			expect(ko.isObservable(vm.state)).toBe(true);
			expect(typeof vm.eventHandlers).toBe("object");
			expect(typeof vm.eventHandlers.mousedown).toBe("function");
			expect(typeof vm.eventHandlers.mouseup).toBe("function");
		});

		it("should set state to 'click' on mousedown call", function() {
			vm.eventHandlers.mousedown();
			expect(vm.state()).toBe("active");
		});

		it("should set state to the previous state on mouseup call", function() {
			vm.eventHandlers.mousedown();
			expect(vm.state()).toBe("active");
			vm.eventHandlers.mouseup();
			expect(vm.state()).toBe("hover");
		});

		it("should not set the state on mousedown call when the state is 'disabled' or 'active'", function() {
			vm.state("disabled");

			vm.eventHandlers.mousedown();
			expect(vm.state()).toBe("disabled");

			vm.eventHandlers.mouseup();
			expect(vm.state()).toBe("disabled");

			vm.state("active");

			vm.eventHandlers.mousedown();
			expect(vm.state()).toBe("active");

			vm.eventHandlers.mouseup();
			expect(vm.state()).toBe("hover");
		});
	});
});
