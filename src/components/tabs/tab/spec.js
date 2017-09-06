var tabCore = require("./../tab/core");

describe("tab", function() {
	describe("dependencies", function() {

		it("should throw error if depencencies is missing", function() {
			expect(function() {
				tabCore();
			}).toThrowError("dependencies is mandatory!");
		});

		it("should throw error if depencencies.base is missing", function() {
			expect(function() {
				tabCore({});
			}).toThrowError("dependencies.base is mandatory!");
		});

	});

	describe("with valid config", function() {

		var createTabs;
		var mockBase;

		beforeEach(function() {
			mockBase = jasmine.createSpy("base");
			createTabs = tabCore({
				base: mockBase
			});
		});

		it("should set config properly and pass parameters to base", function() {
			createTabs({
				variation: "tab-transparent"
			});
			createTabs({
				component: "someStringToAlter",
				variation: "tab-transparent",
				state: "someOtherStringToAlter"
			});

			expect(mockBase).toHaveBeenCalledTimes(2);
			expect(mockBase.calls.argsFor(0)[0]).toEqual({
				component: "tab",
				variation: "tab-transparent",
				state: "active"
			});
			expect(mockBase.calls.argsFor(1)[0]).toEqual({
				component: "tab",
				variation: "tab-transparent",
				state: "active"
			});
		});
	});
});