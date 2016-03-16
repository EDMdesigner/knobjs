var createTabs = require("../../src/tabs/vm");

describe("tabs", function() {
	describe("with invalid config", function() {
		it("should not work without child knob-tab components", function() {
			expect(createTabs).toThrowError("knob-tabs component should have at least one knob-tab component as a child component!");
		});

		it("should not work if the knob-tab child components don't have the proper params", function() {
			var componentInfo = {
				templateNodes: [
					{
						nodeName: "TEXT"
					},
					{
						nodeName: "KNOB-TAB",
						getAttribute: function() {
							return "";
						}
					}
				]
			};

			expect(function() {
				createTabs({}, componentInfo);
			}).toThrowError("the child knob-tab components should have proper params (icon and/or label) just like with buttons!");
		});
	});
});
