/*jslint node: true */
"use strict";

var ko = require("knockout");

function createInlineTextEditor(config) {
	var vm = {};

	var config = config || {};

	if(config.hasOwnProperty("value") && !ko.isObservable(config.value)) {
		throw new Error("config.value has to be an observable!");
	}

	if(config.hasOwnProperty("editMode") && !ko.isObservable(config.editMode)) {
		throw new Error("config.editMode has to be an observable!");
	}

	if(!config.icons) {
		throw new Error("config.icons is mandatory!");
	}

	if(!config.icons.edit) {
		throw new Error("config.icons.edit is mandatory!");
	}

	if(!config.icons.done) {
		throw new Error("config.icons.done is mandatory!");
	}

	if(!config.icons.close) {
		throw new Error("config.icons.close is mandatory!");
	}

	vm.icons = config.icons;

	vm.value = config.value || ko.observable("");
	vm.editedValue = ko.observable(vm.value());

	vm.editMode = config.ediMode || ko.observable(false);

	vm.edit = function() {
		vm.editedValue(vm.value());
		vm.editMode(true);
		vm.inputHasFocus(true);
	};

	vm.save = function() {
		vm.value(vm.editedValue());
		vm.editMode(false);
	};

	vm.cancel = function() {
		vm.editMode(false);
	};

	vm.keyDown = function(item, event) {
		if (event.keyCode === 13) {
			return vm.save();
		}

		if (event.keyCode === 27) {
			return vm.cancel();
		}
		return true;
	};

	vm.inputHasFocus = ko.observable(false);

	return vm;
}

module.exports = createInlineTextEditor;
