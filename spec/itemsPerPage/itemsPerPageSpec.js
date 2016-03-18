
var ko = require("knockout");
var createItemsPerPage = require("../../src/itemsPerPage/vm");

describe('=== itemsPerPage ===', function() {

	describe(' - with invalid config', function() {
		it("numOfItems", function() {
			expect(function() {
				createItemsPerPage({
					numOfItems: ""
				});
			}).toThrowError("config.numOfItems element is mandatory!");
		});

		it("itemsPerPageList", function() {
			expect(function() {
				createItemsPerPage({
					numOfItems: 100,
					itemsPerPageList: ""
				});
			}).toThrowError("config.itemsPerPageList element is mandatory!");
		});

		it("itemsPerPage", function() {
			expect(function() {
				createItemsPerPage({
					numOfItems: 100,
					itemsPerPageList: 10,
					itemsPerPage: ""
				});
			}).toThrowError("config.itemsPerPage element is mandatory!");
		});
	});

	describe(' - with valid config', function() {

		var config = {
			numOfItems: ko.observable(),
			itemsPerPage: ko.observable(),
			itemsPerPageList: [
				{
					label: 10,
					value: 10
				}
			]
		};

		var vm = createItemsPerPage(config);

		it('itemsPerPageList - label - value', function() {
			vm.itemsPerPage();
			expect(vm.itemsPerPage().label).toBe(10);
			expect(vm.itemsPerPage().value).toBe(10);
		});
	});
});