"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var extend = require("extend");

var registerComponent = require("./knobRegisterComponent");

var baseVm = require("./base/vm");

var createButtonStyle;
var createButtonStyleDefault = require("./components/button/style");
var createButtonStyleChamaileon = require("./components/button/chamaileon");

var createInputStyle;
var createInputStyleDefault = require("./components/input/style");
var createInputStyleChamaileon = require("./components/input/chamaileon");

var createToggleSwitchStyle;
var createToggleSwitchStyleDefault = require("./components/toggleSwitch/style");

var createModalStyle;
var createModalStyleChamaileon = require("./components/modal/chamaileon");
var createModalStyleDefault = require("./components/modal/style");

var createPagedListStyle;
var createPagedListStyleDefault = require("./components/pagedList/style");

var createSelectablePagedListStyle;
var createSelectablePagedListStyleDefault = require("./components/selectablePagedList/style");

var createInfiniteListStyle;
var createInfiniteListStyleDefault = require("./components/infiniteList/style");

var createNotificationStyle;
var createNotificationStyleDefault = require("./components/notificationBar/style");

var createCheckboxStyle;
var createCheckboxStyleDefault = require("./components/checkbox/style");

var createTabStyle;
var createTabStyleDefault = require("./components/tabs/tab/style");

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
		createVm: require("./components/button/vm"),
		template: require("./components/button/template.html"),
		style: buttonStyle,
		css: require("./components/button/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-input",
		createVm: require("./components/input/vm"),
		template: require("./components/input/template.html"),
		style: createInputStyle(config.colors),
		css: require("./components/input/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-textarea",
		createVm: require("./components/textarea/vm"),
		template: require("./components/textarea/template.html"),
		style: createInputStyle(config.colors),
		css: require("./components/textarea/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-radio",
		createVm: require("./components/radio/vm"),
		template: require("./components/radio/template.html"),
		css: require("./components/radio/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-inline-text-editor",
		createVm: require("./components/inlineTextEditor/vm"),
		template: require("./components/inlineTextEditor/template.html"),
		icons: icons.inlineTextEditor
	});

	registerComponent({
		name: "knob-dropdown",
		createVm: require("./components/dropdown/vm"),
		template: require("./components/dropdown/template.html"),
		css: require("./components/dropdown/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-pagination",
		createVm: require("./components/pagination/vm"),
		template: require("./components/pagination/template.html"),
		style: buttonStyle,
		icons: icons.pagination,
		css: require("./components/pagination/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-items-per-page",
		createVm: require("./components/itemsPerPage/vm"),
		template: require("./components/itemsPerPage/template.html"),
		icons: {
			dropdown: icons.dropdown
		}
	});

	registerComponent({
		name: "knob-paged-list",
		createVm: require("./components/pagedList/vm"),
		template: require("./components/pagedList/template.html"),
		style: createPagedListStyle(config.colors),
		icons: {
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		labels: {
			noResults: labels.noResults
		},
		css: require("./components/pagedList/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-selectable-paged-list",
		createVm: require("./components/selectablePagedList/vm"),
		template: require("./components/selectablePagedList/template.html"),
		style: createSelectablePagedListStyle(config.colors),
		icons: {
			search: icons.search,
			sort: icons.sort,
			dropdown: icons.dropdown
		},
		labels: {
			noResults: labels.noResults
		},
		css: require("./components/selectablePagedList/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-infinite-list",
		createVm: require("./components/infiniteList/vm"),
		template: require("./components/infiniteList/template.html"),
		style: createInfiniteListStyle(config.colors),
		css: require("./components/infiniteList/css"),
		colors: config.colors,
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
		createVm: require("./components/toggleSwitch/vm"),
		template: require("./components/toggleSwitch/template.html"),
		style: createToggleSwitchStyle(config.colors),
		css: require("./components/toggleSwitch/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-modal",
		createVm: require("./components/modal/vm"),
		template: require("./components/modal/template.html"),
		style: createModalStyle(config.colors),
		css: require("./components/modal/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-confirm",
		createVm: require("./components/modal/confirm/vm"),
		template: require("./components/modal/confirm/template.html"),
		style: createModalStyle(config.colors),
		css: require("./components/modal/confirm/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-alert",
		createVm: require("./components/modal/alert/vm"),
		template: require("./components/modal/alert/template.html"),
		style: createModalStyle(config.colors),
		css: require("./components/modal/alert/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-tabs",
		createVm: require("./components/tabs/vm"),
		template: require("./components/tabs/template.html"),
		css: require("./components/tabs/css"),
		colors: config.colors
	});

	registerComponent({
		name: "knob-tab",
		createVm: require("./components/tabs/tab/vm"),
		template: require("./components/tabs/tab/template.html"),
		style: tabStyle
	});

	registerComponent({
		name: "knob-notification",
		createVm: require("./components/notificationBar/vm"),
		template: require("./components/notificationBar/template.html"),
		style: createNotificationStyle(config.colors)
	});

	registerComponent({
		name: "knob-checkbox",
		createVm: require("./components/checkbox/vm"),
		template: require("./components/checkbox/template.html"),
		style: checkboxStyle,
		css: require("./components/checkbox/css"),
		colors: config.colors,
		icons: {
			tick: icons.tick,
			cross: icons.cross
		}
	});

	registerComponent({
		name: "knob-numericinput",
		createVm: require("./components/numericInput/vm"),
		template: require("./components/numericInput/template.html"),
		icons: icons.numericInput,
		css: require("./components/numericInput/css"),
		colors: config.colors,
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
