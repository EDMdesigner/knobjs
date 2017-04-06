"use strict";

module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;

	return function createInputWithEditButton(config) {

		if(!config) {
			throw new Error("Config is mandatory!");
		}

		if(!ko.isObservable(config.value)|| typeof config.value() !== "string") {
			throw new Error("config.value is mandatory and it should store a string");
		}

		var labels = config.labels || {};

		var icons = config.icons || {};

		var editMode = ko.observable(false);
		var originalValue = config.value;
		var editedValue = ko.observable(originalValue());

		function toggleEditMode () {
			editMode(!editMode());
		}

		function save () {
			console.log("save");
			originalValue(editedValue());
			toggleEditMode();
		}

		function cancel () {
			console.log("cancel");
			editedValue(originalValue());
			toggleEditMode();
		}

		return {
			value: editedValue,
			originalValue: originalValue,
			editMode: editMode,

			toggleEditMode: toggleEditMode,
			save: save,
			cancel: cancel,

			icons: icons,
			labels: labels
		};
	};
};
