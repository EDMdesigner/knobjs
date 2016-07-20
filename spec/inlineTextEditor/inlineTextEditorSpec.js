var ko = require("knockout");
var createInlineTextEditor = require("../../src/inlineTextEditor/vm");

describe("Invalid config", function() {
	it("config.value has to be an observable!", function() {
		expect(function() {
			createInlineTextEditor({
				value: 2,
				icons: {
					edit: "icon",
					done: "icon",
					close: "icon"
				}
			});
		}).toThrowError("config.value has to be an observable!");
	});

	it("config.icons missing", function() {
		expect(function() {
			createInlineTextEditor({
				value: ko.observable(null)
			});
		}).toThrowError("config.icons is mandatory!");
	});

	it("config.icons.edit missing", function() {
		expect(function() {
			createInlineTextEditor({
				value: ko.observable(null),
				icons: {
					done: "icon",
					close: "icon"
				}
			});
		}).toThrowError("config.icons.edit is mandatory!");
	});

	it("config.icons.done missing", function() {
		expect(function() {
			createInlineTextEditor({
				value: ko.observable(null),
				icons: {
					edit: "icon",
					close: "icon"
				}
			});
		}).toThrowError("config.icons.done is mandatory!");
	});

	it("config.icons.close missing", function() {
		expect(function() {
			createInlineTextEditor({
				value: ko.observable(null),
				icons: {
					edit: "icon",
					done: "icon"
				}
			});
		}).toThrowError("config.icons.close is mandatory!");
	});
});

describe("Valid config", function() {
	it("Interface", function() {
		var te = createInlineTextEditor({
			icons: {
					edit: "icon",
					done: "icon",
					close: "icon"
				}
		});

		//Types
		expect(ko.isObservable(te.value)).toBe(true);
		expect(ko.isObservable(te.editedValue)).toBe(true);
		expect(ko.isObservable(te.editMode)).toBe(true);
		expect(ko.isObservable(te.inputHasFocus)).toBe(true);
		expect(typeof te.edit).toBe("function");
		expect(typeof te.save).toBe("function");
		expect(typeof te.cancel).toBe("function");
		expect(typeof te.keyDown).toBe("function");

		// Values
		expect(te.value()).toBe("");
		expect(te.editedValue()).toBe("");
		expect(te.editMode()).toBe(false);
		expect(te.inputHasFocus()).toBe(false);
	});

	it("config.value set", function() {
		var value = ko.observable(2);
		var te = createInlineTextEditor({
			value: value,
			icons: {
					edit: "icon",
					done: "icon",
					close: "icon"
			}
		});

		expect(te.value()).toBe(value());
		expect(te.editedValue()).toBe(value());
	});

	describe("Behaviour", function() {

		var te;
		var editedValue = "bunny";

		beforeEach(function() {
			te = createInlineTextEditor({	
				icons: {
					edit: "icon",
					done: "icon",
					close: "icon"
				}
			});
		});

		it("edit", function() {
			te.edit();
			expect(te.editedValue()).toBe(te.value());
			expect(te.editMode()).toBe(true);
			expect(te.inputHasFocus()).toBe(true);
		});

		it("save", function() {
			te.editedValue(editedValue);
			te.save();
			expect(te.value()).toBe(te.editedValue());
			expect(te.editMode()).toBe(false);
		});

		it("cancel", function() {
			te.editedValue(editedValue);
			te.cancel();
			expect(te.editMode()).toBe(false);
		});

		it("Esc", function() {
			spyOn(te, "save");
			te.keyDown(null, {
				keyCode: 13
			});
			expect(te.save).toHaveBeenCalled();
		});

		it("Enter", function() {
			spyOn(te, "cancel");

			te.keyDown(null, {
				keyCode: 27
			});

			expect(te.cancel).toHaveBeenCalled();
		});
	});

});

