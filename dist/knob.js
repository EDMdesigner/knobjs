(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.knob = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function clickBehaviour(vm) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	function mouseDown() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function mouseUp() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("hover");
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mousedown = mouseDown;
	vm.eventHandlers.mouseup = mouseUp;

	return vm;
};

},{}],2:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function focusBehaviour(vm) {

	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	function focus() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function blur() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("default");
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.focus = focus;
	vm.eventHandlers.blur = blur;

	return vm;
};

},{}],3:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function hoverBehaviour(vm) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	if (!ko.isObservable(vm.state)) {
		throw new Error("vm.state has to be a knockout observable!");
	}

	var previousState;

	function mouseOver() {
		var actState = vm.state();

		if (actState === "disabled" || actState === "active") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		vm.state("hover");
	}

	function mouseOut() {
		var actState = vm.state();

		if (actState === "disabled" || actState === "active") {
			return;
		}

		vm.state(previousState);
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mouseover = mouseOver;
	vm.eventHandlers.mouseout = mouseOut;


	return vm;
};

},{}],4:[function(require,module,exports){
/*jslint node: true */
"use strict";

var vms = {};

module.exports = function selectBehaviour(vm, config) {
	if (!vm) {
		throw new Error("vm is mandatory!");
	}

	config = config || {};

	var group = config.group || "default";

	if (!vms[group]) {
		vms[group] = [];
	}

	vms[group].push(vm);

	function mouseDown() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state("active");
	}

	function mouseUp() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		var actGroupVms = vms[group];

		for (var idx = 0; idx < actGroupVms.length; idx += 1) {
			var actVm = actGroupVms[idx];

			if (actVm === vm) {
				continue;
			}

			actVm.state("default");
		}
	}

	if (!vm.eventHandlers) {
		vm.eventHandlers = {};
	}

	vm.eventHandlers.mousedown = mouseDown;
	vm.eventHandlers.mouseup = mouseUp;

	return vm;
};

},{}],5:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var hoverBehaviour = require("./behaviours/hover");
var focusBehaviour = require("./behaviours/focus");
var clickBehaviour = require("./behaviours/click");
var selectBehaviour = require("./behaviours/select");


function createBaseVm(config) {
	config = config || {};

	if (!config.component) {
		throw new Error("config.component is mandatory!");
	}

	if (!config.style) {
		throw new Error("config.style is mandatory!");
	}

	var component = config.component;
	var style = config.style;

	var state = ko.observable(config.state || "default");
	var variation = config.variation || "default";


	var cssClassComputed = ko.computed(function() {
		return "knob-" + component + " state-" + state() + " variation-" + variation;
	});
	var styleComputed = ko.computed(function() {
		var stateVal = state();

		return style[variation][stateVal];
	});

	var vm = {
		variation: variation,
		state: state,

		cssClass: cssClassComputed,
		style: styleComputed,

		eventHandlers: {}
	};


	function createEnabler(behaviour, props) {
		return {
			enable: function() {
				behaviour(vm, config);
			},
			disable: function() {
				props.forEach(function(prop) {
					if (vm.eventHandlers[prop]) {
						delete vm.eventHandlers[prop];
					}
				});
			}
		};
	}

	vm.behaviours = {
		hover: createEnabler(hoverBehaviour, ["mouseover", "mouseout"]),
		focus: createEnabler(focusBehaviour, ["focus", "blur"]),
		click: createEnabler(clickBehaviour, ["mousedown", "mouseup"]),
		select: createEnabler(selectBehaviour, ["mousedown", "mouseup"])
	};

	return vm;
}

module.exports = createBaseVm;

},{"./behaviours/click":1,"./behaviours/focus":2,"./behaviours/hover":3,"./behaviours/select":4}],6:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.primaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"backgroundColor": theme.primaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"disabled": {
				"backgroundColor": theme.mediumGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.darkGray,
				"fill": theme.darkGray
			}
		},
		"tab": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.darkGray,
				"fill": theme.darkGray
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": theme.white,
				"color": theme.black,
				"fill": theme.black
			},
				"disabled": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white0
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			},
				"disabled": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		}
	};
};

},{}],7:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass,\n					style: style,\n					click: click,\n					event: eventHandlers,\n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
},{}],8:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");

function createButton(config) {
	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (config.click && typeof config.click !== "function") {
		throw new Error("click has to be a function!");
	}

	if (!config.label && !config.leftIcon && !config.rightIcon && !config.icon) {
		throw new Error("either label/lefticon/righticon/icon has to be given!");
	}

	config.component = "button";

	var vm = base(config);

	vm.behaviours.hover.enable();

	if (config.radio) {
		vm.behaviours.select.enable();
	} else {
		vm.behaviours.click.enable();
	}

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.value = config.value;
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;

},{"../base/vm":5}],9:[function(require,module,exports){
/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");
var baseVm = require("./base/vm");

var createButtonStyle = require("./button/style");
var createInputStyle = require("./input/style");


function initKnob(theme) {

	var buttonStyle = createButtonStyle(theme);

	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), buttonStyle);
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(theme));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"), buttonStyle);
	registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
	registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"), buttonStyle);
}

module.exports = {
	init: initKnob,

	registerComponent: registerComponent,
	base: {
		vm: baseVm
	}
};
//
},{"./base/vm":5,"./button/style":6,"./button/template.html":7,"./button/vm":8,"./dropdown/template.html":10,"./dropdown/vm":11,"./inlineTextEditor/template.html":12,"./inlineTextEditor/vm":13,"./input/style":14,"./input/template.html":15,"./input/vm":16,"./itemsPerPage/template.html":17,"./itemsPerPage/vm":18,"./knobRegisterComponent":19,"./pagedList/template.html":21,"./pagedList/vm":22,"./pagination/template.html":23,"./pagination/vm":24,"./radio/template.html":25,"./radio/vm":26,"./tabs/tab/template.html":27,"./tabs/tab/vm":28,"./tabs/template.html":29,"./tabs/vm":30}],10:[function(require,module,exports){
module.exports = '<div class="knob-dropdown">\n	<!-- with params, the selected().label won\'t be recalculated, when selected is changed... -->\n	<div data-bind="component: {\n						name: \'knob-button\',\n						params: {label: selected().label,\n						icon: selected().icon,\n						rightIcon: rightIcon,\n						click: dropdownVisible.toggle}}">\n	</div>\n	<div class="knob-dropdown-menu" data-bind="foreach: options, visible: dropdownVisible">\n		<div data-bind="component: {\n							name: \'knob-button\',\n							params: {label: label, icon: icon, click: select}}, \n							visible: $data !== $parent.selected()">\n		</div>\n	</div>\n</div>\n';
},{}],11:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);


function createButtonDropdown(config) {
	config = config || {};

	if (!config.rightIcon) {
		throw new Error("config.rightIcon element is mandatory!");
	}
	if (!config.items) {
		throw new Error("config.items element is mandatory!");
	}
	if (config.selected && !ko.isObservable(config.selected)) {
		throw new Error("config.selected has to be a knockout observable!");
	}

	if (config.items.length === 0) {
		throw new Error("config.items should not be empty");
	}

	var rightIcon = ko.observable(config.rightIcon);

	var options = ko.observableArray([]);

	for (var idx = 0; idx < config.items.length; idx += 1) {

		if (!config.items[idx].label && !config.items[idx].icon) {
			throw new Error("each element of config.items has to have label and/or icon property");
		}
		options.push(createOption({
			label: config.items[idx].label,
			icon: config.items[idx].icon,
			value: config.items[idx].value
		}));
	}

	// console.log(options());

	var selected = config.selected || ko.observable();

	selected(options()[config.selectedIdx || 0]);

	var dropdownVisible = ko.observable(false);

	dropdownVisible.toggle = function toggleDropdownVisible(item, event) {
		if (event) {
			event.stopPropagation();
		}

		var visible = dropdownVisible();

		dropdownVisible(!visible);

		// should remove this when test in phantomjs
		if (typeof window === "undefined") {
			return;
		}

		if (visible) {
			window.removeEventListener("click", toggleDropdownVisible, false);
		} else {
			window.addEventListener("click", toggleDropdownVisible, false);
		}
	};

	function createOption(config) {
		var obj = {
			label: ko.observable(config.label),
			icon: ko.observable(config.icon),
			value: config.value,
			select: function() {
				selected(obj);
				dropdownVisible.toggle();
			}
		};

		return obj;
	}

	return {
		rightIcon: rightIcon,

		selected: selected,
		options: options,

		dropdownVisible: dropdownVisible
	};
}

