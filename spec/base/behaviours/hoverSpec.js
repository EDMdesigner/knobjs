var ko = require("knockout");
var hoverBehaviour = require("../../../src/base/behaviours/hover");

describe("hover behaviour", function() {
	describe("with invalid config", function() {
		it(" - falsy", function() {
			expect(hoverBehaviour).toThrowError("vm is mandatory!");
		});

		it(" - config.state is not observable", function() {
			expect(function() {
				hoverBehaviour({});
			}).toThrowError("vm.state has to be a knockout observable!");

			expect(function() {
				hoverBehaviour({
					state: function() {}
				});
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("with valid config", function() {
		var vm;
		var defaultState = "myDefaultState";
		beforeEach(function() {
			vm = {
				state: ko.observable(defaultState)
			};
			hoverBehaviour(vm);			
		});

		it("interface check", function() {
			expect(ko.isObservable(vm.state)).toBe(true);
			expect(typeof vm.eventHandlers).toBe("object");
			expect(typeof vm.eventHandlers.mouseover).toBe("function");
			expect(typeof vm.eventHandlers.mouseout).toBe("function");
		});

		it("should set state to 'hover' on mouseover call", function() {
			vm.eventHandlers.mouseover();
			expect(vm.state()).toBe("hover");
		});

		it("should set state to the previous state on mouseout call", function() {
			vm.eventHandlers.mouseover();
			expect(vm.state()).toBe("hover");
			vm.eventHandlers.mouseout();
			expect(vm.state()).toBe(defaultState);
		});

		it("should not set the state on mouseover call when the state is 'disabled' or 'active'", function() {
			vm.state("disabled");

			vm.eventHandlers.mouseover();
			expect(vm.state()).toBe("disabled");

			vm.eventHandlers.mouseout();
			expect(vm.state()).toBe("disabled");


			vm.state("active");

			vm.eventHandlers.mouseover();
			expect(vm.state()).toBe("active");

			vm.eventHandlers.mouseout();
			expect(vm.state()).toBe("active");
		});
	});
});