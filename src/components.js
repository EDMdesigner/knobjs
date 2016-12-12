"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var extend = require("extend");

var registerComponent = require("./knobRegisterComponent");

var baseVm = require("./base/vm");

var createButtonStyle;
var createButtonStyleDefault = require("./button/style");
var createButtonStyleChamaileon = require("./button/chamaileon");

var createInputStyle;
var createInputStyleDefault = require("./input/style");
var createInputStyleChamaileon = require("./input/chamaileon");

var createToggleSwitchStyle;
var createToggleSwitchStyleDefault = require("./toggleSwitch/style");

var createModalStyle;
var createModalStyleChamaileon = require("./modal/chamaileon");
var createModalStyleDefault = require("./modal/style");

var createPagedListStyle;
var createPagedListStyleDefault = require("./pagedList/style");

var createNotificationStyle;
var createNotificationStyleDefault = require("./notificationBar/style");

var createCheckboxStyle;
var createCheckboxStyleDefault = require("./checkbox/style");

var createTabStyle;
var createTabStyleDefault = require("./tabs/tab/style");

function initKnob(config) {
	if (!config) {
		config = {};
	}

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
			increase: "#icon-arrow-upward",
			decrease: "#icon-arrow-downward"
		},
		inlineTextEditor: {
			edit: "#icon-edit",
			done: "#icon-done",
			close: "#icon-close"
		}
	};

	var defaultLabels = {
		noResults: "No results"
	};


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

		if (typeof theme.createToggleSwitchStyle !== "function") {
			throw new Error("config.theme.createToggleSwitchStyle must be a function");
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

		if (typeof theme.createTabStyle !== "function") {
			throw new Error("config.theme.createTabStyle must be a function");
		}

		createButtonStyle = theme.createButtonStyle;
		createInputStyle = theme.createInputStyle;
		createToggleSwitchStyle = theme.createToggleSwitchStyle;
		createModalStyle = theme.createModalStyle;
		createPagedListStyle = theme.createPagedListStyle;
		createNotificationStyle = theme.createNotificationStyle;
		createCheckboxStyle = theme.createCheckboxStyle;
		createTabStyle = theme.createTabStyle;

	} else if (typeof theme === "string") {
		
		if (theme === "chamaileon") {
			createButtonStyle = createButtonStyleChamaileon;
			createInputStyle = createInputStyleChamaileon;
			createToggleSwitchStyle = createToggleSwitchStyleDefault;
			createModalStyle = createModalStyleChamaileon;
			createPagedListStyle = createPagedListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		} else {
			createButtonStyle = createButtonStyleDefault;
			createInputStyle = createInputStyleDefault;
			createToggleSwitchStyle = createToggleSwitchStyleDefault;
			createModalStyle = createModalStyleDefault;
			createPagedListStyle = createPagedListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		}
		createCheckboxStyle = createCheckboxStyleDefault;
		createTabStyle = createTabStyleDefault;

	} else {
		throw new Error("config.theme should be an object or a string");
	}

	var buttonStyle = createButtonStyle(config);
	var checkboxStyle = createCheckboxStyle(config.colors);
	var tabStyle = createTabStyle(config);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(config.colors));
	registerComponent("knob-textarea", require("./textarea/vm"), require("./textarea/template.html"), createInputStyle(config.colors));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent(
		"knob-inline-text-editor",
		 require("./inlineTextEditor/vm"),
		 require("./inlineTextEditor/template.html"),
		 null,
		 icons.inlineTextEditor
		);
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
		createPagedListStyle(config.colors),
		{
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		{
			noResults: labels.noResults
		}
	);

	registerComponent("knob-toggleswitch", require("./toggleSwitch/vm"), require("./toggleSwitch/template.html"), createToggleSwitchStyle(config.colors));
	registerComponent("knob-modal", require("./modal/vm"), require("./modal/template.html"), createModalStyle(config.colors));
	registerComponent("knob-confirm", require("./modal/confirm/vm"), require("./modal/confirm/template.html"), createModalStyle(config.colors));
	registerComponent("knob-alert", require("./modal/alert/vm"), require("./modal/alert/template.html"), createModalStyle(config.colors));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"), tabStyle);

	registerComponent("knob-notification", require("./notificationBar/vm"), require("./notificationBar/template.html"), createNotificationStyle(config.colors));
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

	if (config.background) {
		document.body.style.backgroundColor = config.background;
	}
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//