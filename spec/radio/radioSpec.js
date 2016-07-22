var ko = require("knockout");
var createRadio = require("../../src/radio/vm");

describe("=== Radio ===", function() {

	describe(" - with invalid config", function() {

		it("items is an empty array", function() {
			expect(function() {
				createRadio({
					items: []
				});
			}).toThrowError("config.items should not be empty");
		});

		it("items without label or icon property", function() {
			expect(function() {
				createRadio({
					items: [
						{
							value: "majom"
						}
					],
					selected: ko.observable()
				});
			}).toThrowError("each element of config.items has to have label and/or icon property");
		});

	});


	describe("- with valid config", function() {
		var config = {
			items: [
				{
					label: "randomLabel0"
				},
				{
					icon: "randomIcon1"
				},
				{
					label: "randomLabel2",
					icon: "randomIcon2"
				},
				{
					label: "randomLabel3",
					icon: "randomIcon3",
					value: "randomValue3"
				}
			]
		};

		var vm = createRadio(config);

		it("selected", function() {
			expect(vm.selected().label).toBe("randomLabel0");

			vm.items[1].select();
			expect(vm.selected().icon).toBe("randomIcon1");

			vm.items[2].select();
			expect(vm.selected().label).toBe("randomLabel2");
			expect(vm.selected().icon).toBe("randomIcon2");

			vm.items[3].select();
			expect(vm.selected().label).toBe("randomLabel3");
			expect(vm.selected().icon).toBe("randomIcon3");
			expect(vm.selected().value).toBe("randomValue3");

		});
	});

});
