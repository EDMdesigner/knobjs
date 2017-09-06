var focusCore = require("../behaviours/focusCore");
var ko = require("knockout");

describe("Focus behaviour", function() {
	
	describe("with invalid config", function() {
		it("missing config", function() {
			var focusBehaviour = focusCore({
				ko: ko
			});

			expect(focusBehaviour).toThrowError("vm is mandatory!");
		});

		it("state not observable", function() {
			var focusBehaviour = focusCore({
				ko: ko
			});

			var mockVm = {
				state: "notAnObservables"
			};

			expect(function() {
				focusBehaviour(mockVm);
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("with valid config", function() {
		var mockVm;
		var focusBehaviour;

		beforeEach(function() {
			mockVm = {
				state: ko.observable("default")
			};

			focusBehaviour = focusCore({
				ko: ko
			});

			focusBehaviour(mockVm);
		});

		//interface check
		it("eventHandlers are functions, state is knockout observable", function() {
			expect(typeof mockVm.eventHandlers.focus).toBe("function");
			expect(typeof mockVm.eventHandlers.blur).toBe("function");
			expect(ko.isObservable(mockVm.state)).toBe(true);
		});

		//focus disabled
		it("state remains disabled", function() {
			mockVm.state("disabled");

			mockVm.eventHandlers.focus();
			expect(mockVm.state()).toBe("disabled");
		});

		//focus enabled
		it("state changes to active", function() {
			mockVm.eventHandlers.focus();
			expect(mockVm.state()).toBe("active");
		});

		//blur disabled
		it("state remains disabled", function() {
			mockVm.state("disabled");

			mockVm.eventHandlers.blur();
			expect(mockVm.state()).toBe("disabled");
		});

		//blur enabled
		it("state changes to default", function() {
			mockVm.eventHandlers.blur();
			expect(mockVm.state()).toBe("default");
		});
	});
});