
var ko = require("knockout");
var createItemsPerPage = require("../vm");

describe("=== itemsPerPage ===", function() {

	describe(" - with invalid config", function() {
		it("numOfItems", function() {
			expect(function() {
				createItemsPerPage();
			}).toThrowError("config.numOfItems element is mandatory!");
		});

		it("itemsPerPageList not empty", function() {
			expect(function() {
				createItemsPerPage({
					numOfItems: ko.observable(),
					itemsPerPageList: [{}]
				});
			}).toThrowError("each element of config.items has to have label and/or value property");
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

		it("numOfPages and numOfItems should be observable", function() {
			expect(ko.isObservable(vm.numOfItems)).toBe(true);
			expect(ko.isObservable(vm.numOfPages)).toBe(true);
			expect(ko.isObservable(vm.itemsPerPage)).toBe(true);
		});

		it("itemsPerPageList is array", function() {
			expect(vm.itemsPerPageList.length).toBe(3);
		});

		it("valid typeof label and value", function() {
			expect(typeof vm.itemsPerPage().value).toBe("number");
			expect(typeof vm.itemsPerPage().label).not.toBeUndefined();
		});

		it("itemsPerPageList - label - value", function() {
			vm.itemsPerPage(vm.itemsPerPageList[0]);
			expect(vm.itemsPerPage().label).toBe(10);

			vm.itemsPerPage(vm.itemsPerPageList[1]);
			expect(vm.itemsPerPage().value).toBe(25);

			vm.itemsPerPage(vm.itemsPerPageList[2]);
			expect(vm.itemsPerPage().value).toBe(50);
		});

		it("Change numOfItems and itemsPerPage, should change numOfPages value", function() {
			vm.numOfItems(250);
			vm.itemsPerPage(vm.itemsPerPageList[2]);
			expect(vm.numOfPages()).toBe(5);
		});
	});
});
