"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var extend = require("extend");
var ko = require("knockout");
var superschema = require("superschema");

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

var createSelectablePagedListStyle;
var createSelectablePagedListStyleDefault = require("./selectablePagedList/style");

var createInfiniteListStyle;
var createInfiniteListStyleDefault = require("./infiniteList/style");

var createNotificationStyle;
var createNotificationStyleDefault = require("./notificationBar/style");

var createCheckboxStyle;
var createCheckboxStyleDefault = require("./checkbox/style");

var createTabStyle;
var createTabStyleDefault = require("./tabs/tab/style");

superschema.extend({
	ko: ko
});

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

		if (typeof theme.createSelectablePagedListStyle !== "function") {
			throw new Error("config.theme.createSelectablePagedListStyle must be a function");
		}

		if (typeof theme.createInfiniteListStyle !== "function") {
			throw new Error("config.theme.createInfiniteListStyle must be a function");
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
		createSelectablePagedListStyle = theme.createSelectablePagedListStyle;
		createInfiniteListStyle = theme.createInfiniteListStyle;
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
			createSelectablePagedListStyle = createSelectablePagedListStyleDefault;
			createInfiniteListStyle = createInfiniteListStyleDefault;
			createNotificationStyle = createNotificationStyleDefault;
		} else {
			createButtonStyle = createButtonStyleDefault;
			createInputStyle = createInputStyleDefault;
			createToggleSwitchStyle = createToggleSwitchStyleDefault;
			createModalStyle = createModalStyleDefault;
			createPagedListStyle = createPagedListStyleDefault;
			createSelectablePagedListStyle = createSelectablePagedListStyleDefault;
			createInfiniteListStyle = createInfiniteListStyleDefault;
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

	registerComponent({
		name: "knob-button",
		createVm: require("./button/vm"),
		template: require("./button/template.html"),
		style: buttonStyle
	});

	registerComponent({
		name: "knob-input",
		createVm: require("./input/vm"),
		template: require("./input/template.html"),
		style: createInputStyle(config.colors)
	});

	registerComponent({
		name: "knob-textarea",
		createVm: require("./textarea/vm"),
		template: require("./textarea/template.html"),
		style: createInputStyle(config.colors)
	});

	registerComponent({
		name: "knob-radio",
		createVm: require("./radio/vm"),
		template: require("./radio/template.html")
	});

	registerComponent({
		name: "smart-radio",
		createVm: require("./smartRadio/vm"),
		template: require("./smartRadio/template.html")
	});

	registerComponent({
		name: "knob-inline-text-editor",
		createVm: require("./inlineTextEditor/vm"),
		template: require("./inlineTextEditor/template.html"),
		icons: icons.inlineTextEditor
	});

	registerComponent({
		name: "knob-dropdown",
		createVm: require("./dropdown/vm"),
		template: require("./dropdown/template.html")
	});

	registerComponent({
		name: "knob-pagination",
		createVm: require("./pagination/vm"),
		template: require("./pagination/template.html"),
		style: buttonStyle,
		icons: icons.pagination
	});

	registerComponent({
		name: "knob-items-per-page",
		createVm: require("./itemsPerPage/vm"),
		template: require("./itemsPerPage/template.html"),
		icons: {
			dropdown: icons.dropdown
		}
	});

	registerComponent({
		name: "knob-paged-list",
		createVm: require("./pagedList/vm"),
		template: require("./pagedList/template.html"),
		style: createPagedListStyle(config.colors),
		icons: {
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		labels: {
			noResults: labels.noResults
		}
	});

	registerComponent({
		name: "knob-selectable-paged-list",
		createVm: require("./selectablePagedList/vm"),
		template: require("./selectablePagedList/template.html"),
		style: createSelectablePagedListStyle(config.colors),
		icons: {
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		labels: {
			noResults: labels.noResults
		}
	});

	registerComponent({
		name: "knob-infinite-list",
		createVm: require("./infiniteList/vm"),
		template: require("./infiniteList/template.html"),
		style: createInfiniteListStyle(config.colors),
		icons: {
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown,
			loading: icons.loading
		},
		labels: {
			noResults: labels.noResults,
			loadMore: labels.loadMore
		}
	});

	registerComponent({
		name: "knob-toggleswitch",
		createVm: require("./toggleSwitch/vm"),
		template: require("./toggleSwitch/template.html"),
		style: createToggleSwitchStyle(config.colors)
	});

	registerComponent({
		name: "knob-modal",
		createVm: require("./modal/vm"),
		template: require("./modal/template.html"),
		style: createModalStyle(config.colors)
	});

	registerComponent({
		name: "knob-confirm",
		createVm: require("./modal/confirm/vm"),
		template: require("./modal/confirm/template.html"),
		style: createModalStyle(config.colors)
	});

	registerComponent({
		name: "knob-alert",
		createVm: require("./modal/alert/vm"),
		template: require("./modal/alert/template.html"),
		style: createModalStyle(config.colors)
	});

	registerComponent({
		name: "knob-tabs",
		createVm: require("./tabs/vm"),
		template: require("./tabs/template.html")
	});

	registerComponent({
		name: "knob-tab",
		createVm: require("./tabs/tab/vm"),
		template: require("./tabs/tab/template.html"),
		style: tabStyle
	});

	registerComponent({
		name: "smart-tabs",
		createVm: require("./smartTabs/vm"),
		template: require("./smartTabs/template.html")
	});

	registerComponent({
		name: "smart-tab",
		createVm: require("./smartTabs/tab/vm"),
		template: require("./smartTabs/tab/template.html"),
		style: tabStyle
	});

	registerComponent({
		name: "knob-notification",
		createVm: require("./notificationBar/vm"),
		template: require("./notificationBar/template.html"),
		style: createNotificationStyle(config.colors)
	});

	registerComponent({
		name: "knob-checkbox",
		createVm: require("./checkbox/vm"),
		template: require("./checkbox/template.html"),
		style: checkboxStyle,
		icons: {
			tick: icons.tick,
			cross: icons.cross
		}
	});

	registerComponent({
		name: "knob-numericinput",
		createVm: require("./numericInput/vm"),
		template: require("./numericInput/template.html"),
		icons: icons.numericInput
	});

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
