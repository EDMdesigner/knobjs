var ko = require("knockout");
var createButtonDropdown = require("../../src/dropdown/vm");

describe(" === Dropdown === ", function() {
	describe(" - with invalid config", function() {

		it("rightIcon", function() {
			expect(createButtonDropdown).toThrowError("config.rightIcon element is mandatory!");
		});

		it("items", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random"
				});
			}).toThrowError("config.items element is mandatory!");
		});

		it("selected", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					selected: "notAnObservable",
					items: []
				});
			}).toThrowError("config.selected has to be a knockout observable!");
		});

		it("config.items.length", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					items: [],
					selected: ko.observable()
				}).toThrowError("config.items should not be empty");
			});
		});

		it("config.items", function() {
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
	});
});