module.exports = createButtonDropdown;

},{}],12:[function(require,module,exports){
module.exports = '<span>\n	<span data-bind="visible: !editMode()">\n		<span data-bind="text: value"></span>\n		<knob-button params="label: \'\', click: edit, icon: \'#icon-edit\'">\n	</span>\n	<span data-bind="visible: editMode">\n		<knob-input params="value: editedValue, hasFocus: inputHasFocus, keyDown: keyDown, visible: editMode"></knob-input>\n		<knob-button params="label: \'\', click: save, icon: \'#icon-done\'"></knob-button>\n		<knob-button params="label: \'\', click: cancel, icon: \'#icon-close\'"></knob-button>\n	</span>\n</span>';
},{}],13:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function createInlineTextEditor(config) {
	var vm = {};

	var config = config || {};

	if (config.value && !ko.isObservable(config.value)) {
		throw new Error("config.value has to be an observable!");
	}

	vm.value = config.value || ko.observable("");
	vm.editedValue = ko.observable(vm.value());

	vm.editMode = ko.observable(false);

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

},{}],14:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.inputBorder
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};

},{}],15:[function(require,module,exports){
module.exports = '<input data-bind="css: cssClass,\n					style: style,\n					attr: {type: type},\n					event: eventHandlers,\n					hasFocus: hasFocus,\n					disable: state() === \'disabled\',\n					value: value,\n					valueUpdate: \'afterkeydown\'" />';
},{}],16:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");

function createInput(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (config.value && !ko.isObservable(config.value)) {
		throw new Error("config.value must be an observable");
	}

	if (config.hasFocus && !ko.isObservable(config.hasFocus)) {
		throw new Error("config.hasFocus must be an observable");
	}

	config.component = "input";
	config.type = config.type || "text";

	var vm = base(config);

	vm.behaviours.hover.enable();
	vm.behaviours.focus.enable();

	vm.type = config.type;
	vm.value = config.value || ko.observable();
	vm.hasFocus = config.hasFocus || ko.observable(false);

	if (config.keyDown) {
		vm.eventHandlers.keydown = config.keyDown;
	}

	return vm;
}

module.exports = createInput;

},{"../base/vm":5}],17:[function(require,module,exports){
module.exports = '<knob-dropdown params="\n	rightIcon: \'#icon-expand-more\',\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],18:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createItemsPerPage(config) {
	config = config || {};

	if (!config.numOfItems) {
		throw new Error("config.numOfItems element is mandatory!");
	}

	if (config.itemsPerPageList) {
		for (var i = 0; i < config.itemsPerPageList.length; i += 1) {

			if (!config.itemsPerPageList[i].value && !config.itemsPerPageList[i].label) {
				throw new Error("each element of config.items has to have label and/or value property");
			}

		}
	}

	var numOfItems = config.numOfItems;

	var itemsPerPageList = config.itemsPerPageList || [{
		label: 10,
		value: 10
	}, {
		label: 25,
		value: 25
	}, {
		label: 50,
		value: 50
	}, {
		label: 100,
		value: 100
	}];

	var itemsPerPage = ko.observable(itemsPerPageList[0]);

	var numOfPages = config.numOfPages || ko.observable();

	ko.computed(function() {
		var numOfItemsVal = numOfItems();
		var itemsPerPageVal = itemsPerPage();

		if (!itemsPerPageVal) {
			return numOfPages(0);
		}

		if (config.itemsPerPage) {
			config.itemsPerPage(itemsPerPageVal.value);
		}

		return numOfPages(Math.ceil(numOfItemsVal / itemsPerPageVal.value));
	});

	return {
		numOfItems: numOfItems,
		itemsPerPage: itemsPerPage,
		numOfPages: numOfPages,

		itemsPerPageList: itemsPerPageList
	};
};

},{}],19:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function knobRegisterComponent(name, createVm, template, style) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				params.style = style;
				return createVm(params, componentInfo);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;

},{}],20:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createList(config) {
	config = config || {};

	if (!config.hasOwnProperty("store")) {
		throw new Error("config.store is mandatory!");
	}

	if (!config.hasOwnProperty("fields")) {
		throw new Error("config.fields is mandatory!");
	}

	if (!config.hasOwnProperty("sort")) {
		throw new Error("config.sort is mandatory!");
	}

	if (!config.hasOwnProperty("search")) {
		throw new Error("config.search is mandatory!");
	}

	if (typeof config.store !== "object") {
		throw new Error("config.search must be an object!");
	}

	if (!(config.fields instanceof Array)) {
		throw new Error("config.fields must be an array!");
	}

	if (!(config.sort instanceof Array)) {
		throw new Error("config.sort must be an array!");
	}

	if (typeof config.search !== "string") {
		throw new Error("config.search must be a string!");
	}

	if (config.fields.indexOf(config.search) === -1) {
		throw new Error("config.fields must contain the value of config.search!");
	}

	var orderField;

	if (config.orderBy) {
		if (typeof config.orderBy !== "object") {
			throw new Error("config.orderBy must have the format of { <key>: [1;-1] } ");
		}

		orderField = Object.keys(config.orderBy)[0];
		if (config.fields.indexOf(orderField) === -1 || Math.abs(config.orderBy[orderField]) !== 1) {
			throw new Error("config.orderBy must have the format of { <key>: [1;-1] } ");
		}
	}

	config.sort.forEach(function(item) {
		if (config.fields.indexOf(item.value) === -1) {
			throw new Error("values of config.sort must be in config.fields!");
		}
	});

	var store = config.store;
	var fields = config.fields;

	var search = ko.observable("").extend({
		throttle: config.throttle || 500
	});

	var sortOptions = [];

	var defaultOrderIdx;

	function createQueryObj(prop, asc) {
		var obj = {};

		obj[prop] = asc;

		if (orderField && prop === orderField && asc === config.orderBy[orderField]) {
			defaultOrderIdx = sortOptions.length;
		}

		return obj;
	}

	for (var idx = 0; idx < config.sort.length; idx += 1) {
		var act = config.sort[idx];

		sortOptions.push({
			icon: "#icon-sort-asc",
			label: act.label,
			value: createQueryObj(act.value, 1)
		});
		sortOptions.push({
			icon: "#icon-sort-desc",
			label: act.label,
			value: createQueryObj(act.value, -1)
		});
	}

	var sort = ko.observable(sortOptions[defaultOrderIdx || 0]);
	var sortIdx = defaultOrderIdx || 0;

	var skip = ko.observable(0);
	var limit = ko.observable(0);

	var items = ko.observableArray([]);

	store.items.forEach(function(item) { //store === this
		items.push(item);
	});

	var count = ko.observable(0); //should be read-only

	var loading = ko.observable(false); //should be read-only
	var error = ko.observable(false); //should be read-only?

	ko.computed(function() {
		var searchVal = search();
		var sortVal = sort().value;
		var skipVal = skip();
		var limitVal = limit();

		var find = {};

		find[config.search] = (new RegExp(searchVal, "ig")).toString();

		store.find = find;
		store.sort = sortVal;
		store.skip = skipVal;
		store.limit = limitVal;
	}).extend({
		throttle: 0
	});

	function beforeLoad() {
		if (loading()) {
			console.log("List is already loading..."); //this might be problematic if there are no good timeout settings.
		}

		loading(true);
	}

	function afterLoad(err) {
		loading(false);
		if (err) {
			return error(err);
		}
		error(null);

		store.items.forEach(function(item) { //store === this
			items.push(item);
		});

		count(store.count);
	}

	function readOnlyComputed(observable) {
		return ko.computed({
			read: function() {
				return observable();
			},
			write: function() {
				throw "This computed variable should not be written.";
			}
		});
	}

	store.load.before.add(beforeLoad);
	store.load.after.add(afterLoad);

	return {
		store: store,

		fields: fields, //should filter to the fields. (select)

		search: search,

		sort: sort,
		sortIdx: sortIdx,
		sortOptions: sortOptions,

		skip: skip,
		limit: limit,

		items: items,
		count: readOnlyComputed(count),

		loading: readOnlyComputed(loading),
		error: readOnlyComputed(error)
	};
};

},{}],21:[function(require,module,exports){
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\',\n								variation: \'default\',\n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count,\n										numOfPages: numOfPages,\n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-expand-more\', selectedIdx: sortIdx, selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<div class="knob-pagelist__result" data-bind="foreach: items">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: {model: $data, parent: $parent, index: $index} } --><!-- /ko -->\n		</div>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],22:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);
var createList = require("../list/vm");

module.exports = function createPagedList(config) {
	config = config || {};
	
	if (!config.store) {
		throw new Error("config.store is mandatory!");
	}

	var store = config.store;

	store.load.before.add(beforeLoad);

	var list = createList(config);
	//var pagination = createPagination(config.pagination);
	//list.pagination = pagination;

	var numOfPages = ko.observable();
	var itemsPerPage = ko.observable(10);
	var currentPage = ko.observable(0);

	list.numOfPages = numOfPages;
	list.itemsPerPage = itemsPerPage;
	list.currentPage = currentPage;

	ko.computed(function() {
		var currentPageVal = currentPage();
		var itemsPerPageVal = itemsPerPage();

		list.skip(currentPageVal * itemsPerPageVal);
		list.limit(itemsPerPageVal);
	});

	/*
	ko.computed(function() {
		var count = list.count();
		list.pagination.numOfItems(count);
	});
	*/

	function beforeLoad() {
		list.items([]);
	}

	return list;
};

},{"../list/vm":20}],23:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-first-page\',\n							state: first().state,\n							click: first().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-left\',\n							state: prev().state,\n							click: prev().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label,\n							state: state,\n							variation: \'pagination\',\n							click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-right\',\n							state: next().state,\n							click: next().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-last-page\',\n							state: last().state,\n							click: last().selectPage\n						}\n					}">\n	</span>\n</div>';
},{}],24:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createPagination(config) {
	config = config || {};

	if (config.afterHead && config.afterHead < 1) {
		throw new Error("config.afterHead must be larger than zero");
	}

	if (config.beforeTail && config.beforeTail < 1) {
		throw new Error("config.beforeTail must be larger than zero");
	}

	if (config.beforeCurrent && config.beforeCurrent < 1) {
		throw new Error("config.beforeCurrent must be larger than zero");
	}

	if (config.afterCurrent && config.afterCurrent < 1) {
		throw new Error("config.afterCurrent must be larger than zero");
	}

	var numOfPages;

	if (ko.isObservable(config.numOfPages)) {
		numOfPages = config.numOfPages;
	} else {
		numOfPages = ko.observable(config.numOfPages || 10);
	}

	function normalize(value) {
		if (value < 0) {
			value = 0;
		}

		var pagesNum = numOfPages();

		if (value >= pagesNum) {
			value = pagesNum - 1;
		}

		return value;
	}

	var currentPage = (function() {
		var currentPage = ko.observable();

		ko.computed(function() {
			numOfPages();
			currentPage(0);
		});

		if (ko.isObservable(config.currentPage)) {
			currentPage = config.currentPage;
		} else {
			currentPage = ko.observable(normalize(config.currentPage) || 0);
		}

		return ko.computed({
			read: function() {
				return currentPage();
			},
			write: function(value) {
				currentPage(normalize(value));
			}
		});
	}());



	var currentPageRealIdx;
	var pageSelectors = (function(config) {
		var afterHead = config.afterHead || 2;
		var beforeTail = config.beforeTail || 2;
		var beforeCurrent = config.beforeCurrent || 2;
		var afterCurrent = config.afterCurrent || 2;

		function createPageSelector(idx) {
			return {
				label: idx + 1,
				state: "default",
				selectPage: function() {
					currentPage(idx);
				}
			};
		}

		function createNonClickableSelector(label) {
			return {
				label: label,
				state: "disabled",
				selectPage: function() {}
			};
		}

		return ko.computed(function() {
			var elements = [];

			var numOfPagesVal = numOfPages();
			var currentPageVal = currentPage();

			var nonClickableInserted = false;

			for (var idx = 0; idx < numOfPagesVal; idx += 1) {
				if (idx <= afterHead || idx >= numOfPagesVal - beforeTail - 1 || idx >= currentPageVal - beforeCurrent && idx <= currentPageVal + afterCurrent) {
					var pageSelector;

					if (idx === currentPageVal) {
						pageSelector = createNonClickableSelector(idx + 1);
						currentPageRealIdx = elements.length;
					} else {
						pageSelector = createPageSelector(idx);
					}

					elements.push(pageSelector);
					nonClickableInserted = false;
				} else {
					if (!nonClickableInserted) {
						elements.push(createNonClickableSelector("..."));
					}
					nonClickableInserted = true;
				}
			}

			return elements;
		});
	}(config));


	var next = ko.computed(function() {
		var idx = currentPageRealIdx + 1;

		var pages = pageSelectors();

		if (idx >= pages.length - 1) {
			idx = pages.length - 1;
		}

		return pages[idx];
	});

	var prev = ko.computed(function() {
		var idx = currentPageRealIdx - 1;

		if (idx < 0) {
			idx = 0;
		}

		return pageSelectors()[idx];
	});

	var first = ko.computed(function() {
		return pageSelectors()[0];
	});

	var last = ko.computed(function() {
		var pages = pageSelectors();

		return pages[pages.length - 1];
	});


	return {
		pageSelectors: pageSelectors,

		first: first,
		last: last,

		next: next,
		prev: prev,

		currentPage: currentPage,

		numOfPages: numOfPages
	};
};

},{}],25:[function(require,module,exports){
module.exports = '<div class="knob-radio" data-bind="foreach: items">\n	<div data-bind="component: {\n		name: \'knob-button\',\n		params: {\n			state: isSelected() ? \'active\' : \'default\',\n			variation: $parent.variation,\n			label: label,\n			icon: icon,\n			radio: true,\n			group: group,\n			click: select\n		}\n	}">\n	</div>\n</div>\n';
},{}],26:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function createRadio(config) {

	config = config || {};

	var vm = {};

	if (config.items.length === 0) {
		throw new Error("config.items should not be empty");
	}

	vm.selected = config.selected || ko.observable();
	vm.selectedIdx = config.selectedIdx || ko.observable();

	vm.variation = config.variation || "default";

	vm.items = [];

	for (var idx = 0; idx < config.items.length; idx += 1) {

		var act = config.items[idx];

		if (!act.label && !act.icon) {
			throw new Error("each element of config.items has to have label and/or icon property");
		}

		vm.items.push(createItemVm(act.label, act.icon, idx));
	}

	var sel = vm.selectedIdx();

	if (typeof sel === "number") {
		sel = Math.floor(sel);
		sel %= vm.items.length;

		vm.items[sel].select();

	} else {
		vm.items[0].select();
	}

	function createItemVm(label, icon, idx) {

		var obj = {
			label: label,
			icon: icon,
			group: config.group,
			select: function() {
				vm.selected(obj);
				vm.selectedIdx(idx);
			},
			isSelected: function() {
				return obj === vm.selected();
			}
		};

		return obj;
	}

	return vm;
}

