var createTabs = require("./vm");
var ko = require("knockout");

describe("tabs", function() {
	describe("with invalid config", function() {
		it("should not work without child knob-tab components", function() {
			expect(createTabs).toThrowError("knob-tabs component should have at least one knob-tab component as a child component!");
		});

		it("should not work if the knob-tab child components don't have the proper params", function() {
			var componentInfo = {
				templateNodes: [
					{
						nodeName: "TEXT"
					},
					{
						nodeName: "KNOB-TAB",
						getAttribute: function() {
							return "";
						}
					}
				]
			};

			expect(function() {
				createTabs({}, componentInfo);
			}).toThrowError("The child knob-tab components should have proper params (icon and/or label) just like with buttons!");
		});

		it("should not work if the knob-tab child components don't have the proper params", function() {
			var componentInfo = {
				templateNodes: [
					{
						nodeName: "KNOB-TAB",
						getAttribute: function() {
							return "label: 'myTestLabel', iconRight: '#abcd'";
						}
					},
					{
						nodeName: "KNOB-TAB",
						getAttribute: function() {
							return "label: 'myTestLabel'";
						}
					},
					{
						nodeName: "TEXT"
					},
					{
						nodeName: "KNOB-TAB",
						getAttribute: function() {
							return "icon: '#xyz'";
						}
					},
					{
						nodeName: "KNOB-TAB",
						getAttribute: function() {
							return "";
						}
					}
				]
			};

			expect(function() {
				createTabs({}, componentInfo);
			}).toThrowError("The child knob-tab components should have proper params (icon and/or label) just like with buttons!");
		});
	});

	describe("with valid config", function() {
		var componentInfo = {
			templateNodes: [
				{
					nodeName: "KNOB-TAB",
					getAttribute: function() {
						return "label: 'myTestLabel', rightIcon: '#abcd'";
					},
					childNodes: []
				},
				{
					nodeName: "KNOB-TAB",
					getAttribute: function() {
						return "label: 'myTestLabel'";
					},
					childNodes: []
				},
				{
					nodeName: "TEXT"
				},
				{
					nodeName: "KNOB-TAB",
					getAttribute: function() {
						return "icon: '#xyz'";
					},
					childNodes: []
				},
				{
					nodeName: "KNOB-TAB",
					getAttribute: function() {
						return "leftIcon: '#cdayo'";
					},
					childNodes: []
				}
			]
		};

		var vm = createTabs({
			defaultTab: 1
		}, componentInfo);

		it("should have four elements in the buttons and in the panels array as well", function() {
			expect(vm.buttons.length).toBe(4);
			expect(vm.panels.length).toBe(4);
		});

		it("value of the selected index observable should equal to the defaultTab config value", function() {
			expect(vm.selectedIdx()).toBe(1);
		});

		it("should have a tabsGroup property, which is a string", function() {
			expect(typeof vm.tabsGroup).toBe("string");
		});

		it("the panels content should be the childNodes of the knob-tab elements", function() {
			expect(vm.panels[0]).toBe(componentInfo.templateNodes[0].childNodes);
			expect(vm.panels[1]).toBe(componentInfo.templateNodes[1].childNodes);
			expect(vm.panels[2]).toBe(componentInfo.templateNodes[3].childNodes);
			expect(vm.panels[3]).toBe(componentInfo.templateNodes[4].childNodes);
		});

		it("the buttons config should come from the component nodes", function() {
			function checkButtonProps(propsToCheck, config) {
				var icon = config.icon;
				var leftIcon = config.leftIcon;
				var rightIcon = config.rightIcon;
				var label = config.label;

				expect(typeof propsToCheck).toBe("object");
				expect(propsToCheck).not.toBeNull();

				if (icon) {
					expect(propsToCheck.icon).toBe(icon);
				} else {
					expect(propsToCheck.icon).not.toBeDefined();
				}

				if (leftIcon) {
					expect(propsToCheck.leftIcon).toBe(leftIcon);
				} else {
					expect(propsToCheck.leftIcon).not.toBeDefined();
				}

				if (rightIcon) {
					expect(propsToCheck.rightIcon).toBe(rightIcon);
				} else {
					expect(propsToCheck.rightIcon).not.toBeDefined();
				}

				if (label) {
					expect(propsToCheck.label).toBe(label);
				} else {
					expect(propsToCheck.label).not.toBeDefined();
				}
			}

			checkButtonProps(vm.buttons[0], {
				label: "myTestLabel",
				rightIcon: "#abcd"
			});

			checkButtonProps(vm.buttons[1], {
				label: "myTestLabel"
			});

			checkButtonProps(vm.buttons[2], {
				icon: "#xyz"
			});

			checkButtonProps(vm.buttons[3], {
				leftIcon: "#cdayo"
			});
		});

		it("should use given selectedIdx", function() {
			var vm = createTabs({
				selectedIdx: ko.observable(2)
			}, componentInfo);

			expect(vm.selectedIdx()).toBe(2);
		});

		it("should use given defaultTab over given selectedIdx", function() {
			var vm = createTabs({
				defaultTab: 1,
				selectedIdx: ko.observable(2)
			}, componentInfo);

			expect(vm.selectedIdx()).toBe(1);
		});

		it("should pass given config.variation", function() {
			var vm = createTabs({
				variation: "tab-transparent"
			}, componentInfo);

			expect(vm.variation).toBe("tab-transparent");
		});

		it("should use default tab variation if no config.variation is given", function() {
			var vm = createTabs({}, componentInfo);

			expect(vm.variation).toBe("tab");
		});

	});
});
