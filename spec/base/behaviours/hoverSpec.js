var hoverCore = require("../../../src/base/behaviours/hoverCore");
var ko = require("knockout");
/*var invalidConfig = require("./invalidConfigHelper");
var describeEventHandler = require("./behaviourHelper");*/

describe("Hover behaviour", function() {

	describe("with invalid config", function() {
		it("missing config", function() {
			var hoverBehaviour = hoverCore({
					ko: ko
				});

			expect(hoverBehaviour).toThrowError("vm is mandatory!");
		});

		it("state not observable", function() {
			var hoverBehaviour = hoverCore({
				ko: ko
			});

			var mockVm = {
				state: "notAnObservables"
			};

			expect(function() {
				hoverBehaviour(mockVm);
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("with valid config", function() {
		var mockVm;
		var hoverBehaviour;

		beforeEach(function() {
			mockVm = {
				state: ko.observable("default")
			};

			hoverBehaviour = hoverCore({
				ko: ko
			});

			hoverBehaviour(mockVm);
		});

		//interface check
		it("eventHandlers are function, state is a knockout observable", function() {
			expect(typeof mockVm.eventHandlers.mouseover).toBe("function");
			expect(typeof mockVm.eventHandlers.mouseout).toBe("function");
			expect(ko.isObservable(mockVm.state)).toBe(true);
		});

		//hover disabled or disabled mouseover
		it("state doesn't change it's value when disabled or active on mouseOver", function() {
			mockVm.state("disabled");

			mockVm.eventHandlers.mouseover();
			expect(mockVm.state()).toBe("disabled");

			mockVm.state("active");

			mockVm.eventHandlers.mouseover();
			expect(mockVm.state()).toBe("active");
		});

		//hover other mouseover
		it("state changes to hover if not disabeld or active on mouseOver", function() {
			mockVm.eventHandlers.mouseover();
			expect(mockVm.state()).toBe("hover");
		});

		//hover disabled or active mouseout
		it("state doesn't change it's value when disabled or active on mouseOut", function() {
			mockVm.state("disabled");

			mockVm.eventHandlers.mouseout();
			expect(mockVm.state()).toBe("disabled");

			mockVm.state("active");

			mockVm.eventHandlers.mouseout();
			expect(mockVm.state()).toBe("active");
		});

		//hover other mouseout
		it("state changes back to it's previous on mouseOut", function() {
			mockVm.eventHandlers.mouseover();
			mockVm.eventHandlers.mouseout();
			expect(mockVm.state()).toBe("default");
		});
	});
});