module.exports = createRadio;

},{}],27:[function(require,module,exports){
module.exports = '<div data-bind="css: cssClass,\n					style: style">\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],28:[function(require,module,exports){
/*jslint node: true */
"use strict";

var base = require("../../base/vm");

function createTab(config) {
	config = config || {};
	config.component = "tab";
	config.variation = "tab";
	config.state = "active";
	var vm = base(config);

	return vm;
}

module.exports = createTab;

},{"../../base/vm":5}],29:[function(require,module,exports){
module.exports = '<div>\n	<knob-radio class="knob-radio--inline" params="\n		group: tabsGroup,\n		variation: \'tab\',\n		selectedIdx: selectedIdx,\n		items: buttons">\n	</knob-radio>\n\n	<div data-bind="foreach: panels">\n		<knob-tab data-bind="visible: $parent.selectedIdx() == $index()">\n			<!-- ko template: { nodes: $data } --><!-- /ko -->\n		</knob-tab>\n	</div>\n</div>';
},{}],30:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var nextTabsGroupIdx = 0;

function convertParamsToObject(params) {
	params = params.replace(/'/g, "\"");

	var params = params.split(",");

	var convertedParams = [];

	for (var idx = 0; idx < params.length; idx += 1) {
		var act = params[idx];

		act = act.trim();

		act = act.split(":");

		if (act.length !== 2) {
			continue;
		}

		act = "\"" + act[0] + "\"" + ":" + act[1];
		convertedParams.push(act);
	}

	return JSON.parse("{" + convertedParams.join(",") + "}");
}

function createTabs(config, componentInfo) {
	config = config || {};
	componentInfo = componentInfo || {};
	componentInfo.templateNodes = componentInfo.templateNodes || [];

	var defaultTab = config.defaultTab || 0;

	var vm = {};

	var tabButtons = [];
	var tabPanels = [];

	var tabIdx = 0;

	for (var idx = 0; idx < componentInfo.templateNodes.length; idx += 1) {
		var actTemplateNode = componentInfo.templateNodes[idx];

		if (actTemplateNode.nodeName.toLowerCase() !== "knob-tab") {
			continue;
		}

		var tabButtonData = convertParamsToObject(actTemplateNode.getAttribute("params"));

		tabButtonData.tabIdx = tabIdx;
		tabIdx += 1;

		tabButtons.push(tabButtonData);

		tabPanels.push(actTemplateNode.childNodes);
	}

	if (tabPanels.length < 1) {
		throw new Error("knob-tabs component should have at least one knob-tab component as a child component!");
	}

	for (var idx = 0; idx < tabButtons.length; idx += 1) {
		var act = tabButtons[idx];

		if (!act.icon && !act.leftIcon && !act.rightIcon && !act.label) {
			throw new Error("The child knob-tab components should have proper params (icon and/or label) just like with buttons!");
		}
	}

	vm.tabsGroup = "tabsGroup_" + nextTabsGroupIdx;
	nextTabsGroupIdx += 1;

	vm.selectedIdx = ko.observable(defaultTab);

	vm.buttons = tabButtons;
	vm.panels = tabPanels;

	return vm;
}

module.exports = createTabs;

},{}]},{},[9])(9)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbCIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2VkTGlzdC92bS5qcyIsInNyYy9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnaW5hdGlvbi92bS5qcyIsInNyYy9yYWRpby90ZW1wbGF0ZS5odG1sIiwic3JjL3JhZGlvL3ZtLmpzIiwic3JjL3RhYnMvdGFiL3RlbXBsYXRlLmh0bWwiLCJzcmMvdGFicy90YWIvdm0uanMiLCJzcmMvdGFicy90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbGlja0JlaGF2aW91cih2bSkge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VEb3duKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZWRvd24gPSBtb3VzZURvd247XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb2N1c0JlaGF2aW91cih2bSkge1xuXG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBmb2N1cygpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJsdXIoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJkZWZhdWx0XCIpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5mb2N1cyA9IGZvY3VzO1xuXHR2bS5ldmVudEhhbmRsZXJzLmJsdXIgPSBibHVyO1xuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaG92ZXJCZWhhdmlvdXIodm0pIHtcblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZSh2bS5zdGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdHZhciBwcmV2aW91c1N0YXRlO1xuXG5cdGZ1bmN0aW9uIG1vdXNlT3ZlcigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIgfHwgYWN0U3RhdGUgPT09IFwiYWN0aXZlXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYWN0U3RhdGUgIT09IFwiaG92ZXJcIikge1xuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIgfHwgYWN0U3RhdGUgPT09IFwiYWN0aXZlXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShwcmV2aW91c1N0YXRlKTtcblx0fVxuXG5cdGlmICghdm0uZXZlbnRIYW5kbGVycykge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcblx0fVxuXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2VvdmVyID0gbW91c2VPdmVyO1xuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlb3V0ID0gbW91c2VPdXQ7XG5cblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB2bXMgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3RCZWhhdmlvdXIodm0sIGNvbmZpZykge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgZ3JvdXAgPSBjb25maWcuZ3JvdXAgfHwgXCJkZWZhdWx0XCI7XG5cblx0aWYgKCF2bXNbZ3JvdXBdKSB7XG5cdFx0dm1zW2dyb3VwXSA9IFtdO1xuXHR9XG5cblx0dm1zW2dyb3VwXS5wdXNoKHZtKTtcblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBhY3RHcm91cFZtcyA9IHZtc1tncm91cF07XG5cblx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhY3RHcm91cFZtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0XHR2YXIgYWN0Vm0gPSBhY3RHcm91cFZtc1tpZHhdO1xuXG5cdFx0XHRpZiAoYWN0Vm0gPT09IHZtKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRhY3RWbS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZWRvd24gPSBtb3VzZURvd247XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGhvdmVyQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9ob3ZlclwiKTtcbnZhciBmb2N1c0JlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvZm9jdXNcIik7XG52YXIgY2xpY2tCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2NsaWNrXCIpO1xudmFyIHNlbGVjdEJlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvc2VsZWN0XCIpO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VWbShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLmNvbXBvbmVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jb21wb25lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLnN0eWxlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0eWxlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHR2YXIgY29tcG9uZW50ID0gY29uZmlnLmNvbXBvbmVudDtcblx0dmFyIHN0eWxlID0gY29uZmlnLnN0eWxlO1xuXG5cdHZhciBzdGF0ZSA9IGtvLm9ic2VydmFibGUoY29uZmlnLnN0YXRlIHx8IFwiZGVmYXVsdFwiKTtcblx0dmFyIHZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblxuXHR2YXIgY3NzQ2xhc3NDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBcImtub2ItXCIgKyBjb21wb25lbnQgKyBcIiBzdGF0ZS1cIiArIHN0YXRlKCkgKyBcIiB2YXJpYXRpb24tXCIgKyB2YXJpYXRpb247XG5cdH0pO1xuXHR2YXIgc3R5bGVDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdGF0ZVZhbCA9IHN0YXRlKCk7XG5cblx0XHRyZXR1cm4gc3R5bGVbdmFyaWF0aW9uXVtzdGF0ZVZhbF07XG5cdH0pO1xuXG5cdHZhciB2bSA9IHtcblx0XHR2YXJpYXRpb246IHZhcmlhdGlvbixcblx0XHRzdGF0ZTogc3RhdGUsXG5cblx0XHRjc3NDbGFzczogY3NzQ2xhc3NDb21wdXRlZCxcblx0XHRzdHlsZTogc3R5bGVDb21wdXRlZCxcblxuXHRcdGV2ZW50SGFuZGxlcnM6IHt9XG5cdH07XG5cblxuXHRmdW5jdGlvbiBjcmVhdGVFbmFibGVyKGJlaGF2aW91ciwgcHJvcHMpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZW5hYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0YmVoYXZpb3VyKHZtLCBjb25maWcpO1xuXHRcdFx0fSxcblx0XHRcdGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0XHRpZiAodm0uZXZlbnRIYW5kbGVyc1twcm9wXSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHZtLmV2ZW50SGFuZGxlcnNbcHJvcF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0dm0uYmVoYXZpb3VycyA9IHtcblx0XHRob3ZlcjogY3JlYXRlRW5hYmxlcihob3ZlckJlaGF2aW91ciwgW1wibW91c2VvdmVyXCIsIFwibW91c2VvdXRcIl0pLFxuXHRcdGZvY3VzOiBjcmVhdGVFbmFibGVyKGZvY3VzQmVoYXZpb3VyLCBbXCJmb2N1c1wiLCBcImJsdXJcIl0pLFxuXHRcdGNsaWNrOiBjcmVhdGVFbmFibGVyKGNsaWNrQmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKSxcblx0XHRzZWxlY3Q6IGNyZWF0ZUVuYWJsZXIoc2VsZWN0QmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKVxuXHR9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlVm07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwcmltYXJ5XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ0YWJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInBhZ2luYXRpb25cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlMFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5tZWRpdW1HcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxidXR0b24gZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRjbGljazogY2xpY2ssXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJ1wiPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogbGVmdEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBsZWZ0SWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdDwvc3ZnPlxcblx0PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtYmluZD1cInRleHQ6IGxhYmVsXCI+PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogcmlnaHRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+XFxuXHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogcmlnaHRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuPC9idXR0b24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihjb25maWcpIHtcblx0aWYgKCFjb25maWcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuY2xpY2sgJiYgdHlwZW9mIGNvbmZpZy5jbGljayAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY2xpY2sgaGFzIHRvIGJlIGEgZnVuY3Rpb24hXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubGFiZWwgJiYgIWNvbmZpZy5sZWZ0SWNvbiAmJiAhY29uZmlnLnJpZ2h0SWNvbiAmJiAhY29uZmlnLmljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlaXRoZXIgbGFiZWwvbGVmdGljb24vcmlnaHRpY29uL2ljb24gaGFzIHRvIGJlIGdpdmVuIVwiKTtcblx0fVxuXG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImJ1dHRvblwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS5iZWhhdmlvdXJzLmhvdmVyLmVuYWJsZSgpO1xuXG5cdGlmIChjb25maWcucmFkaW8pIHtcblx0XHR2bS5iZWhhdmlvdXJzLnNlbGVjdC5lbmFibGUoKTtcblx0fSBlbHNlIHtcblx0XHR2bS5iZWhhdmlvdXJzLmNsaWNrLmVuYWJsZSgpO1xuXHR9XG5cblx0dm0ubGVmdEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGVmdEljb24gfHwgY29uZmlnLmljb24pKTtcblx0dm0ucmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLnJpZ2h0SWNvbikpO1xuXHR2bS5sYWJlbCA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sYWJlbCkpO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG52YXIgYmFzZVZtID0gcmVxdWlyZShcIi4vYmFzZS92bVwiKTtcblxudmFyIGNyZWF0ZUJ1dHRvblN0eWxlID0gcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlXCIpO1xudmFyIGNyZWF0ZUlucHV0U3R5bGUgPSByZXF1aXJlKFwiLi9pbnB1dC9zdHlsZVwiKTtcblxuXG5mdW5jdGlvbiBpbml0S25vYih0aGVtZSkge1xuXG5cdHZhciBidXR0b25TdHlsZSA9IGNyZWF0ZUJ1dHRvblN0eWxlKHRoZW1lKTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItYnV0dG9uXCIsIHJlcXVpcmUoXCIuL2J1dHRvbi92bVwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWlucHV0XCIsIHJlcXVpcmUoXCIuL2lucHV0L3ZtXCIpLCByZXF1aXJlKFwiLi9pbnB1dC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVJbnB1dFN0eWxlKHRoZW1lKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1yYWRpb1wiLCByZXF1aXJlKFwiLi9yYWRpby92bVwiKSwgcmVxdWlyZShcIi4vcmFkaW8vdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbmxpbmUtdGV4dC1lZGl0b3JcIiwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci92bVwiKSwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2luYXRpb25cIiwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi92bVwiKSwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sXCIpLCBidXR0b25TdHlsZSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pdGVtcy1wZXItcGFnZVwiLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2Uvdm1cIiksIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2VkLWxpc3RcIiwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3ZtXCIpLCByZXF1aXJlKFwiLi9wYWdlZExpc3QvdGVtcGxhdGUuaHRtbFwiKSk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXRhYnNcIiwgcmVxdWlyZShcIi4vdGFicy92bVwiKSwgcmVxdWlyZShcIi4vdGFicy90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXRhYlwiLCByZXF1aXJlKFwiLi90YWJzL3RhYi92bVwiKSwgcmVxdWlyZShcIi4vdGFicy90YWIvdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdEtub2IsXG5cblx0cmVnaXN0ZXJDb21wb25lbnQ6IHJlZ2lzdGVyQ29tcG9uZW50LFxuXHRiYXNlOiB7XG5cdFx0dm06IGJhc2VWbVxuXHR9XG59O1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5yaWdodEljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucmlnaHRJY29uIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXHRpZiAoIWNvbmZpZy5pdGVtcykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblx0aWYgKGNvbmZpZy5zZWxlY3RlZCAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy5zZWxlY3RlZCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VsZWN0ZWQgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBzaG91bGQgbm90IGJlIGVtcHR5XCIpO1xuXHR9XG5cblx0dmFyIHJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoY29uZmlnLnJpZ2h0SWNvbik7XG5cblx0dmFyIG9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cblx0XHRpZiAoIWNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsICYmICFjb25maWcuaXRlbXNbaWR4XS5pY29uKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xuXHRcdH1cblx0XHRvcHRpb25zLnB1c2goY3JlYXRlT3B0aW9uKHtcblx0XHRcdGxhYmVsOiBjb25maWcuaXRlbXNbaWR4XS5sYWJlbCxcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXG5cdFx0XHR2YWx1ZTogY29uZmlnLml0ZW1zW2lkeF0udmFsdWVcblx0XHR9KSk7XG5cdH1cblxuXHQvLyBjb25zb2xlLmxvZyhvcHRpb25zKCkpO1xuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpW2NvbmZpZy5zZWxlY3RlZElkeCB8fCAwXSk7XG5cblx0dmFyIGRyb3Bkb3duVmlzaWJsZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGVEcm9wZG93blZpc2libGUoaXRlbSwgZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHZhciB2aXNpYmxlID0gZHJvcGRvd25WaXNpYmxlKCk7XG5cblx0XHRkcm9wZG93blZpc2libGUoIXZpc2libGUpO1xuXG5cdFx0Ly8gc2hvdWxkIHJlbW92ZSB0aGlzIHdoZW4gdGVzdCBpbiBwaGFudG9tanNcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh2aXNpYmxlKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVPcHRpb24oY29uZmlnKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXG5cdFx0XHRpY29uOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5pY29uKSxcblx0XHRcdHZhbHVlOiBjb25maWcudmFsdWUsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxlY3RlZChvYmopO1xuXHRcdFx0XHRkcm9wZG93blZpc2libGUudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxuXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbkRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPHNwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhZWRpdE1vZGUoKVwiPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB2YWx1ZVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBlZGl0LCBpY29uOiBcXCcjaWNvbi1lZGl0XFwnXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBlZGl0TW9kZVwiPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJ2YWx1ZTogZWRpdGVkVmFsdWUsIGhhc0ZvY3VzOiBpbnB1dEhhc0ZvY3VzLCBrZXlEb3duOiBrZXlEb3duLCB2aXNpYmxlOiBlZGl0TW9kZVwiPjwva25vYi1pbnB1dD5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBzYXZlLCBpY29uOiBcXCcjaWNvbi1kb25lXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBjYW5jZWwsIGljb246IFxcJyNpY29uLWNsb3NlXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L3NwYW4+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlubGluZVRleHRFZGl0b3IoY29uZmlnKSB7XG5cdHZhciB2bSA9IHt9O1xuXG5cdHZhciBjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKGNvbmZpZy52YWx1ZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudmFsdWUgaGFzIHRvIGJlIGFuIG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZShcIlwiKTtcblx0dm0uZWRpdGVkVmFsdWUgPSBrby5vYnNlcnZhYmxlKHZtLnZhbHVlKCkpO1xuXG5cdHZtLmVkaXRNb2RlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0dm0uZWRpdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLmVkaXRlZFZhbHVlKHZtLnZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKHRydWUpO1xuXHRcdHZtLmlucHV0SGFzRm9jdXModHJ1ZSk7XG5cdH07XG5cblx0dm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLnZhbHVlKHZtLmVkaXRlZFZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKGZhbHNlKTtcblx0fTtcblxuXHR2bS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XG5cdH07XG5cblx0dm0ua2V5RG93biA9IGZ1bmN0aW9uKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRyZXR1cm4gdm0uc2F2ZSgpO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuXHRcdFx0cmV0dXJuIHZtLmNhbmNlbCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHR2bS5pbnB1dEhhc0ZvY3VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlubGluZVRleHRFZGl0b3I7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5pbnB1dEJvcmRlclxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxpbnB1dCBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGF0dHI6IHt0eXBlOiB0eXBlfSxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGhhc0ZvY3VzOiBoYXNGb2N1cyxcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCcsXFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmhhc0ZvY3VzICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLmhhc0ZvY3VzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5oYXNGb2N1cyBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS5iZWhhdmlvdXJzLmhvdmVyLmVuYWJsZSgpO1xuXHR2bS5iZWhhdmlvdXJzLmZvY3VzLmVuYWJsZSgpO1xuXG5cdHZtLnR5cGUgPSBjb25maWcudHlwZTtcblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZSgpO1xuXHR2bS5oYXNGb2N1cyA9IGNvbmZpZy5oYXNGb2N1cyB8fCBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRpZiAoY29uZmlnLmtleURvd24pIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzLmtleWRvd24gPSBjb25maWcua2V5RG93bjtcblx0fVxuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVJbnB1dDtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJyxcXG5cdHNlbGVjdGVkOiBpdGVtc1BlclBhZ2UsXFxuXHRpdGVtczogaXRlbXNQZXJQYWdlTGlzdFwiPlxcbjwva25vYi1kcm9wZG93bj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJdGVtc1BlclBhZ2UoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5udW1PZkl0ZW1zKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm51bU9mSXRlbXMgZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcuaXRlbXNQZXJQYWdlTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuXG5cdFx0XHRpZiAoIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLnZhbHVlICYmICFjb25maWcuaXRlbXNQZXJQYWdlTGlzdFtpXS5sYWJlbCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciB2YWx1ZSBwcm9wZXJ0eVwiKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fVxuXG5cdHZhciBudW1PZkl0ZW1zID0gY29uZmlnLm51bU9mSXRlbXM7XG5cblx0dmFyIGl0ZW1zUGVyUGFnZUxpc3QgPSBjb25maWcuaXRlbXNQZXJQYWdlTGlzdCB8fCBbe1xuXHRcdGxhYmVsOiAxMCxcblx0XHR2YWx1ZTogMTBcblx0fSwge1xuXHRcdGxhYmVsOiAyNSxcblx0XHR2YWx1ZTogMjVcblx0fSwge1xuXHRcdGxhYmVsOiA1MCxcblx0XHR2YWx1ZTogNTBcblx0fSwge1xuXHRcdGxhYmVsOiAxMDAsXG5cdFx0dmFsdWU6IDEwMFxuXHR9XTtcblxuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZShpdGVtc1BlclBhZ2VMaXN0WzBdKTtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzIHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgbnVtT2ZJdGVtc1ZhbCA9IG51bU9mSXRlbXMoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRpZiAoIWl0ZW1zUGVyUGFnZVZhbCkge1xuXHRcdFx0cmV0dXJuIG51bU9mUGFnZXMoMCk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2UpIHtcblx0XHRcdGNvbmZpZy5pdGVtc1BlclBhZ2UoaXRlbXNQZXJQYWdlVmFsLnZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVtT2ZQYWdlcyhNYXRoLmNlaWwobnVtT2ZJdGVtc1ZhbCAvIGl0ZW1zUGVyUGFnZVZhbC52YWx1ZSkpO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdG51bU9mSXRlbXM6IG51bU9mSXRlbXMsXG5cdFx0aXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2UsXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcblxuXHRcdGl0ZW1zUGVyUGFnZUxpc3Q6IGl0ZW1zUGVyUGFnZUxpc3Rcblx0fTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGtub2JSZWdpc3RlckNvbXBvbmVudChuYW1lLCBjcmVhdGVWbSwgdGVtcGxhdGUsIHN0eWxlKSB7XG5cdGtvLmNvbXBvbmVudHMucmVnaXN0ZXIobmFtZSwge1xuXHRcdHZpZXdNb2RlbDoge1xuXHRcdFx0Y3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMsIGNvbXBvbmVudEluZm8pIHtcblx0XHRcdFx0cGFyYW1zLnN0eWxlID0gc3R5bGU7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVWbShwYXJhbXMsIGNvbXBvbmVudEluZm8pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtub2JSZWdpc3RlckNvbXBvbmVudDtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMaXN0KGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJzdG9yZVwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zdG9yZSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJmaWVsZHNcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInNvcnRcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc29ydCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJzZWFyY2hcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5zdG9yZSAhPT0gXCJvYmplY3RcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWFyY2ggbXVzdCBiZSBhbiBvYmplY3QhXCIpO1xuXHR9XG5cblx0aWYgKCEoY29uZmlnLmZpZWxkcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgbXVzdCBiZSBhbiBhcnJheSFcIik7XG5cdH1cblxuXHRpZiAoIShjb25maWcuc29ydCBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IG11c3QgYmUgYW4gYXJyYXkhXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcuc2VhcmNoICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBtdXN0IGJlIGEgc3RyaW5nIVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuZmllbGRzLmluZGV4T2YoY29uZmlnLnNlYXJjaCkgPT09IC0xKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmZpZWxkcyBtdXN0IGNvbnRhaW4gdGhlIHZhbHVlIG9mIGNvbmZpZy5zZWFyY2ghXCIpO1xuXHR9XG5cblx0dmFyIG9yZGVyRmllbGQ7XG5cblx0aWYgKGNvbmZpZy5vcmRlckJ5KSB7XG5cdFx0aWYgKHR5cGVvZiBjb25maWcub3JkZXJCeSAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9yZGVyQnkgbXVzdCBoYXZlIHRoZSBmb3JtYXQgb2YgeyA8a2V5PjogWzE7LTFdIH0gXCIpO1xuXHRcdH1cblxuXHRcdG9yZGVyRmllbGQgPSBPYmplY3Qua2V5cyhjb25maWcub3JkZXJCeSlbMF07XG5cdFx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihvcmRlckZpZWxkKSA9PT0gLTEgfHwgTWF0aC5hYnMoY29uZmlnLm9yZGVyQnlbb3JkZXJGaWVsZF0pICE9PSAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub3JkZXJCeSBtdXN0IGhhdmUgdGhlIGZvcm1hdCBvZiB7IDxrZXk+OiBbMTstMV0gfSBcIik7XG5cdFx0fVxuXHR9XG5cblx0Y29uZmlnLnNvcnQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihpdGVtLnZhbHVlKSA9PT0gLTEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInZhbHVlcyBvZiBjb25maWcuc29ydCBtdXN0IGJlIGluIGNvbmZpZy5maWVsZHMhXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXHR2YXIgZmllbGRzID0gY29uZmlnLmZpZWxkcztcblxuXHR2YXIgc2VhcmNoID0ga28ub2JzZXJ2YWJsZShcIlwiKS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiBjb25maWcudGhyb3R0bGUgfHwgNTAwXG5cdH0pO1xuXG5cdHZhciBzb3J0T3B0aW9ucyA9IFtdO1xuXG5cdHZhciBkZWZhdWx0T3JkZXJJZHg7XG5cblx0ZnVuY3Rpb24gY3JlYXRlUXVlcnlPYmoocHJvcCwgYXNjKSB7XG5cdFx0dmFyIG9iaiA9IHt9O1xuXG5cdFx0b2JqW3Byb3BdID0gYXNjO1xuXG5cdFx0aWYgKG9yZGVyRmllbGQgJiYgcHJvcCA9PT0gb3JkZXJGaWVsZCAmJiBhc2MgPT09IGNvbmZpZy5vcmRlckJ5W29yZGVyRmllbGRdKSB7XG5cdFx0XHRkZWZhdWx0T3JkZXJJZHggPSBzb3J0T3B0aW9ucy5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5zb3J0Lmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gY29uZmlnLnNvcnRbaWR4XTtcblxuXHRcdHNvcnRPcHRpb25zLnB1c2goe1xuXHRcdFx0aWNvbjogXCIjaWNvbi1zb3J0LWFzY1wiLFxuXHRcdFx0bGFiZWw6IGFjdC5sYWJlbCxcblx0XHRcdHZhbHVlOiBjcmVhdGVRdWVyeU9iaihhY3QudmFsdWUsIDEpXG5cdFx0fSk7XG5cdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtZGVzY1wiLFxuXHRcdFx0bGFiZWw6IGFjdC5sYWJlbCxcblx0XHRcdHZhbHVlOiBjcmVhdGVRdWVyeU9iaihhY3QudmFsdWUsIC0xKVxuXHRcdH0pO1xuXHR9XG5cblx0dmFyIHNvcnQgPSBrby5vYnNlcnZhYmxlKHNvcnRPcHRpb25zW2RlZmF1bHRPcmRlcklkeCB8fCAwXSk7XG5cdHZhciBzb3J0SWR4ID0gZGVmYXVsdE9yZGVySWR4IHx8IDA7XG5cblx0dmFyIHNraXAgPSBrby5vYnNlcnZhYmxlKDApO1xuXHR2YXIgbGltaXQgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHR9KTtcblxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblxuXHR2YXIgbG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VhcmNoVmFsID0gc2VhcmNoKCk7XG5cdFx0dmFyIHNvcnRWYWwgPSBzb3J0KCkudmFsdWU7XG5cdFx0dmFyIHNraXBWYWwgPSBza2lwKCk7XG5cdFx0dmFyIGxpbWl0VmFsID0gbGltaXQoKTtcblxuXHRcdHZhciBmaW5kID0ge307XG5cblx0XHRmaW5kW2NvbmZpZy5zZWFyY2hdID0gKG5ldyBSZWdFeHAoc2VhcmNoVmFsLCBcImlnXCIpKS50b1N0cmluZygpO1xuXG5cdFx0c3RvcmUuZmluZCA9IGZpbmQ7XG5cdFx0c3RvcmUuc29ydCA9IHNvcnRWYWw7XG5cdFx0c3RvcmUuc2tpcCA9IHNraXBWYWw7XG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdFZhbDtcblx0fSkuZXh0ZW5kKHtcblx0XHR0aHJvdHRsZTogMFxuXHR9KTtcblxuXHRmdW5jdGlvbiBiZWZvcmVMb2FkKCkge1xuXHRcdGlmIChsb2FkaW5nKCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTGlzdCBpcyBhbHJlYWR5IGxvYWRpbmcuLi5cIik7IC8vdGhpcyBtaWdodCBiZSBwcm9ibGVtYXRpYyBpZiB0aGVyZSBhcmUgbm8gZ29vZCB0aW1lb3V0IHNldHRpbmdzLlxuXHRcdH1cblxuXHRcdGxvYWRpbmcodHJ1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoZXJyKSB7XG5cdFx0bG9hZGluZyhmYWxzZSk7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKGVycik7XG5cdFx0fVxuXHRcdGVycm9yKG51bGwpO1xuXG5cdFx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdFx0fSk7XG5cblx0XHRjb3VudChzdG9yZS5jb3VudCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWFkT25seUNvbXB1dGVkKG9ic2VydmFibGUpIHtcblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYnNlcnZhYmxlKCk7XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aHJvdyBcIlRoaXMgY29tcHV0ZWQgdmFyaWFibGUgc2hvdWxkIG5vdCBiZSB3cml0dGVuLlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0c3RvcmU6IHN0b3JlLFxuXG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXG5cdFx0c2VhcmNoOiBzZWFyY2gsXG5cblx0XHRzb3J0OiBzb3J0LFxuXHRcdHNvcnRJZHg6IHNvcnRJZHgsXG5cdFx0c29ydE9wdGlvbnM6IHNvcnRPcHRpb25zLFxuXG5cdFx0c2tpcDogc2tpcCxcblx0XHRsaW1pdDogbGltaXQsXG5cblx0XHRpdGVtczogaXRlbXMsXG5cdFx0Y291bnQ6IHJlYWRPbmx5Q29tcHV0ZWQoY291bnQpLFxuXG5cdFx0bG9hZGluZzogcmVhZE9ubHlDb21wdXRlZChsb2FkaW5nKSxcblx0XHRlcnJvcjogcmVhZE9ubHlDb21wdXRlZChlcnJvcilcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdFwiPlxcblx0PCEtLSBrbyBpZjogZXJyb3IgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogZXJyb3JcIj48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcblxcblx0PGRpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2JhclwiPlxcblx0XHRcdDxpbnB1dCBjbGFzcz1cImtub2ItaW5wdXRcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBzZWFyY2gsIHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIi8+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwia25vYi1idXR0b24tc2VhcmNoXCIgcGFyYW1zPVwibGFiZWw6IFxcJ1xcJyxcXG5cdFx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1zZWFyY2hcXCdcIj5cXG5cdFx0XHQ8L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWl0ZW1zLXBlci1wYWdlIGNsYXNzPVwia25vYi1wYWdlbGlzdF9faXRlbXMtcGVyLXBhZ2VcIiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBjb3VudCxcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXMsXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPlxcblx0XHRcdDwva25vYi1pdGVtcy1wZXItcGFnZT5cXG5cdFx0XHQ8IS0tIGtvIGlmOiBzb3J0T3B0aW9ucy5sZW5ndGggPiAwIC0tPlxcblx0XHRcdFx0PGtub2ItZHJvcGRvd24gY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCIgcGFyYW1zPVwicmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJywgc2VsZWN0ZWRJZHg6IHNvcnRJZHgsIHNlbGVjdGVkOiBzb3J0LCBpdGVtczogc29ydE9wdGlvbnNcIj48L2tub2ItZHJvcGRvd24+XFxuXHRcdFx0PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdF9fcmVzdWx0XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YToge21vZGVsOiAkZGF0YSwgcGFyZW50OiAkcGFyZW50LCBpbmRleDogJGluZGV4fSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2Plxcblx0PCEtLVxcblx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBwYWdpbmF0aW9uLm51bU9mSXRlbXMsIGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQtLT5cXG5cdDwhLS0ga28gaWY6IG51bU9mUGFnZXMoKSA+IDAgLS0+XFxuXHRcdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgY3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cdDwhLS0ga28gaWY6ICRkYXRhLmxvYWRNb3JlIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICFsb2FkaW5nKCksIGNsaWNrOiBsb2FkTW9yZVwiPkxvYWQgbW9yZS4uLjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRcblx0aWYgKCFjb25maWcuc3RvcmUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3RvcmUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cblx0dmFyIGxpc3QgPSBjcmVhdGVMaXN0KGNvbmZpZyk7XG5cdC8vdmFyIHBhZ2luYXRpb24gPSBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZy5wYWdpbmF0aW9uKTtcblx0Ly9saXN0LnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuXG5cdHZhciBudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZSgpO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZSgxMCk7XG5cdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0bGlzdC5udW1PZlBhZ2VzID0gbnVtT2ZQYWdlcztcblx0bGlzdC5pdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2U7XG5cdGxpc3QuY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGxpc3Quc2tpcChjdXJyZW50UGFnZVZhbCAqIGl0ZW1zUGVyUGFnZVZhbCk7XG5cdFx0bGlzdC5saW1pdChpdGVtc1BlclBhZ2VWYWwpO1xuXHR9KTtcblxuXHQvKlxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY291bnQgPSBsaXN0LmNvdW50KCk7XG5cdFx0bGlzdC5wYWdpbmF0aW9uLm51bU9mSXRlbXMoY291bnQpO1xuXHR9KTtcblx0Ki9cblxuXHRmdW5jdGlvbiBiZWZvcmVMb2FkKCkge1xuXHRcdGxpc3QuaXRlbXMoW10pO1xuXHR9XG5cblx0cmV0dXJuIGxpc3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcGFnaW5hdGlvblwiIGRhdGEtYmluZD1cImlmOiBwYWdlU2VsZWN0b3JzKCkubGVuZ3RoXCI+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWZpcnN0LXBhZ2VcXCcsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogZmlyc3QoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBmaXJzdCgpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tY2hldnJvbi1sZWZ0XFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IHByZXYoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBwcmV2KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFnZVNlbGVjdG9yc1wiPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IGxhYmVsLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IHN0YXRlLFxcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IHNlbGVjdFBhZ2VcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1jaGV2cm9uLXJpZ2h0XFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IG5leHQoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBuZXh0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1sYXN0LXBhZ2VcXCcsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogbGFzdCgpLnN0YXRlLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IGxhc3QoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvbihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmIChjb25maWcuYWZ0ZXJIZWFkICYmIGNvbmZpZy5hZnRlckhlYWQgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmFmdGVySGVhZCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmJlZm9yZVRhaWwgJiYgY29uZmlnLmJlZm9yZVRhaWwgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJlZm9yZVRhaWwgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5iZWZvcmVDdXJyZW50ICYmIGNvbmZpZy5iZWZvcmVDdXJyZW50IDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iZWZvcmVDdXJyZW50IG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdGlmIChjb25maWcuYWZ0ZXJDdXJyZW50ICYmIGNvbmZpZy5hZnRlckN1cnJlbnQgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmFmdGVyQ3VycmVudCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHR2YXIgbnVtT2ZQYWdlcztcblxuXHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzKSkge1xuXHRcdG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcztcblx0fSBlbHNlIHtcblx0XHRudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcyB8fCAxMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPCAwKSB7XG5cdFx0XHR2YWx1ZSA9IDA7XG5cdFx0fVxuXG5cdFx0dmFyIHBhZ2VzTnVtID0gbnVtT2ZQYWdlcygpO1xuXG5cdFx0aWYgKHZhbHVlID49IHBhZ2VzTnVtKSB7XG5cdFx0XHR2YWx1ZSA9IHBhZ2VzTnVtIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHR2YXIgY3VycmVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZSgpO1xuXG5cdFx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRudW1PZlBhZ2VzKCk7XG5cdFx0XHRjdXJyZW50UGFnZSgwKTtcblx0XHR9KTtcblxuXHRcdGlmIChrby5pc09ic2VydmFibGUoY29uZmlnLmN1cnJlbnRQYWdlKSkge1xuXHRcdFx0Y3VycmVudFBhZ2UgPSBjb25maWcuY3VycmVudFBhZ2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZShub3JtYWxpemUoY29uZmlnLmN1cnJlbnRQYWdlKSB8fCAwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50UGFnZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRjdXJyZW50UGFnZShub3JtYWxpemUodmFsdWUpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSgpKTtcblxuXG5cblx0dmFyIGN1cnJlbnRQYWdlUmVhbElkeDtcblx0dmFyIHBhZ2VTZWxlY3RvcnMgPSAoZnVuY3Rpb24oY29uZmlnKSB7XG5cdFx0dmFyIGFmdGVySGVhZCA9IGNvbmZpZy5hZnRlckhlYWQgfHwgMjtcblx0XHR2YXIgYmVmb3JlVGFpbCA9IGNvbmZpZy5iZWZvcmVUYWlsIHx8IDI7XG5cdFx0dmFyIGJlZm9yZUN1cnJlbnQgPSBjb25maWcuYmVmb3JlQ3VycmVudCB8fCAyO1xuXHRcdHZhciBhZnRlckN1cnJlbnQgPSBjb25maWcuYWZ0ZXJDdXJyZW50IHx8IDI7XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogaWR4ICsgMSxcblx0XHRcdFx0c3RhdGU6IFwiZGVmYXVsdFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdXJyZW50UGFnZShpZHgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGxhYmVsKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRcdHN0YXRlOiBcImRpc2FibGVkXCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge31cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gW107XG5cblx0XHRcdHZhciBudW1PZlBhZ2VzVmFsID0gbnVtT2ZQYWdlcygpO1xuXHRcdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblxuXHRcdFx0dmFyIG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bU9mUGFnZXNWYWw7IGlkeCArPSAxKSB7XG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtIDEgfHwgaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpIHtcblx0XHRcdFx0XHR2YXIgcGFnZVNlbGVjdG9yO1xuXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gY3VycmVudFBhZ2VWYWwpIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGlkeCArIDEpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFBhZ2VSZWFsSWR4ID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKHBhZ2VTZWxlY3Rvcik7XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW5vbkNsaWNrYWJsZUluc2VydGVkKSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKFwiLi4uXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtZW50cztcblx0XHR9KTtcblx0fShjb25maWcpKTtcblxuXG5cdHZhciBuZXh0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCArIDE7XG5cblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRpZiAoaWR4ID49IHBhZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VzW2lkeF07XG5cdH0pO1xuXG5cdHZhciBwcmV2ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCAtIDE7XG5cblx0XHRpZiAoaWR4IDwgMCkge1xuXHRcdFx0aWR4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpW2lkeF07XG5cdH0pO1xuXG5cdHZhciBmaXJzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbMF07XG5cdH0pO1xuXG5cdHZhciBsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0cmV0dXJuIHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdO1xuXHR9KTtcblxuXG5cdHJldHVybiB7XG5cdFx0cGFnZVNlbGVjdG9yczogcGFnZVNlbGVjdG9ycyxcblxuXHRcdGZpcnN0OiBmaXJzdCxcblx0XHRsYXN0OiBsYXN0LFxuXG5cdFx0bmV4dDogbmV4dCxcblx0XHRwcmV2OiBwcmV2LFxuXG5cdFx0Y3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlLFxuXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlc1xuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXJhZGlvXCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRwYXJhbXM6IHtcXG5cdFx0XHRzdGF0ZTogaXNTZWxlY3RlZCgpID8gXFwnYWN0aXZlXFwnIDogXFwnZGVmYXVsdFxcJyxcXG5cdFx0XHR2YXJpYXRpb246ICRwYXJlbnQudmFyaWF0aW9uLFxcblx0XHRcdGxhYmVsOiBsYWJlbCxcXG5cdFx0XHRpY29uOiBpY29uLFxcblx0XHRcdHJhZGlvOiB0cnVlLFxcblx0XHRcdGdyb3VwOiBncm91cCxcXG5cdFx0XHRjbGljazogc2VsZWN0XFxuXHRcdH1cXG5cdH1cIj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5mdW5jdGlvbiBjcmVhdGVSYWRpbyhjb25maWcpIHtcblxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIHZtID0ge307XG5cblx0aWYgKGNvbmZpZy5pdGVtcy5sZW5ndGggPT09IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuaXRlbXMgc2hvdWxkIG5vdCBiZSBlbXB0eVwiKTtcblx0fVxuXG5cdHZtLnNlbGVjdGVkID0gY29uZmlnLnNlbGVjdGVkIHx8IGtvLm9ic2VydmFibGUoKTtcblx0dm0uc2VsZWN0ZWRJZHggPSBjb25maWcuc2VsZWN0ZWRJZHggfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdHZtLnZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblx0dm0uaXRlbXMgPSBbXTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXG5cdFx0dmFyIGFjdCA9IGNvbmZpZy5pdGVtc1tpZHhdO1xuXG5cdFx0aWYgKCFhY3QubGFiZWwgJiYgIWFjdC5pY29uKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xuXHRcdH1cblxuXHRcdHZtLml0ZW1zLnB1c2goY3JlYXRlSXRlbVZtKGFjdC5sYWJlbCwgYWN0Lmljb24sIGlkeCkpO1xuXHR9XG5cblx0dmFyIHNlbCA9IHZtLnNlbGVjdGVkSWR4KCk7XG5cblx0aWYgKHR5cGVvZiBzZWwgPT09IFwibnVtYmVyXCIpIHtcblx0XHRzZWwgPSBNYXRoLmZsb29yKHNlbCk7XG5cdFx0c2VsICU9IHZtLml0ZW1zLmxlbmd0aDtcblxuXHRcdHZtLml0ZW1zW3NlbF0uc2VsZWN0KCk7XG5cblx0fSBlbHNlIHtcblx0XHR2bS5pdGVtc1swXS5zZWxlY3QoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUl0ZW1WbShsYWJlbCwgaWNvbiwgaWR4KSB7XG5cblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0aWNvbjogaWNvbixcblx0XHRcdGdyb3VwOiBjb25maWcuZ3JvdXAsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2bS5zZWxlY3RlZChvYmopO1xuXHRcdFx0XHR2bS5zZWxlY3RlZElkeChpZHgpO1xuXHRcdFx0fSxcblx0XHRcdGlzU2VsZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JqID09PSB2bS5zZWxlY3RlZCgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJhZGlvO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGVcIj5cXG5cdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiAkcGFyZW50IH0gLS0+PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlVGFiKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdGNvbmZpZy5jb21wb25lbnQgPSBcInRhYlwiO1xuXHRjb25maWcudmFyaWF0aW9uID0gXCJ0YWJcIjtcblx0Y29uZmlnLnN0YXRlID0gXCJhY3RpdmVcIjtcblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItcmFkaW8gY2xhc3M9XCJrbm9iLXJhZGlvLS1pbmxpbmVcIiBwYXJhbXM9XCJcXG5cdFx0Z3JvdXA6IHRhYnNHcm91cCxcXG5cdFx0dmFyaWF0aW9uOiBcXCd0YWJcXCcsXFxuXHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0aXRlbXM6IGJ1dHRvbnNcIj5cXG5cdDwva25vYi1yYWRpbz5cXG5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFuZWxzXCI+XFxuXHRcdDxrbm9iLXRhYiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LnNlbGVjdGVkSWR4KCkgPT0gJGluZGV4KClcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2tub2ItdGFiPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBuZXh0VGFic0dyb3VwSWR4ID0gMDtcblxuZnVuY3Rpb24gY29udmVydFBhcmFtc1RvT2JqZWN0KHBhcmFtcykge1xuXHRwYXJhbXMgPSBwYXJhbXMucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XG5cblx0dmFyIHBhcmFtcyA9IHBhcmFtcy5zcGxpdChcIixcIik7XG5cblx0dmFyIGNvbnZlcnRlZFBhcmFtcyA9IFtdO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHBhcmFtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdCA9IHBhcmFtc1tpZHhdO1xuXG5cdFx0YWN0ID0gYWN0LnRyaW0oKTtcblxuXHRcdGFjdCA9IGFjdC5zcGxpdChcIjpcIik7XG5cblx0XHRpZiAoYWN0Lmxlbmd0aCAhPT0gMikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0YWN0ID0gXCJcXFwiXCIgKyBhY3RbMF0gKyBcIlxcXCJcIiArIFwiOlwiICsgYWN0WzFdO1xuXHRcdGNvbnZlcnRlZFBhcmFtcy5wdXNoKGFjdCk7XG5cdH1cblxuXHRyZXR1cm4gSlNPTi5wYXJzZShcIntcIiArIGNvbnZlcnRlZFBhcmFtcy5qb2luKFwiLFwiKSArIFwifVwiKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFicyhjb25maWcsIGNvbXBvbmVudEluZm8pIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb21wb25lbnRJbmZvID0gY29tcG9uZW50SW5mbyB8fCB7fTtcblx0Y29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzIHx8IFtdO1xuXG5cdHZhciBkZWZhdWx0VGFiID0gY29uZmlnLmRlZmF1bHRUYWIgfHwgMDtcblxuXHR2YXIgdm0gPSB7fTtcblxuXHR2YXIgdGFiQnV0dG9ucyA9IFtdO1xuXHR2YXIgdGFiUGFuZWxzID0gW107XG5cblx0dmFyIHRhYklkeCA9IDA7XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0VGVtcGxhdGVOb2RlID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzW2lkeF07XG5cblx0XHRpZiAoYWN0VGVtcGxhdGVOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwia25vYi10YWJcIikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFyIHRhYkJ1dHRvbkRhdGEgPSBjb252ZXJ0UGFyYW1zVG9PYmplY3QoYWN0VGVtcGxhdGVOb2RlLmdldEF0dHJpYnV0ZShcInBhcmFtc1wiKSk7XG5cblx0XHR0YWJCdXR0b25EYXRhLnRhYklkeCA9IHRhYklkeDtcblx0XHR0YWJJZHggKz0gMTtcblxuXHRcdHRhYkJ1dHRvbnMucHVzaCh0YWJCdXR0b25EYXRhKTtcblxuXHRcdHRhYlBhbmVscy5wdXNoKGFjdFRlbXBsYXRlTm9kZS5jaGlsZE5vZGVzKTtcblx0fVxuXG5cdGlmICh0YWJQYW5lbHMubGVuZ3RoIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImtub2ItdGFicyBjb21wb25lbnQgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIGtub2ItdGFiIGNvbXBvbmVudCBhcyBhIGNoaWxkIGNvbXBvbmVudCFcIik7XG5cdH1cblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0YWJCdXR0b25zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gdGFiQnV0dG9uc1tpZHhdO1xuXG5cdFx0aWYgKCFhY3QuaWNvbiAmJiAhYWN0LmxlZnRJY29uICYmICFhY3QucmlnaHRJY29uICYmICFhY3QubGFiZWwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBjaGlsZCBrbm9iLXRhYiBjb21wb25lbnRzIHNob3VsZCBoYXZlIHByb3BlciBwYXJhbXMgKGljb24gYW5kL29yIGxhYmVsKSBqdXN0IGxpa2Ugd2l0aCBidXR0b25zIVwiKTtcblx0XHR9XG5cdH1cblxuXHR2bS50YWJzR3JvdXAgPSBcInRhYnNHcm91cF9cIiArIG5leHRUYWJzR3JvdXBJZHg7XG5cdG5leHRUYWJzR3JvdXBJZHggKz0gMTtcblxuXHR2bS5zZWxlY3RlZElkeCA9IGtvLm9ic2VydmFibGUoZGVmYXVsdFRhYik7XG5cblx0dm0uYnV0dG9ucyA9IHRhYkJ1dHRvbnM7XG5cdHZtLnBhbmVscyA9IHRhYlBhbmVscztcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVGFicztcbiJdfQ==
