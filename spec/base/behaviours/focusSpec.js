var focusBehaviour = require("../../../src/base/behaviours/focus");
var invalidConfig = require("./invalidConfigHelper");
var describeEventHandler = require("./behaviourHelper");

describe("Focus behaviour", function() {
	invalidConfig({
		behaviour: focusBehaviour
	});
});

describeEventHandler({
	label: "Valid Config - focusBehaviour",
	behaviour: "focus",
	firstEvent: {
		name: "focus",
		notsetState: "disabled",
		setState: "active"
	},
	secondEvent: {
		name: "blur",
		notsetState: "disabled",
		setState: "default"
	}
});