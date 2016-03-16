var ko = require("knockout");
var hoverBehaviour = require("../../../src/base/behaviours/hover");
var clickBehaviour = require("../../../src/base/behaviours/click");
var focusBehaviour = require("../../../src/base/behaviours/focus");
var invalidConfig = require("./invalidConfigSpec");

describe("hover behaviour", function() {
	invalidConfig({
		behaviour: hoverBehaviour
	});
});

function describeEventHandler(config) {
	var firstEvent = config.firstEvent;
	var secondEvent = config.secondEvent;
	var label = config.label;

	var vm;
	var defaultState = "myDefaultState";

	describe(label, function() {
		beforeEach(function() {
			vm = {
				state: ko.observable(defaultState)
			};

			hoverBehaviour(vm);
			clickBehaviour(vm);
			focusBehaviour(vm);
		});

		it("interface check", function() {
			expect(ko.isObservable(vm.state)).toBe(true);
			expect(typeof vm.eventHandlers).toBe("object");
			expect(typeof vm.eventHandlers.mouseover).toBe("function");
			expect(typeof vm.eventHandlers.mouseout).toBe("function");
		});
		it("01 should set state to 'hover' on mouseover call", function() {
			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(firstEvent.setstate);
		});

		it("02 should set state to the previous state on mouseout call", function() {
			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(firstEvent.setstate);
			vm.eventHandlers[secondEvent.name]();
			expect(vm.state()).toBe(secondEvent.setstate);
		});

		it("03 should not set the state on mouseover call when the state is 'disabled' or 'active'", function() {
			vm.state(firstEvent.notsetstate);

			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(firstEvent.notsetstate);

			vm.eventHandlers[secondEvent.name]();
			expect(vm.state()).toBe(firstEvent.notsetstate);

			vm.state(secondEvent.notsetstate);

			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(secondEvent.notsetstate);

			vm.eventHandlers[secondEvent.name]();
			expect(vm.state()).toBe(secondEvent.notsetstate);
		});
	});
}

describeEventHandler({
	label: "Valid Config - hoverBehaviour",
	firstEvent: {
		name: "mouseover",
		notsetstate: "disabled",
		setstate: "hover"
	},
	secondEvent: {
		name: "mouseout",
		notsetstate: "active",
		setstate: "myDefaultState"
	}
});

describeEventHandler({
	label: "Valid Config - clickBehaviour",
	firstEvent: {
		name: "mousedown",
		notsetstate: "disabled",
		setstate: "active"
	},
	secondEvent: {
		name: "mouseup",
		notsetstate: "disabled",
		setstate: "hover"
	}
});

describeEventHandler({
	label: "Valid Config - focusBehaviour",
	firstEvent: {
		name: "focus",
		notsetstate: "disabled",
		setstate: "active"
	},
	secondEvent: {
		name: "blur",
		notsetstate: "disabled",
		setstate: "default"
	}
});
