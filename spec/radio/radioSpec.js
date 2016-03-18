var ko = require("knockout");
var createRadio = require("../../src/radio/vm");

describe("=== Radio ===", function() {

	describe(' - with invalid config', function() {

		it('items', function() {
			expect(function() {
				createRadio({
					items: []
				})
			}).toThrowError("config.items should not be empty");
		});
	});


	describe('- with valid config', function() {
		var config = {
			items: [
				{
					label: "randomLabel1"
				},
				{
					icon: "randomIcon1"
				},
				{
					label: "randomLabel2",
					icon: "randomIcon2"
				}
			]
		};

		var vm = createRadio(config);

		it('selected', function() {
			expect(vm.selected().label).toBe("randomLabel1");

			vm.items[1].select();
			expect(vm.selected().icon).toBe("randomIcon1");


			vm.items[2].select();
			expect(vm.selected().label).toBe("randomLabel2");
			expect(vm.selected().icon).toBe("randomIcon2");

		});
	});

});