"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var extend = require("extend");

var registerComponent = require("./knobRegisterComponent");

var baseVm = require("./base/vm");

var createButtonStyle;
var createButtonStyleDefault = require("./button/style");
var createButtonStyleChamaileon = require("./button/chamaileon");
var createButtonStyleTheme2 = require("./button/theme2");
var createButtonStyleTheme3 = require("./button/theme3");
var createButtonStyleTheme4 = require("./button/theme4");

var createInputStyle;
var createInputStyleDefault = require("./input/style");
var createInputStyleChamaileon = require("./input/chamaileon");
var createInputStyleTheme2 = require("./input/theme2");
var createInputStyleTheme3 = require("./input/theme3");
var createInputStyleTheme4 = require("./input/theme4");

var createFluidRowStyle;
var createFluidRowStyleDefault = require("./fluidRow/style");
var createFluidRowStyleChamaileon = require("./fluidRow/chamaileon");

var createModalStyle;
var createModalStyleChamaileon = require("./modal/chamaileon");
var createModalStyleDefault = require("./modal/style");
var createModalStyleTheme2 = require("./modal/theme2");
var createModalStyleTheme3 = require("./modal/theme3");
var createModalStyleTheme4 = require("./modal/theme4");

var createPagedListStyle;
var createPagedListStyleDefault = require("./pagedList/style");
var createPagedListStyleTheme2 = require("./pagedList/theme2");
var createPagedListStyleTheme3 = require("./pagedList/theme3");
var createPagedListStyleTheme4 = require("./pagedList/theme4");

var createNotificationStyle;
var createNotificationStyleDefault = require("./notificationBar/style");
var createNotificationStyleTheme2 = require("./notificationBar/theme2");
var createNotificationStyleTheme3 = require("./notificationBar/theme3");
var createNotificationStyleTheme4 = require("./notificationBar/theme4");

var createCheckboxStyle;
var createCheckboxStyleDefault = require("./checkbox/style");

function initKnob(config) {
	var defaultIcons = {
		search: "#icon-search",
		sort: {
			asc: "#icon-sort-asc",
			desc: "#icon-sort-desc"
		},
		dropdown: "#icon-expand-more",
		loading: "#icon-loading",
		pagination: {
			first: "#icon-first-page",
			prev: "#icon-chevron-left",
			last: "#icon-last-page",
			next: "#icon-chevron-right"
		},
		tick: "#icon-check",
		cross: "#icon-close",
		numericInput:{
			increase: "#icon-arrow-downward",
			decrease: "#icon-arrow-upward"
		}
	};

	var defaultLabels = {
		noResults: "No results"
	};


	var colorSet = config.colorSet;
	var theme = config.theme;

	var icons = extend(true, {}, defaultIcons, config.icons);
	var labels = extend(true, {}, defaultLabels, config.labels);

	if (typeof theme === "object" && theme !== null) {

		if (typeof theme.createButtonStyle !== "function") {
			throw new Error("config.theme.createButtonStyle must be a function");
		}

		if (typeof theme.createInputStyle !== "function") {
			throw new Error("config.theme.createInputStyle must be a function");
		}

		if (typeof theme.createFluidRowStyle !== "function") {
			throw new Error("config.theme.createFluidRowStyle must be a function");
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

		if (typeof theme.createCheckboxStyle !== "function") {
			throw new Error("config.theme.createCheckboxStyle must be a function");
		}

		createButtonStyle = theme.createButtonStyle;
		createInputStyle = theme.createInputStyle;
		createFluidRowStyle = theme.createFluidRowStyle;
		createModalStyle = theme.createModalStyle;
		createPagedListStyle = theme.createPagedListStyle;
		createNotificationStyle = theme.createNotificationStyle;
		checkboxStyle = theme.createCheckboxStyle;

	} else if (typeof theme === "string") {
		
		if (theme === "chamaileon") {
			createButtonStyle = createButtonStyleChamaileon;
			createInputStyle = createInputStyleChamaileon;
			createFluidRowStyle = createFluidRowStyleChamaileon;
			createModalStyle = createModalStyleChamaileon;
			createPagedListStyle = createPagedListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		} else if (theme === "theme2") {
			createButtonStyle = createButtonStyleTheme2;
			createInputStyle = createInputStyleTheme2;
			createFluidRowStyle = createFluidRowStyleDefault;
			createModalStyle = createModalStyleTheme2;
			createPagedListStyle = createPagedListStyleTheme2;
			createNotificationStyle = createNotificationStyleTheme2;

		} else if (theme === "theme3"){
			createButtonStyle = createButtonStyleTheme3;
			createInputStyle = createInputStyleTheme3;
			createFluidRowStyle = createFluidRowStyleDefault;
			createModalStyle = createModalStyleTheme3;
			createPagedListStyle = createPagedListStyleTheme3;
			createNotificationStyle = createNotificationStyleTheme3;
		} else if (theme === "theme4") {
			createButtonStyle = createButtonStyleTheme4;
			createInputStyle = createInputStyleTheme4;
			createFluidRowStyle = createFluidRowStyleDefault;
			createModalStyle = createModalStyleTheme4;
			createPagedListStyle = createPagedListStyleTheme4;
			createNotificationStyle = createNotificationStyleTheme4;
		} else {
			createButtonStyle = createButtonStyleDefault;
			createInputStyle = createInputStyleDefault;
			createFluidRowStyle = createFluidRowStyleDefault;
			createModalStyle = createModalStyleDefault;
			createPagedListStyle = createPagedListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		}
		createCheckboxStyle = createCheckboxStyleDefault;

	} else {
		throw new Error("config.theme should be an object or a string");
	}

	var buttonStyle = createButtonStyle(colorSet);
	var checkboxStyle = createCheckboxStyle(colorSet);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(colorSet));
	registerComponent("knob-textarea", require("./textarea/vm"), require("./textarea/template.html"), createInputStyle(colorSet));
	registerComponent("knob-fluid-row", require("./fluidRow/vm"), require("./fluidRow/template.html"), createFluidRowStyle(colorSet));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent(
		"knob-pagination",
		require("./pagination/vm"),
		require("./pagination/template.html"),
		buttonStyle,
		icons.pagination
	);
	registerComponent(
		"knob-items-per-page",
		require("./itemsPerPage/vm"),
		require("./itemsPerPage/template.html"),
		null,
		{
			dropdown: icons.dropdown
		}
	);

	registerComponent(
		"knob-paged-list",
		require("./pagedList/vm"),
		require("./pagedList/template.html"),
		createPagedListStyle(colorSet),
		{
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		{
			noResults: labels.noResults
		}
	);

	registerComponent("knob-modal", require("./modal/vm"), require("./modal/template.html"), createModalStyle(colorSet));
	registerComponent("knob-confirm", require("./modal/confirm/vm"), require("./modal/confirm/template.html"), createModalStyle(colorSet));
	registerComponent("knob-alert", require("./modal/alert/vm"), require("./modal/alert/template.html"), createModalStyle(colorSet));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"), buttonStyle);

	registerComponent("knob-notification", require("./notificationBar/vm"), require("./notificationBar/template.html"), createNotificationStyle(colorSet));
	registerComponent(
		"knob-checkbox",
		require("./checkbox/vm"),
		require("./checkbox/template.html"),
		checkboxStyle,
		{
			tick: icons.tick,
			cross: icons.cross
		}
	);
	registerComponent(
		"knob-numericinput", 
		require("./numericInput/vm"),
		require("./numericInput/template.html"),
		null,
		icons.numericInput
	);
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//