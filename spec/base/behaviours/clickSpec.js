var ko = require("knockout");
var clickBehaviour = require("../../../src/base/behaviours/click");
var invalidConfig = require("./invalidConfigHelper");
var describeEventHandler = require("./behaviourHelper");

describe("Click behaviour", function() {
	invalidConfig({
		behaviour: clickBehaviour
	});
});

describeEventHandler({
	label: "Valid Config - clickBehaviour",
	firstEvent: {
		name: "mousedown",
		notsetState: "disabled",
		setState: "active"
	},
	secondEvent: {
		name: "mouseup",
		notsetState: "disabled",
		setState: "hover"
	}
});
