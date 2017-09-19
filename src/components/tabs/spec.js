"use strict";

var ko = require("knockout");
var superschema = require("superschema");

var core = require("./core");

var css = jasmine.createSpy("css");

var dependencies = {
	css: css,
	ko: ko
};

function getMockedNode(name) {
	var node = {
		nodeName: name,
		getAttribute: function(attribute) {
			return attribute + "TestValue";
		},
		setAttribute: function(attribute, value) {
			node.attributes[attribute] = value;
		},
		attributes: {}
	};

	return node;
}

var config = {
	defaultTab: 1
};
var componentInfo = {
	templateNodes: [ getMockedNode("knob-tab"), getMockedNode("some-other-element"), getMockedNode("knob-tab") ]
};

var interfacePattern = {
	tabsData: {
		__type: "observable",
		__value: {
			__type: "array",
			__elements: {
				label: "observable",
				icon: "observable",
				leftIcon: "observable",
				rightIcon: "observable",
				exists: "observable boolean",
				index: "number"
			}
		}
	},
	buttonData: {
		__type: "observable",
		__value: {
			__type: "array",
			__elements: {
				label: "observable",
				icon: "observable",
				leftIcon: "observable",
				rightIcon: "observable",
				exists: "observable boolean",
				index: "number"
			}
		}
	},
	variation: "string",
	selectedIdx: "observable",
	tabsGroup: "string"
};

var createVm, vm;

describe("tabs", () => {
	describe("config and dependency check", () => {
		beforeEach(() => {
			spyOn(superschema, "check").and.callThrough();
		});

		it("checks dependencies", () => {
			core(dependencies);
			expect(superschema.check.calls.mostRecent().args[0]).toBe(dependencies);
		});

		it("checks config and componentInfo", () => {
			createVm = core(dependencies);
			superschema.check.calls.reset();
			createVm(config, componentInfo);
			expect(superschema.check.calls.argsFor(0)[0]).toBe(config);
			expect(superschema.check.calls.argsFor(1)[0]).toBe(componentInfo);
		});
	});

	describe("valid config", () => {
		beforeEach(() => {
			createVm = core(dependencies);
			vm = createVm(config, componentInfo);
		});

		it("interface check", () => {
			expect(() => {
				superschema.check(vm, interfacePattern);
			}).not.toThrow();
		});

		it("generates correct data", () => {
			expect(vm.tabsData().length).toBe(2);
			expect(vm.buttonData().length).toBe(0);
			vm.tabsData()[0].exists(true);
			expect(vm.buttonData().length).toBe(1);
			vm.tabsData()[1].exists(true);
			expect(vm.buttonData().length).toBe(2);
			vm.tabsData()[0].exists(false);
			expect(vm.buttonData().length).toBe(1);
		});

		it("generates the correct attributes", () => {
			expect(componentInfo.templateNodes[0].attributes.params).toBe("tabData: $parent.tabsData()[0],paramsTestValue");
			expect(componentInfo.templateNodes[0].attributes["data-bind"]).toBe("visible: $parent.selectedIdx() === 0,data-bindTestValue");
		});

		it("uses the default tab option if given", () => {
			vm.tabsData()[1].exists(true);
			vm.tabsData()[0].exists(true);
			expect(vm.selectedIdx()).toBe(1);
		});
	});
});
