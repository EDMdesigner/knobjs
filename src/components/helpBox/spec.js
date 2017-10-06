var ko = require("knockout");
var helpBoxCore = require("./core");

describe("helpBox", function() {

	var vm; 
	var mockLs;

	beforeEach(function(){
		mockLs = {
			setItem: function(){},
			getItem: function(){}
		};

		spyOn(mockLs, "setItem").and.callThrough();
		spyOn(mockLs, "getItem").and.callThrough();

		var createHelpBox = helpBoxCore({
			ko: ko,
			localStorage: mockLs
		});

	    vm = createHelpBox();
	});

	it("interface", function() {
		expect(ko.isObservable(vm.boxEnabled)).toBe(true);
		expect(ko.isObservable(vm.infoEnabled)).toBe(true);
		
		expect(mockLs.getItem.calls.count()).toBe(1);

		expect(typeof vm.hideBox).toBe("function");
		expect(typeof vm.showBox).toBe("function");

		expect(vm.boxEnabled()).toBe(true);
		expect(vm.infoEnabled()).toBe(false);
	});

	it("toggle hideBox", function() {
		vm.hideBox();
		expect(vm.boxEnabled()).toBe(false);
		expect(vm.infoEnabled()).toBe(true);

		expect(mockLs.setItem.calls.count()).toBe(1);
	});

	it("toggle showBox", function() {
		vm.boxEnabled(false);
		vm.infoEnabled(true);

		vm.showBox();

		expect(vm.boxEnabled()).toBe(true);
		expect(vm.infoEnabled()).toBe(false);
		
		expect(mockLs.setItem.calls.count()).toBe(1);
	});
});
