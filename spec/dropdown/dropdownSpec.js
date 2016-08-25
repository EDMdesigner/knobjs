var ko = require("knockout");
var createButtonDropdown = require("../../src/dropdown/vm");

describe(" === Dropdown === ", function() {
	describe(" - with invalid config", function() {

		it("should throw error if config.rightIcon isn't given", function() {
			expect(createButtonDropdown).toThrowError("config.rightIcon element is mandatory!");
		});

		it("should throw error if config.items isn't given", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random"
				});
			}).toThrowError("config.items element is mandatory!");
		});

		it("should throw error if config.selected is not an observable", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					selected: "notAnObservable",
					items: []
				});
			}).toThrowError("config.selected has to be a knockout observable!");
		});

		it("should throw error if type of config.items isn't array or observableArray", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					items: "notArrayNorObservableArray",
					selected: ko.observable()
				}).toThrowError("config.items should be an array or an observableArray!");
			});
		});

		it("should throw error if config.items is empty array or is an empty observableArray", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					items: [],
					selected: ko.observable()
				}).toThrowError("config.items should not be empty");
			});
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					items: ko.observableArray([]),
					selected: ko.observable()
				}).toThrowError("value of config.items should not be empty");
			});
		});

		it("should throw error if config.items has an element which doesn't have label and/or icon property", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					items: [
						{
							value: ""
						}
					],
					selected: ko.observable()
				});
			}).toThrowError("each element of config.items has to have label and/or icon property");
		});
	});

	describe(" - with valid config", function() {

		var config = {
			rightIcon: "random",
			selected: ko.observable(),
			items: [
				{
					label: "randonLabel1"
				},
				{
					icon: "ranomdIcon1"
				},
				{
					label: "randonLabel2",
					icon: "ranomdIcon2"
				}
			]
		};

		var vm = createButtonDropdown(config);

		it("toggleDropdownVisible true or false", function() {
			expect(vm.dropdownVisible()).toBe(false);
			vm.dropdownVisible.toggle();
			expect(vm.dropdownVisible()).toBe(true);
			vm.dropdownVisible.toggle();
			expect(vm.dropdownVisible()).toBe(false);
		});

		it("should be set right icon and/or label when selected", function() {
			expect(vm.selected().label()).toBe("randonLabel1");

			vm.options()[1].select();
			expect(vm.selected().icon()).toBe("ranomdIcon1");

			vm.options()[2].select();
			expect(vm.selected().label()).toBe("randonLabel2");
			expect(vm.selected().icon()).toBe("ranomdIcon2");
		});
		describe("optional observable parameters", function() {

			var items;
			var selectedIdx;
			beforeEach(function() {
				items = ko.observableArray([]);
				selectedIdx = ko.observable(0);
				items([
					{
						label: "label1",
						value: "value1"
					},
					{
						label: "label2",
						value: "value2"
					},
					{
						label: "label3",
						value: "value3"
					}
				]);
				config.items = items;
				config.selectedIdx = selectedIdx;
				vm = createButtonDropdown(config);
			});

			describe("observableArray given as config.items", function() {

				it("should throw error if value of items changed to an invalid items array", function() {
					expect(function() {
						items([
							{
								notLabelNorIconProperty: "some value"
							}
						]);
					}).toThrowError("each element of config.items has to have label and/or icon property");
				});
				
				it("should refresh options corresponding to changed items", function() {
					items([
						{
							label: "changed label",
							value: "changed value"
						},
						{
							label: "changed label2",
							value: "changed value2"
						}
					]);
					expect(vm.options()[0].label()).toBe("changed label");
					expect(vm.options()[0].value).toBe("changed value");
					expect(vm.options()[1].label()).toBe("changed label2");
					expect(vm.options()[1].value).toBe("changed value2");
					expect(vm.options().length).toBe(2);
				});

				it("should refresh selected assigning by value of option when value of items observableArray is changed, but selected value can be found in new items value also", function() {
					
					vm.options()[1].select();
					items([
						{
							label: "other label1",
							value: "other value1"
						},
						{
							label: "other label2",
							value: "other value2"
						},
						{
							label: "label3",
							value: "value2"
						},
						{
							label: "label4",
							value: "value4"
						}
					]);
					expect(vm.selected().value).toBe("value2");
					expect(vm.selected().label()).toBe("label3");
				});

				it("should refresh selected to first item if value of previously selected option can't be found in items observableArray's value", function() {
					vm.options()[1].select();
					items([
						{
							label: "some label",
							value: "some value"
						},
						{
							label: "some labe2",
							value: "some value2"
						}
					]);
					expect(vm.selected().value).toBe("some value");
					expect(vm.selected().label()).toBe("some label");
				});

			});
			
			describe("observable given as selectedIdx", function() {
				
				it("should refresh value of selectedIdx when selecting element", function() {
					vm.options()[1].select();
					expect(selectedIdx()).toBe(1);
					vm.options()[2].select();
					expect(selectedIdx()).toBe(2);
					vm.options()[0].select();
					expect(selectedIdx()).toBe(0);
				});

				it("should refresh value of selectedIdx when refreshing items", function() {
					vm.options()[1].select();
					items([
						{
							label: "other label1",
							value: "other value1"
						},
						{
							label: "other label2",
							value: "other value2"
						},
						{
							label: "other label3",
							value: "value2"
						}
					]);
					expect(selectedIdx()).toBe(2);
					items([
						{
							label: "label1",
							value: "value1"
						},
						{
							label: "label2",
							value: "notValue2"
						}
					]);
					expect(selectedIdx()).toBe(0);
				});

				it("should select item when changing selectedIdx observable's value", function() {
					selectedIdx(2);
					expect(vm.selected().value).toBe("value3");
					expect(vm.selected().label()).toBe("label3");
				});

			});

		});
		
	});
});
