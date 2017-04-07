var ko = require("knockout");
var createButtonCore = require("../../src/dropdown/core.js");
var createButtonDropdown = createButtonCore({ ko: ko});
var window;

describe(" === Dropdown === ", function() {
	beforeEach(function() {		
		window = {
			addEventListener: function(event, callback) {
				window[event] = callback;
			},
			removeEventListener: function(event) {
				window[event] = undefined;
			}
		};
	});

	afterEach(function() {
		window.click = undefined;
	});

	describe(" - with invalid config", function() {
		it("throws error if dependencies is missing", function() {
			expect(createButtonCore).toThrowError("dependencies is mandatory!");
		});

		it("throws error if dependencies.ko is missing", function() {
			var f = function() {
				createButtonCore({});
			};
			expect(f).toThrowError("dependencies.ko is mandatory!");
		});

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
			var f = function() {
				createButtonDropdown({
					rightIcon: "random",
					items: "notArrayNorObservableArray",
					selected: ko.observable()
				});
			};
			expect(f).toThrowError("config.items should be an array or an observableArray!");
		});

		it("should throw error if config.items is empty array or is an empty observableArray", function() {
			var f = function() {
				createButtonDropdown({
					rightIcon: "random",
					items: [],
					selected: ko.observable()
				});
			};
			expect(f).toThrowError("config.items should not be empty!");

			var f2 = function() {
				createButtonDropdown({
					rightIcon: "random",
					items: ko.observableArray([]),
					selected: ko.observable()
				});
			};
			expect(f2).toThrowError("The value of config.items should not be empty!");
		});

		it("should throw error if config.items has an element which doesn't have label and/or icon property", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "random",
					items: [
						{
							value: "x"
						}
					],
					selected: ko.observable()
				});
			}).toThrowError("Each element of config.items has to have label and/or icon property!");
		});

		it("should throw error if an item has no value prop", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "stuff",
					valueField: "key",
					items: [{
						label: "label",
						value: "definedButOtherFieldConfigured"
					}]
				});
			}).toThrowError("Each element of config.items has to have a value property!");
		});

		it("should throw error if config.selectedIdx doesn't store a number", function() {
			expect(function() {
				createButtonDropdown({
					rightIcon: "x",
					items: [{ label: "y", value: "z" }],
					selectedIdx: "not nearly a number"
				});
			}).toThrowError("config.selectedIdx has to be an observable or a number!");
		});
	});

	describe(" - with valid config", function() {
		var vm;
		var config;
		beforeEach(function() {
			config = {
				rightIcon: "random",
				items: [
					{
						label: "randomLabel1",
						value: "value1"
					},
					{
						icon: "randomIcon1",
						value: "value2"
					},
					{
						label: "randomLabel2",
						icon: "randomIcon2",
						value: "value3"
					}
				],
				window: {
					addEventListener: function(event, callback) {
						window[event] = callback;
					},
					removeEventListener: function(event) {
						window[event] = undefined;
					}
				}
			};
			vm = createButtonDropdown(config);
		});

		describe(" simple functions", function() {

			it("toggleDropdownVisible true or false", function() {
				expect(vm.dropdownVisible()).toBe(false);
				vm.dropdownVisible.toggle();
				expect(vm.dropdownVisible()).toBe(true);
				vm.dropdownVisible.toggle();
				expect(vm.dropdownVisible()).toBe(false);
			});

			it("should be set right icon and/or label when selected", function() {
				expect(vm.selected().label()).toBe("randomLabel1");

				vm.options()[1].select();
				expect(vm.selected().icon()).toBe("randomIcon1");

				vm.options()[2].select();
				expect(vm.selected().label()).toBe("randomLabel2");
				expect(vm.selected().icon()).toBe("randomIcon2");
			});
		});

		describe("correct initialization", function() {

			it ("selects item correctly by index", function() {
				config.selectedIdx = 2;
				vm = createButtonDropdown(config);
				expect(vm.selected().label()).toBe("randomLabel2");
			});

			it ("selects item correctly by observable index", function() {
				config.selectedIdx = ko.observable(1);
				vm = createButtonDropdown(config);
				expect(vm.selected().icon()).toBe("randomIcon1");
			});

			it ("select first item if index is out of range", function() {
				config.selectedIdx = 666;
				vm = createButtonDropdown(config);
				expect(vm.selected().label()).toBe("randomLabel1");
			});

			it ("selects item correctly by value", function() {
				config.selectedValue = "value3";
				vm = createButtonDropdown(config);
				expect(vm.selected().label()).toBe("randomLabel2");
			});

			it ("selects item correctly by observable value", function() {
				config.selectedValue = ko.observable("value2");
				vm = createButtonDropdown(config);
				expect(vm.selected().icon()).toBe("randomIcon1");
			});

			it ("select first item if value cannot be found", function() {
				config.selectedValue = "some beautiful, but tragically unfindable value";
				vm = createButtonDropdown(config);
				expect(vm.selected().label()).toBe("randomLabel1");
			});
		});

		describe("observable parameters", function() {

			var items;
			var selectedIdx;
			var selectedValue;
			var selected;

			beforeEach(function() {
				items = ko.observableArray([]);
				selectedIdx = ko.observable(0);
				selectedValue = ko.observable();
				selected = ko.observable();
				items([
					{
						label: "label1",
						key: "value1"
					},
					{
						label: "label2",
						key: "value2"
					},
					{
						label: "label3",
						key: "value3"
					}
				]);
				config.items = items;
				config.selectedIdx = selectedIdx;
				config.selectedValue = selectedValue;
				config.selected = selected;
				config.valueField = "key";
				config.window = {
					addEventListener: function(event, callback) {
						window[event] = callback;
					},
					removeEventListener: function(event) {
						window[event] = undefined;
					}
				};
				vm = createButtonDropdown(config);
			});

			describe("observableArray given as config.items", function() {

				it("should throw error if value of items changed to an invalid items array", function() {
					expect(function() {
						items([
							{
								notLabelNorIconProperty: "some value",
								key: "x"
							}
						]);
					}).toThrowError("Each element of config.items has to have label and/or icon property!");

					expect(function() {
						items([
							{
								label: "some value",
								notKey: "x"
							}
						]);
					}).toThrowError("Each element of config.items has to have a value property!");
				});
				
				it("should refresh options corresponding to changed items", function() {
					items([
						{
							label: "changed label",
							key: "changed value"
						},
						{
							label: "changed label2",
							key: "changed value2"
						}
					]);
					expect(vm.options()[0].label()).toBe("changed label");
					expect(vm.options()[0].value).toBe("changed value");
					expect(vm.options()[1].label()).toBe("changed label2");
					expect(vm.options()[1].value).toBe("changed value2");
					expect(vm.options().length).toBe(2);
				});

				it("should refresh selected and selectedIdx assigning by value of option when value of items observableArray is changed, but selected value can be found in new items value also", function() {
					
					vm.options()[1].select();
					items([
						{
							label: "other label1",
							key: "other value1"
						},
						{
							label: "other label2",
							key: "other value2"
						},
						{
							label: "label3",
							key: "value2"
						},
						{
							label: "label4",
							key: "value4"
						}
					]);
					expect(vm.selected().value).toBe("value2");
					expect(vm.selected().label()).toBe("label3");
					expect(selectedIdx()).toBe(2);
				});

				it("should refresh selected to first item if value of previously selected option can't be found in items observableArray's value", function() {
					vm.options()[1].select();
					items([
						{
							label: "some label",
							key: "some value"
						},
						{
							label: "some label2",
							key: "some value2"
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
							key: "other value1"
						},
						{
							label: "other label2",
							key: "other value2"
						},
						{
							label: "other label3",
							key: "value2"
						}
					]);
					expect(selectedIdx()).toBe(2);
					items([
						{
							label: "label1",
							key: "value1"
						},
						{
							label: "label2",
							key: "notValue2"
						}
					]);
					expect(selectedIdx()).toBe(0);
				});

				it("should select item when changing selectedIdx observable's value", function() {
					selectedIdx(2);
					expect(vm.selected().value).toBe("value3");
					expect(vm.selected().label()).toBe("label3");
				});

				it("should select element at index 0 when selectedIdx is changed to index out of range", function() {
					selectedIdx(2);
					selectedIdx(10);
					expect(selectedIdx()).toBe(0);
					expect(vm.selected().value).toBe("value1");
					expect(vm.selected().label()).toBe("label1");
					selectedIdx(-1);
					expect(selectedIdx()).toBe(0);
					expect(vm.selected().value).toBe("value1");
					expect(vm.selected().label()).toBe("label1");
				});

			});
			
			describe("observable given as selectedValue", function() {
				
				it("should refresh value of selectedValue when selecting element", function() {
					vm.options()[1].select();
					expect(selectedValue()).toBe("value2");
					vm.options()[2].select();
					expect(selectedValue()).toBe("value3");
					vm.options()[0].select();
					expect(selectedValue()).toBe("value1");
				});

				it("should refresh value of selectedIdx when refreshing items", function() {
					vm.options()[1].select();
					items([
						{
							label: "other label1",
							key: "other value1"
						},
						{
							label: "other label2",
							key: "other value2"
						},
						{
							label: "other label3",
							key: "value2"
						}
					]);
					expect(selectedValue()).toBe("value2");
					items([
						{
							label: "label1",
							key: "value1"
						},
						{
							label: "label2",
							key: "notValue2"
						}
					]);
					expect(selectedValue()).toBe("value1");
				});

				it("should select item when changing selectedValue observable's value", function() {
					selectedValue("value3");
					expect(vm.selected().idx).toBe(2);
					expect(vm.selected().label()).toBe("label3");
				});

				it("should select element at index 0 when selectedValue is changed to a value not present", function() {
					selectedIdx(2);
					selectedValue("some sad little value not present right now");
					expect(selectedIdx()).toBe(0);
					expect(selectedValue()).toBe("value1");
					expect(vm.selected().value).toBe("value1");
					expect(vm.selected().label()).toBe("label1");
				});

			});

		});
		
	});
});
