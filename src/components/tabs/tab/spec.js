var tabCore = require("./../tab/core");

describe("tab", function() {
	describe("dependencies", function() {

		it("should throw error if depencencies is missing", function() {
			expect(function() {
				tabCore();
			}).toThrowError("dependencies is mandatory!");
		});
	});

	describe("with valid config", function() {

		var createTabs;

		beforeEach(function() {
			createTabs = tabCore({
			});
		});

		it("should set config properly", function() {
			createTabs({
				variation: "tab-transparent"
			});
			createTabs({
				component: "someStringToAlter",
				variation: "tab-transparent",
				state: "someOtherStringToAlter"
			});
		});
	});
});