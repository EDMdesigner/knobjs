
var ko = require("knockout");
var createItemsPerPage = require("../../src/itemsPerPage/vm");

describe("=== itemsPerPage ===", function() {

	describe(" - with invalid config", function() {
		it("numOfItems", function() {
			expect(function() {
				createItemsPerPage();
			}).toThrowError("config.numOfItems element is mandatory!");
		});

		it("itemsPerPageList", function() {
			expect(function() {
				createItemsPerPage({
					numOfItems: 100
				});
			}).toThrowError("config.itemsPerPageList element is mandatory!");
		});

		it("itemsPerPage", function() {
			expect(function() {
				createItemsPerPage({
					numOfItems: 100,
					itemsPerPageList: 10
				});
			}).toThrowError("config.itemsPerPage element is mandatory!");
		});
	});

	describe(" - with valid config", function() {

		var config = {
			numOfItems: ko.observable(),
			numOfPages: ko.observable(),
			itemsPerPage: ko.observable(),
			itemsPerPageList: [
				{
					label: 10,
					value: 10
				},
				{
					label: 25,
					value: 25
				},
				{
					label: 50,
					value: 50
				}
			]
		};

		var vm = createItemsPerPage(config);

		it("itemsPerPageList - label - value", function() {
			vm.itemsPerPage(vm.itemsPerPageList[0]);
			expect(vm.itemsPerPage().label).toBe(10);

			vm.itemsPerPage(vm.itemsPerPageList[1]);
			expect(vm.itemsPerPage().value).toBe(25);

			vm.itemsPerPage(vm.itemsPerPageList[2]);
			expect(vm.itemsPerPage().value).toBe(50);
		});

		it("numOf....", function() {
			vm.numOfItems(250);
			vm.itemsPerPage(vm.itemsPerPageList[2]);
			expect(vm.numOfPages()).toBe(5);
		});
	});
});
