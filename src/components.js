/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");

var baseVm = require("./base/vm");

var createButtonStyle;
var createButtonStyleDefault = require("./button/style");
var createButtonStyleTheme2 = require("./button/theme2");
var createButtonStyleTheme3 = require("./button/theme3");

var createInputStyle;
var createInputStyleDefault = require("./input/style");
var createInputStyleTheme2 = require("./input/theme2");
var createInputStyleTheme3 = require("./input/theme3");

var createModalStyle;
var createModalStyleDefault = require("./modal/style");
var createModalStyleTheme2 = require("./modal/theme2");
var createModalStyleTheme3 = require("./modal/theme3");

var createPagedListStyle;
var createPagedListStyleDefault = require("./pagedList/style");
var createPagedListStyleTheme2 = require("./pagedList/theme2");
var createPagedListStyleTheme3 = require("./pagedList/theme3");

var createNotificationStyle;
var createNotificationStyleDefault = require("./notificationBar/style");
var createNotificationStyleTheme2 = require("./notificationBar/style");
var createNotificationStyleTheme3 = require("./notificationBar/style");

function initKnob(config) {

	var colorSet = config.colorSet;
	var theme = config.theme;

	if (typeof theme === "object") {

		if (typeof theme.createButtonStyle !== "function") {
			throw new Error("config.theme.createButtonStyle must be a function");
		}

		if (typeof theme.createInputStyle !== "function") {
			throw new Error("config.theme.createInputStyle must be a function");
		}

		if (typeof theme.createModalStyle !== "function") {
			throw new Error("config.theme.createModalStyle must be a function");
		}

		if (typeof theme.createPagedListStyle !== "function") {
			throw new Error("config.theme.createPagedListStyle must be a function");
		}

		if (typeof theme.createNotificationStyle !== "function") {
			throw new Error("config.theme.createNotificationStyle must be a function");
		}

		createButtonStyle = theme.createButtonStyle;
		createInputStyle = theme.createInputStyle;
		createModalStyle = theme.createModalStyle;
		createPagedListStyle = theme.createPagedListStyle;
		createNotificationStyle = theme.createNotificationStyle;

	} else if (typeof theme === "string") {

		if (theme === "theme2") {
			createButtonStyle = createButtonStyleTheme2;
			createInputStyle = createInputStyleTheme2;
			createModalStyle = createModalStyleTheme2;
			createPagedListStyle = createPagedListStyleTheme2;
			createNotificationStyle = createNotificationStyleTheme2;

		} else if (theme === "theme3"){
			createButtonStyle = createButtonStyleTheme3;
			createInputStyle = createInputStyleTheme3;
			createModalStyle = createModalStyleTheme3;
			createPagedListStyle = createPagedListStyleTheme3;
			createNotificationStyle = createNotificationStyleTheme3;
		} else {
			createButtonStyle = createButtonStyleDefault;
			createInputStyle = createInputStyleDefault;
			createModalStyle = createModalStyleDefault;
			createPagedListStyle = createPagedListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		}

	} else {
		throw new Error("config.theme should be a function or a string");
	}

	var buttonStyle = createButtonStyle(colorSet);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(colorSet));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"), buttonStyle);
	registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));

	registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"), createPagedListStyle(colorSet));

	registerComponent("knob-modal", require("./modal/vm"), require("./modal/template.html"), createModalStyle(colorSet));
	registerComponent("knob-confirm", require("./modal/confirm/vm"), require("./modal/confirm/template.html"), createModalStyle(colorSet));
	registerComponent("knob-alert", require("./modal/alert/vm"), require("./modal/alert/template.html"), createModalStyle(colorSet));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"), buttonStyle);

	registerComponent("knob-notification", require("./notificationBar/vm"), require("./notificationBar/template.html"), createNotificationStyle(colorSet));
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//