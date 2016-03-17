var ko = require("knockout");
var createButtonDropdown = require("../../src/dropdown/vm");

describe(" === Dropdown === ", function() {
	describe("with invalid config", {
		expect(createButtonDropdown).toThrowError("config.rightIcon is mandatory!");
	});
});