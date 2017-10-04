var ko = require("knockout");
var createHelpBox = require("./vm");

describe("helpBox", function() {

	var boxEnabled, infoEnabled, hideBox, showBox, vm;

	beforeEach(function(){
	    var vm = createHelpBox();
	});

	it("interface", function() {
		expect(ko.isObservable(vm.boxEnabled)).toBe(true);
		expect(ko.isObservable(vm.infoEnabled)).toBe(false);
		expect(typeof vm.hideBox).toBe("function");
		expect(typeof vm.showBox).toBe("function");
	});

	it("toggle hideBox", function() {
		expect(vm.boxEnabled).toBe(false);
		expect(vm.infoEnabled).toBe(true);
		vm.createHelpBox();
		expect(vm.infoEnabled).toBe(true);
		expect(vm.infoEnabled).toBe(false);
	});

	it("toggle showBox", function() {
		expect(vm.boxEnabled).toBe(true);
		expect(vm.infoEnabled).toBe(false);
		vm.createHelpBox();
		expect(vm.infoEnabled).toBe(false);
		expect(vm.infoEnabled).toBe(true);
	});

});