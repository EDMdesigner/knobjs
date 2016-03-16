var ko = require("knockout");
var hoverBehaviour = require("../../../src/base/behaviours/hover");
var invalidConfig = require("./invalidConfigHelper");
var describeEventHandler = require("./behaviourHelper");

describe("focus behaviour", function() {
	invalidConfig({
		behaviour: hoverBehaviour
	});
});

describeEventHandler({
	label: "Valid Config - hoverBehaviour",
	firstEvent: {
		name: "mouseover",
		notsetState: "disabled",
		setState: "hover"
	},
	secondEvent: {
		name: "mouseout",
		notsetState: "active",
		setState: "myDefaultState"
	}
});