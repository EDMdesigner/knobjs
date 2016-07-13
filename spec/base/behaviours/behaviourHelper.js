var ko = require("knockout");
//var hoverBehaviour = require("../../../src/base/behaviours/hover");
//var clickBehaviour = require("../../../src/base/behaviours/click");
//var selectBehaviour = require("../../../src/base/behaviours/select");
//var focusBehaviour = require("../../../src/base/behaviours/focus");

//buttonSpec and checkBoxSpec uses this file only, if those are modified in
//in the required way this file can be removed

function describeEventHandler(config) {
	var firstEvent = config.firstEvent;
	var secondEvent = config.secondEvent;
	var label = config.label;
	var behaviour = config.behaviour;
	var configVm = config.vm;
	var vm;

	var defaultState = "myDefaultState";

	describe(label, function() {
		beforeEach(function() {
			vm = configVm || {};
			vm.state = ko.observable(defaultState);

			if (!configVm) {
				switch (behaviour) {
					case "click": {
						//clickBehaviour(vm);
						break;
					}
					case "select": {
						//selectBehaviour(vm);
						break;
					}
					case "hover": {
						//hoverBehaviour(vm);
						break;
					}
					case "focus": {
						//focusBehaviour(vm);
						break;
					}
					default: {
						return console.log("unrecognised behaviour");
					}
				}
			}
		});

		it("interface check", function() {
			expect(ko.isObservable(vm.state)).toBe(true);
			expect(typeof vm.eventHandlers).toBe("object");
		});

		it("should set state to" + firstEvent.setState + "on " + firstEvent.name + " call", function() {
			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(firstEvent.setState);
		});

		it("should set state to the previous state on mouseout call", function() {
			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(firstEvent.setState);
			vm.eventHandlers[secondEvent.name]();
			expect(vm.state()).toBe(secondEvent.setState);
		});

		it("should not set the state on mouseover call when the state is 'disabled' or 'active'", function() {
			vm.state(firstEvent.notsetState);

			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(firstEvent.notsetState);

			vm.eventHandlers[secondEvent.name]();
			expect(vm.state()).toBe(firstEvent.notsetState);

			vm.state(secondEvent.notsetState);

			vm.eventHandlers[firstEvent.name]();
			expect(vm.state()).toBe(secondEvent.notsetState);

			vm.eventHandlers[secondEvent.name]();
			expect(vm.state()).toBe(secondEvent.notsetState);
		});
	});
}

module.exports = describeEventHandler;