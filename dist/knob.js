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

		var sortContainsOrderField = false;

		config.sort.forEach(function(item) {
			if (item.value === orderField) {
				sortContainsOrderField = true;
				return;
			}
		});

		if (!sortContainsOrderField) {
			throw new Error("config.sort must contain the value of config.orderBy!");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbCIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2VkTGlzdC92bS5qcyIsInNyYy9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnaW5hdGlvbi92bS5qcyIsInNyYy9yYWRpby90ZW1wbGF0ZS5odG1sIiwic3JjL3JhZGlvL3ZtLmpzIiwic3JjL3RhYnMvdGFiL3RlbXBsYXRlLmh0bWwiLCJzcmMvdGFicy90YWIvdm0uanMiLCJzcmMvdGFicy90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsaWNrQmVoYXZpb3VyKHZtKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlZG93biA9IG1vdXNlRG93bjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZXVwID0gbW91c2VVcDtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvY3VzQmVoYXZpb3VyKHZtKSB7XG5cblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZSh2bS5zdGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvY3VzKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmx1cigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLmZvY3VzID0gZm9jdXM7XG5cdHZtLmV2ZW50SGFuZGxlcnMuYmx1ciA9IGJsdXI7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob3ZlckJlaGF2aW91cih2bSkge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dmFyIHByZXZpb3VzU3RhdGU7XG5cblx0ZnVuY3Rpb24gbW91c2VPdmVyKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChhY3RTdGF0ZSAhPT0gXCJob3ZlclwiKSB7XG5cdFx0XHRwcmV2aW91c1N0YXRlID0gYWN0U3RhdGU7XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlT3V0KCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKHByZXZpb3VzU3RhdGUpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZW92ZXIgPSBtb3VzZU92ZXI7XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2VvdXQgPSBtb3VzZU91dDtcblxuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHZtcyA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdEJlaGF2aW91cih2bSwgY29uZmlnKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBncm91cCA9IGNvbmZpZy5ncm91cCB8fCBcImRlZmF1bHRcIjtcblxuXHRpZiAoIXZtc1tncm91cF0pIHtcblx0XHR2bXNbZ3JvdXBdID0gW107XG5cdH1cblxuXHR2bXNbZ3JvdXBdLnB1c2godm0pO1xuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGFjdEdyb3VwVm1zID0gdm1zW2dyb3VwXTtcblxuXHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFjdEdyb3VwVm1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHRcdHZhciBhY3RWbSA9IGFjdEdyb3VwVm1zW2lkeF07XG5cblx0XHRcdGlmIChhY3RWbSA9PT0gdm0pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGFjdFZtLnN0YXRlKFwiZGVmYXVsdFwiKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlZG93biA9IG1vdXNlRG93bjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZXVwID0gbW91c2VVcDtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG52YXIgaG92ZXJCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2hvdmVyXCIpO1xudmFyIGZvY3VzQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9mb2N1c1wiKTtcbnZhciBjbGlja0JlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvY2xpY2tcIik7XG52YXIgc2VsZWN0QmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9zZWxlY3RcIik7XG5cblxuZnVuY3Rpb24gY3JlYXRlQmFzZVZtKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuY29tcG9uZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmNvbXBvbmVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuc3R5bGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3R5bGUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdHZhciBjb21wb25lbnQgPSBjb25maWcuY29tcG9uZW50O1xuXHR2YXIgc3R5bGUgPSBjb25maWcuc3R5bGU7XG5cblx0dmFyIHN0YXRlID0ga28ub2JzZXJ2YWJsZShjb25maWcuc3RhdGUgfHwgXCJkZWZhdWx0XCIpO1xuXHR2YXIgdmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXG5cdHZhciBjc3NDbGFzc0NvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFwia25vYi1cIiArIGNvbXBvbmVudCArIFwiIHN0YXRlLVwiICsgc3RhdGUoKSArIFwiIHZhcmlhdGlvbi1cIiArIHZhcmlhdGlvbjtcblx0fSk7XG5cdHZhciBzdHlsZUNvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN0YXRlVmFsID0gc3RhdGUoKTtcblxuXHRcdHJldHVybiBzdHlsZVt2YXJpYXRpb25dW3N0YXRlVmFsXTtcblx0fSk7XG5cblx0dmFyIHZtID0ge1xuXHRcdHZhcmlhdGlvbjogdmFyaWF0aW9uLFxuXHRcdHN0YXRlOiBzdGF0ZSxcblxuXHRcdGNzc0NsYXNzOiBjc3NDbGFzc0NvbXB1dGVkLFxuXHRcdHN0eWxlOiBzdHlsZUNvbXB1dGVkLFxuXG5cdFx0ZXZlbnRIYW5kbGVyczoge31cblx0fTtcblxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUVuYWJsZXIoYmVoYXZpb3VyLCBwcm9wcykge1xuXHRcdHJldHVybiB7XG5cdFx0XHRlbmFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRiZWhhdmlvdXIodm0sIGNvbmZpZyk7XG5cdFx0XHR9LFxuXHRcdFx0ZGlzYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdFx0XHRcdGlmICh2bS5ldmVudEhhbmRsZXJzW3Byb3BdKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgdm0uZXZlbnRIYW5kbGVyc1twcm9wXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHR2bS5iZWhhdmlvdXJzID0ge1xuXHRcdGhvdmVyOiBjcmVhdGVFbmFibGVyKGhvdmVyQmVoYXZpb3VyLCBbXCJtb3VzZW92ZXJcIiwgXCJtb3VzZW91dFwiXSksXG5cdFx0Zm9jdXM6IGNyZWF0ZUVuYWJsZXIoZm9jdXNCZWhhdmlvdXIsIFtcImZvY3VzXCIsIFwiYmx1clwiXSksXG5cdFx0Y2xpY2s6IGNyZWF0ZUVuYWJsZXIoY2xpY2tCZWhhdmlvdXIsIFtcIm1vdXNlZG93blwiLCBcIm1vdXNldXBcIl0pLFxuXHRcdHNlbGVjdDogY3JlYXRlRW5hYmxlcihzZWxlY3RCZWhhdmlvdXIsIFtcIm1vdXNlZG93blwiLCBcIm1vdXNldXBcIl0pXG5cdH07XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VWbTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInByaW1hcnlcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInRhYlwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicGFnaW5hdGlvblwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGUwXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGNsaWNrOiBjbGljayxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImxhYmVsXCIgZGF0YS1iaW5kPVwidGV4dDogbGFiZWxcIj48L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiByaWdodEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiByaWdodEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPlxcblx0XHQ8L3N2Zz5cXG5cdDwvc3Bhbj5cXG48L2J1dHRvbj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKGNvbmZpZykge1xuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5jbGljayAmJiB0eXBlb2YgY29uZmlnLmNsaWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjbGljayBoYXMgdG8gYmUgYSBmdW5jdGlvbiFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5sYWJlbCAmJiAhY29uZmlnLmxlZnRJY29uICYmICFjb25maWcucmlnaHRJY29uICYmICFjb25maWcuaWNvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImVpdGhlciBsYWJlbC9sZWZ0aWNvbi9yaWdodGljb24vaWNvbiBoYXMgdG8gYmUgZ2l2ZW4hXCIpO1xuXHR9XG5cblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiYnV0dG9uXCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHZtLmJlaGF2aW91cnMuaG92ZXIuZW5hYmxlKCk7XG5cblx0aWYgKGNvbmZpZy5yYWRpbykge1xuXHRcdHZtLmJlaGF2aW91cnMuc2VsZWN0LmVuYWJsZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHZtLmJlaGF2aW91cnMuY2xpY2suZW5hYmxlKCk7XG5cdH1cblxuXHR2bS5sZWZ0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sZWZ0SWNvbiB8fCBjb25maWcuaWNvbikpO1xuXHR2bS5yaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcucmlnaHRJY29uKSk7XG5cdHZtLmxhYmVsID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxhYmVsKSk7XG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuXHR2bS5jbGljayA9IGNvbmZpZy5jbGljayB8fCBmdW5jdGlvbigpIHt9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b247XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxuLy8qL1xuXG4vL1RISVMgRklMRSBTSE9VTEQgQkUgR0VORVJBVEVEXG5cbnZhciByZWdpc3RlckNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2tub2JSZWdpc3RlckNvbXBvbmVudFwiKTtcbnZhciBiYXNlVm0gPSByZXF1aXJlKFwiLi9iYXNlL3ZtXCIpO1xuXG52YXIgY3JlYXRlQnV0dG9uU3R5bGUgPSByZXF1aXJlKFwiLi9idXR0b24vc3R5bGVcIik7XG52YXIgY3JlYXRlSW5wdXRTdHlsZSA9IHJlcXVpcmUoXCIuL2lucHV0L3N0eWxlXCIpO1xuXG5cbmZ1bmN0aW9uIGluaXRLbm9iKHRoZW1lKSB7XG5cblx0dmFyIGJ1dHRvblN0eWxlID0gY3JlYXRlQnV0dG9uU3R5bGUodGhlbWUpO1xuXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItaW5wdXRcIiwgcmVxdWlyZShcIi4vaW5wdXQvdm1cIiksIHJlcXVpcmUoXCIuL2lucHV0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZUlucHV0U3R5bGUodGhlbWUpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXJhZGlvXCIsIHJlcXVpcmUoXCIuL3JhZGlvL3ZtXCIpLCByZXF1aXJlKFwiLi9yYWRpby90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWlubGluZS10ZXh0LWVkaXRvclwiLCByZXF1aXJlKFwiLi9pbmxpbmVUZXh0RWRpdG9yL3ZtXCIpLCByZXF1aXJlKFwiLi9pbmxpbmVUZXh0RWRpdG9yL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItZHJvcGRvd25cIiwgcmVxdWlyZShcIi4vZHJvcGRvd24vdm1cIiksIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnaW5hdGlvblwiLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3ZtXCIpLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWl0ZW1zLXBlci1wYWdlXCIsIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS92bVwiKSwgcmVxdWlyZShcIi4vaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnZWQtbGlzdFwiLCByZXF1aXJlKFwiLi9wYWdlZExpc3Qvdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sXCIpKTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFic1wiLCByZXF1aXJlKFwiLi90YWJzL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFiXCIsIHJlcXVpcmUoXCIuL3RhYnMvdGFiL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RhYi90ZW1wbGF0ZS5odG1sXCIpLCBidXR0b25TdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0S25vYixcblxuXHRyZWdpc3RlckNvbXBvbmVudDogcmVnaXN0ZXJDb21wb25lbnQsXG5cdGJhc2U6IHtcblx0XHR2bTogYmFzZVZtXG5cdH1cbn07XG4vLyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCI+XFxuXHQ8IS0tIHdpdGggcGFyYW1zLCB0aGUgc2VsZWN0ZWQoKS5sYWJlbCB3b25cXCd0IGJlIHJlY2FsY3VsYXRlZCwgd2hlbiBzZWxlY3RlZCBpcyBjaGFuZ2VkLi4uIC0tPlxcblx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogc2VsZWN0ZWQoKS5sYWJlbCxcXG5cdFx0XHRcdFx0XHRpY29uOiBzZWxlY3RlZCgpLmljb24sXFxuXHRcdFx0XHRcdFx0cmlnaHRJY29uOiByaWdodEljb24sXFxuXHRcdFx0XHRcdFx0Y2xpY2s6IGRyb3Bkb3duVmlzaWJsZS50b2dnbGV9fVwiPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93bi1tZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogb3B0aW9ucywgdmlzaWJsZTogZHJvcGRvd25WaXNpYmxlXCI+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRcdHBhcmFtczoge2xhYmVsOiBsYWJlbCwgaWNvbjogaWNvbiwgY2xpY2s6IHNlbGVjdH19LCBcXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6ICRkYXRhICE9PSAkcGFyZW50LnNlbGVjdGVkKClcIj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Ecm9wZG93bihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLnJpZ2h0SWNvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5yaWdodEljb24gZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cdGlmICghY29uZmlnLml0ZW1zKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLml0ZW1zIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXHRpZiAoY29uZmlnLnNlbGVjdGVkICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnNlbGVjdGVkKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWxlY3RlZCBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLml0ZW1zIHNob3VsZCBub3QgYmUgZW1wdHlcIik7XG5cdH1cblxuXHR2YXIgcmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShjb25maWcucmlnaHRJY29uKTtcblxuXHR2YXIgb3B0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLml0ZW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblxuXHRcdGlmICghY29uZmlnLml0ZW1zW2lkeF0ubGFiZWwgJiYgIWNvbmZpZy5pdGVtc1tpZHhdLmljb24pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIGljb24gcHJvcGVydHlcIik7XG5cdFx0fVxuXHRcdG9wdGlvbnMucHVzaChjcmVhdGVPcHRpb24oe1xuXHRcdFx0bGFiZWw6IGNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsLFxuXHRcdFx0aWNvbjogY29uZmlnLml0ZW1zW2lkeF0uaWNvbixcblx0XHRcdHZhbHVlOiBjb25maWcuaXRlbXNbaWR4XS52YWx1ZVxuXHRcdH0pKTtcblx0fVxuXG5cdC8vIGNvbnNvbGUubG9nKG9wdGlvbnMoKSk7XG5cblx0dmFyIHNlbGVjdGVkID0gY29uZmlnLnNlbGVjdGVkIHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHRzZWxlY3RlZChvcHRpb25zKClbY29uZmlnLnNlbGVjdGVkSWR4IHx8IDBdKTtcblxuXHR2YXIgZHJvcGRvd25WaXNpYmxlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0ZHJvcGRvd25WaXNpYmxlLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZURyb3Bkb3duVmlzaWJsZShpdGVtLCBldmVudCkge1xuXHRcdGlmIChldmVudCkge1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0dmFyIHZpc2libGUgPSBkcm9wZG93blZpc2libGUoKTtcblxuXHRcdGRyb3Bkb3duVmlzaWJsZSghdmlzaWJsZSk7XG5cblx0XHQvLyBzaG91bGQgcmVtb3ZlIHRoaXMgd2hlbiB0ZXN0IGluIHBoYW50b21qc1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHZpc2libGUpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihjb25maWcpIHtcblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGtvLm9ic2VydmFibGUoY29uZmlnLmxhYmVsKSxcblx0XHRcdGljb246IGtvLm9ic2VydmFibGUoY29uZmlnLmljb24pLFxuXHRcdFx0dmFsdWU6IGNvbmZpZy52YWx1ZSxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cmlnaHRJY29uOiByaWdodEljb24sXG5cblx0XHRzZWxlY3RlZDogc2VsZWN0ZWQsXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcblxuXHRcdGRyb3Bkb3duVmlzaWJsZTogZHJvcGRvd25WaXNpYmxlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uRHJvcGRvd247XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8c3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cInZpc2libGU6ICFlZGl0TW9kZSgpXCI+XFxuXHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHZhbHVlXCI+PC9zcGFuPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IFxcJ1xcJywgY2xpY2s6IGVkaXQsIGljb246IFxcJyNpY29uLWVkaXRcXCdcIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cInZpc2libGU6IGVkaXRNb2RlXCI+XFxuXHRcdDxrbm9iLWlucHV0IHBhcmFtcz1cInZhbHVlOiBlZGl0ZWRWYWx1ZSwgaGFzRm9jdXM6IGlucHV0SGFzRm9jdXMsIGtleURvd246IGtleURvd24sIHZpc2libGU6IGVkaXRNb2RlXCI+PC9rbm9iLWlucHV0Plxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IFxcJ1xcJywgY2xpY2s6IHNhdmUsIGljb246IFxcJyNpY29uLWRvbmVcXCdcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IFxcJ1xcJywgY2xpY2s6IGNhbmNlbCwgaWNvbjogXFwnI2ljb24tY2xvc2VcXCdcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcbjwvc3Bhbj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24gY3JlYXRlSW5saW5lVGV4dEVkaXRvcihjb25maWcpIHtcblx0dmFyIHZtID0ge307XG5cblx0dmFyIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBoYXMgdG8gYmUgYW4gb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKFwiXCIpO1xuXHR2bS5lZGl0ZWRWYWx1ZSA9IGtvLm9ic2VydmFibGUodm0udmFsdWUoKSk7XG5cblx0dm0uZWRpdE1vZGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHR2bS5lZGl0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dm0uZWRpdGVkVmFsdWUodm0udmFsdWUoKSk7XG5cdFx0dm0uZWRpdE1vZGUodHJ1ZSk7XG5cdFx0dm0uaW5wdXRIYXNGb2N1cyh0cnVlKTtcblx0fTtcblxuXHR2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dm0udmFsdWUodm0uZWRpdGVkVmFsdWUoKSk7XG5cdFx0dm0uZWRpdE1vZGUoZmFsc2UpO1xuXHR9O1xuXG5cdHZtLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLmVkaXRNb2RlKGZhbHNlKTtcblx0fTtcblxuXHR2bS5rZXlEb3duID0gZnVuY3Rpb24oaXRlbSwgZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcblx0XHRcdHJldHVybiB2bS5zYXZlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7XG5cdFx0XHRyZXR1cm4gdm0uY2FuY2VsKCk7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cdHZtLmlucHV0SGFzRm9jdXMgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlSW5saW5lVGV4dEVkaXRvcjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLmlucHV0Qm9yZGVyXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUucHJpbWFyeUNvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5saWdodEdyYXlcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGlucHV0IGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZSxcXG5cdFx0XHRcdFx0YXR0cjoge3R5cGU6IHR5cGV9LFxcblx0XHRcdFx0XHRldmVudDogZXZlbnRIYW5kbGVycyxcXG5cdFx0XHRcdFx0aGFzRm9jdXM6IGhhc0ZvY3VzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJyxcXG5cdFx0XHRcdFx0dmFsdWU6IHZhbHVlLFxcblx0XHRcdFx0XHR2YWx1ZVVwZGF0ZTogXFwnYWZ0ZXJrZXlkb3duXFwnXCIgLz4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlSW5wdXQoY29uZmlnKSB7XG5cblx0aWYgKCFjb25maWcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcudmFsdWUgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcudmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZhbHVlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuaGFzRm9jdXMgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcuaGFzRm9jdXMpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmhhc0ZvY3VzIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcblx0fVxuXG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImlucHV0XCI7XG5cdGNvbmZpZy50eXBlID0gY29uZmlnLnR5cGUgfHwgXCJ0ZXh0XCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHZtLmJlaGF2aW91cnMuaG92ZXIuZW5hYmxlKCk7XG5cdHZtLmJlaGF2aW91cnMuZm9jdXMuZW5hYmxlKCk7XG5cblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLmhhc0ZvY3VzID0gY29uZmlnLmhhc0ZvY3VzIHx8IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGlmIChjb25maWcua2V5RG93bikge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMua2V5ZG93biA9IGNvbmZpZy5rZXlEb3duO1xuXHR9XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlucHV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1zUGVyUGFnZShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLm51bU9mSXRlbXMpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubnVtT2ZJdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG5cblx0XHRcdGlmICghY29uZmlnLml0ZW1zUGVyUGFnZUxpc3RbaV0udmFsdWUgJiYgIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLmxhYmVsKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIHZhbHVlIHByb3BlcnR5XCIpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0dmFyIG51bU9mSXRlbXMgPSBjb25maWcubnVtT2ZJdGVtcztcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XG5cdFx0bGFiZWw6IDEwLFxuXHRcdHZhbHVlOiAxMFxuXHR9LCB7XG5cdFx0bGFiZWw6IDI1LFxuXHRcdHZhbHVlOiAyNVxuXHR9LCB7XG5cdFx0bGFiZWw6IDUwLFxuXHRcdHZhbHVlOiA1MFxuXHR9LCB7XG5cdFx0bGFiZWw6IDEwMCxcblx0XHR2YWx1ZTogMTAwXG5cdH1dO1xuXG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKGl0ZW1zUGVyUGFnZUxpc3RbMF0pO1xuXG5cdHZhciBudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXMgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBudW1PZkl0ZW1zVmFsID0gbnVtT2ZJdGVtcygpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGlmICghaXRlbXNQZXJQYWdlVmFsKSB7XG5cdFx0XHRyZXR1cm4gbnVtT2ZQYWdlcygwKTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZSkge1xuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxuXG5cdFx0aXRlbXNQZXJQYWdlTGlzdDogaXRlbXNQZXJQYWdlTGlzdFxuXHR9O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24ga25vYlJlZ2lzdGVyQ29tcG9uZW50KG5hbWUsIGNyZWF0ZVZtLCB0ZW1wbGF0ZSwgc3R5bGUpIHtcblx0a28uY29tcG9uZW50cy5yZWdpc3RlcihuYW1lLCB7XG5cdFx0dmlld01vZGVsOiB7XG5cdFx0XHRjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcywgY29tcG9uZW50SW5mbykge1xuXHRcdFx0XHRwYXJhbXMuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVZtKHBhcmFtcywgY29tcG9uZW50SW5mbyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga25vYlJlZ2lzdGVyQ29tcG9uZW50O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInN0b3JlXCIpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0b3JlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImZpZWxkc1wiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic29ydFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInNlYXJjaFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWFyY2ggaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLnN0b3JlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBtdXN0IGJlIGFuIG9iamVjdCFcIik7XG5cdH1cblxuXHRpZiAoIShjb25maWcuZmllbGRzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmZpZWxkcyBtdXN0IGJlIGFuIGFycmF5IVwiKTtcblx0fVxuXG5cdGlmICghKGNvbmZpZy5zb3J0IGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgbXVzdCBiZSBhbiBhcnJheSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5zZWFyY2ggIT09IFwic3RyaW5nXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIG11c3QgYmUgYSBzdHJpbmchXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihjb25maWcuc2VhcmNoKSA9PT0gLTEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIG11c3QgY29udGFpbiB0aGUgdmFsdWUgb2YgY29uZmlnLnNlYXJjaCFcIik7XG5cdH1cblxuXHR2YXIgb3JkZXJGaWVsZDtcblxuXHRpZiAoY29uZmlnLm9yZGVyQnkpIHtcblx0XHRpZiAodHlwZW9mIGNvbmZpZy5vcmRlckJ5ICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub3JkZXJCeSBtdXN0IGhhdmUgdGhlIGZvcm1hdCBvZiB7IDxrZXk+OiBbMTstMV0gfSBcIik7XG5cdFx0fVxuXG5cdFx0b3JkZXJGaWVsZCA9IE9iamVjdC5rZXlzKGNvbmZpZy5vcmRlckJ5KVswXTtcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKG9yZGVyRmllbGQpID09PSAtMSB8fCBNYXRoLmFicyhjb25maWcub3JkZXJCeVtvcmRlckZpZWxkXSkgIT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5vcmRlckJ5IG11c3QgaGF2ZSB0aGUgZm9ybWF0IG9mIHsgPGtleT46IFsxOy0xXSB9IFwiKTtcblx0XHR9XG5cblx0XHR2YXIgc29ydENvbnRhaW5zT3JkZXJGaWVsZCA9IGZhbHNlO1xuXG5cdFx0Y29uZmlnLnNvcnQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRpZiAoaXRlbS52YWx1ZSA9PT0gb3JkZXJGaWVsZCkge1xuXHRcdFx0XHRzb3J0Q29udGFpbnNPcmRlckZpZWxkID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFzb3J0Q29udGFpbnNPcmRlckZpZWxkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc29ydCBtdXN0IGNvbnRhaW4gdGhlIHZhbHVlIG9mIGNvbmZpZy5vcmRlckJ5IVwiKTtcblx0XHR9XG5cdH1cblxuXHRjb25maWcuc29ydC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKGl0ZW0udmFsdWUpID09PSAtMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwidmFsdWVzIG9mIGNvbmZpZy5zb3J0IG11c3QgYmUgaW4gY29uZmlnLmZpZWxkcyFcIik7XG5cdFx0fVxuXHR9KTtcblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cdHZhciBmaWVsZHMgPSBjb25maWcuZmllbGRzO1xuXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IGNvbmZpZy50aHJvdHRsZSB8fCA1MDBcblx0fSk7XG5cblx0dmFyIHNvcnRPcHRpb25zID0gW107XG5cblx0dmFyIGRlZmF1bHRPcmRlcklkeDtcblxuXHRmdW5jdGlvbiBjcmVhdGVRdWVyeU9iaihwcm9wLCBhc2MpIHtcblx0XHR2YXIgb2JqID0ge307XG5cblx0XHRvYmpbcHJvcF0gPSBhc2M7XG5cblx0XHRpZiAob3JkZXJGaWVsZCAmJiBwcm9wID09PSBvcmRlckZpZWxkICYmIGFzYyA9PT0gY29uZmlnLm9yZGVyQnlbb3JkZXJGaWVsZF0pIHtcblx0XHRcdGRlZmF1bHRPcmRlcklkeCA9IHNvcnRPcHRpb25zLmxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLnNvcnQubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3QgPSBjb25maWcuc29ydFtpZHhdO1xuXG5cdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtYXNjXCIsXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgMSlcblx0XHR9KTtcblx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdGljb246IFwiI2ljb24tc29ydC1kZXNjXCIsXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgLTEpXG5cdFx0fSk7XG5cdH1cblxuXHR2YXIgc29ydCA9IGtvLm9ic2VydmFibGUoc29ydE9wdGlvbnNbZGVmYXVsdE9yZGVySWR4IHx8IDBdKTtcblx0dmFyIHNvcnRJZHggPSBkZWZhdWx0T3JkZXJJZHggfHwgMDtcblxuXHR2YXIgc2tpcCA9IGtvLm9ic2VydmFibGUoMCk7XG5cdHZhciBsaW1pdCA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0dmFyIGl0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdH0pO1xuXG5cdHZhciBjb3VudCA9IGtvLm9ic2VydmFibGUoMCk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXG5cdHZhciBsb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXHR2YXIgZXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5P1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWFyY2hWYWwgPSBzZWFyY2goKTtcblx0XHR2YXIgc29ydFZhbCA9IHNvcnQoKS52YWx1ZTtcblx0XHR2YXIgc2tpcFZhbCA9IHNraXAoKTtcblx0XHR2YXIgbGltaXRWYWwgPSBsaW1pdCgpO1xuXG5cdFx0dmFyIGZpbmQgPSB7fTtcblxuXHRcdGZpbmRbY29uZmlnLnNlYXJjaF0gPSAobmV3IFJlZ0V4cChzZWFyY2hWYWwsIFwiaWdcIikpLnRvU3RyaW5nKCk7XG5cblx0XHRzdG9yZS5maW5kID0gZmluZDtcblx0XHRzdG9yZS5zb3J0ID0gc29ydFZhbDtcblx0XHRzdG9yZS5za2lwID0gc2tpcFZhbDtcblx0XHRzdG9yZS5saW1pdCA9IGxpbWl0VmFsO1xuXHR9KS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiAwXG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGJlZm9yZUxvYWQoKSB7XG5cdFx0aWYgKGxvYWRpbmcoKSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJMaXN0IGlzIGFscmVhZHkgbG9hZGluZy4uLlwiKTsgLy90aGlzIG1pZ2h0IGJlIHByb2JsZW1hdGljIGlmIHRoZXJlIGFyZSBubyBnb29kIHRpbWVvdXQgc2V0dGluZ3MuXG5cdFx0fVxuXG5cdFx0bG9hZGluZyh0cnVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZChlcnIpIHtcblx0XHRsb2FkaW5nKGZhbHNlKTtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoZXJyKTtcblx0XHR9XG5cdFx0ZXJyb3IobnVsbCk7XG5cblx0XHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdGNvdW50KHN0b3JlLmNvdW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRPbmx5Q29tcHV0ZWQob2JzZXJ2YWJsZSkge1xuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9ic2VydmFibGUoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRocm93IFwiVGhpcyBjb21wdXRlZCB2YXJpYWJsZSBzaG91bGQgbm90IGJlIHdyaXR0ZW4uXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cdHN0b3JlLmxvYWQuYWZ0ZXIuYWRkKGFmdGVyTG9hZCk7XG5cblx0cmV0dXJuIHtcblx0XHRzdG9yZTogc3RvcmUsXG5cblx0XHRmaWVsZHM6IGZpZWxkcywgLy9zaG91bGQgZmlsdGVyIHRvIHRoZSBmaWVsZHMuIChzZWxlY3QpXG5cblx0XHRzZWFyY2g6IHNlYXJjaCxcblxuXHRcdHNvcnQ6IHNvcnQsXG5cdFx0c29ydElkeDogc29ydElkeCxcblx0XHRzb3J0T3B0aW9uczogc29ydE9wdGlvbnMsXG5cblx0XHRza2lwOiBza2lwLFxuXHRcdGxpbWl0OiBsaW1pdCxcblxuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRjb3VudDogcmVhZE9ubHlDb21wdXRlZChjb3VudCksXG5cblx0XHRsb2FkaW5nOiByZWFkT25seUNvbXB1dGVkKGxvYWRpbmcpLFxuXHRcdGVycm9yOiByZWFkT25seUNvbXB1dGVkKGVycm9yKVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0XCI+XFxuXHQ8IS0tIGtvIGlmOiBlcnJvciAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OiBlcnJvclwiPjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuXFxuXHQ8ZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdF9fYmFyXCI+XFxuXHRcdFx0PGlucHV0IGNsYXNzPVwia25vYi1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHNlYXJjaCwgdmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiLz5cXG5cdFx0XHQ8a25vYi1idXR0b24gY2xhc3M9XCJrbm9iLWJ1dHRvbi1zZWFyY2hcIiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLFxcblx0XHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ2RlZmF1bHRcXCcsXFxuXHRcdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLXNlYXJjaFxcJ1wiPlxcblx0XHRcdDwva25vYi1idXR0b24+XFxuXHRcdFx0PGtub2ItaXRlbXMtcGVyLXBhZ2UgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19pdGVtcy1wZXItcGFnZVwiIHBhcmFtcz1cIm51bU9mSXRlbXM6IGNvdW50LFxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+XFxuXHRcdFx0PC9rbm9iLWl0ZW1zLXBlci1wYWdlPlxcblx0XHRcdDwhLS0ga28gaWY6IHNvcnRPcHRpb25zLmxlbmd0aCA+IDAgLS0+XFxuXHRcdFx0XHQ8a25vYi1kcm9wZG93biBjbGFzcz1cImtub2ItZHJvcGRvd25cIiBwYXJhbXM9XCJyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnLCBzZWxlY3RlZElkeDogc29ydElkeCwgc2VsZWN0ZWQ6IHNvcnQsIGl0ZW1zOiBzb3J0T3B0aW9uc1wiPjwva25vYi1kcm9wZG93bj5cXG5cdFx0XHQ8IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19yZXN1bHRcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBpdGVtc1wiPlxcblx0XHRcdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiB7bW9kZWw6ICRkYXRhLCBwYXJlbnQ6ICRwYXJlbnQsIGluZGV4OiAkaW5kZXh9IH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+XFxuXHQ8IS0tXFxuXHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mSXRlbXM6IHBhZ2luYXRpb24ubnVtT2ZJdGVtcywgaXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdC0tPlxcblx0PCEtLSBrbyBpZjogbnVtT2ZQYWdlcygpID4gMCAtLT5cXG5cdFx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLCBjdXJyZW50UGFnZTogY3VycmVudFBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdDwhLS0gL2tvIC0tPlxcblx0PCEtLSBrbyBpZjogJGRhdGEubG9hZE1vcmUgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogIWxvYWRpbmcoKSwgY2xpY2s6IGxvYWRNb3JlXCI+TG9hZCBtb3JlLi4uPC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBjcmVhdGVMaXN0ID0gcmVxdWlyZShcIi4uL2xpc3Qvdm1cIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnZWRMaXN0KGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdFxuXHRpZiAoIWNvbmZpZy5zdG9yZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zdG9yZSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChiZWZvcmVMb2FkKTtcblxuXHR2YXIgbGlzdCA9IGNyZWF0ZUxpc3QoY29uZmlnKTtcblx0Ly92YXIgcGFnaW5hdGlvbiA9IGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnLnBhZ2luYXRpb24pO1xuXHQvL2xpc3QucGFnaW5hdGlvbiA9IHBhZ2luYXRpb247XG5cblx0dmFyIG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKCk7XG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKDEwKTtcblx0dmFyIGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZSgwKTtcblxuXHRsaXN0Lm51bU9mUGFnZXMgPSBudW1PZlBhZ2VzO1xuXHRsaXN0Lml0ZW1zUGVyUGFnZSA9IGl0ZW1zUGVyUGFnZTtcblx0bGlzdC5jdXJyZW50UGFnZSA9IGN1cnJlbnRQYWdlO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cdFx0dmFyIGl0ZW1zUGVyUGFnZVZhbCA9IGl0ZW1zUGVyUGFnZSgpO1xuXG5cdFx0bGlzdC5za2lwKGN1cnJlbnRQYWdlVmFsICogaXRlbXNQZXJQYWdlVmFsKTtcblx0XHRsaXN0LmxpbWl0KGl0ZW1zUGVyUGFnZVZhbCk7XG5cdH0pO1xuXG5cdC8qXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb3VudCA9IGxpc3QuY291bnQoKTtcblx0XHRsaXN0LnBhZ2luYXRpb24ubnVtT2ZJdGVtcyhjb3VudCk7XG5cdH0pO1xuXHQqL1xuXG5cdGZ1bmN0aW9uIGJlZm9yZUxvYWQoKSB7XG5cdFx0bGlzdC5pdGVtcyhbXSk7XG5cdH1cblxuXHRyZXR1cm4gbGlzdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdpbmF0aW9uXCIgZGF0YS1iaW5kPVwiaWY6IHBhZ2VTZWxlY3RvcnMoKS5sZW5ndGhcIj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tZmlyc3QtcGFnZVxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBmaXJzdCgpLnN0YXRlLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IGZpcnN0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1jaGV2cm9uLWxlZnRcXCcsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogcHJldigpLnN0YXRlLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IHByZXYoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBwYWdlU2VsZWN0b3JzXCI+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogbGFiZWwsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogc2VsZWN0UGFnZVwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWNoZXZyb24tcmlnaHRcXCcsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogbmV4dCgpLnN0YXRlLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IG5leHQoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWxhc3QtcGFnZVxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBsYXN0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogbGFzdCgpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKGNvbmZpZy5hZnRlckhlYWQgJiYgY29uZmlnLmFmdGVySGVhZCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYWZ0ZXJIZWFkIG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdGlmIChjb25maWcuYmVmb3JlVGFpbCAmJiBjb25maWcuYmVmb3JlVGFpbCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmVmb3JlVGFpbCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmJlZm9yZUN1cnJlbnQgJiYgY29uZmlnLmJlZm9yZUN1cnJlbnQgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJlZm9yZUN1cnJlbnQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5hZnRlckN1cnJlbnQgJiYgY29uZmlnLmFmdGVyQ3VycmVudCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYWZ0ZXJDdXJyZW50IG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdHZhciBudW1PZlBhZ2VzO1xuXG5cdGlmIChrby5pc09ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMpKSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzO1xuXHR9IGVsc2Uge1xuXHRcdG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzIHx8IDEwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA8IDApIHtcblx0XHRcdHZhbHVlID0gMDtcblx0XHR9XG5cblx0XHR2YXIgcGFnZXNOdW0gPSBudW1PZlBhZ2VzKCk7XG5cblx0XHRpZiAodmFsdWUgPj0gcGFnZXNOdW0pIHtcblx0XHRcdHZhbHVlID0gcGFnZXNOdW0gLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdHZhciBjdXJyZW50UGFnZSA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKCk7XG5cblx0XHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdG51bU9mUGFnZXMoKTtcblx0XHRcdGN1cnJlbnRQYWdlKDApO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGtvLmlzT2JzZXJ2YWJsZShjb25maWcuY3VycmVudFBhZ2UpKSB7XG5cdFx0XHRjdXJyZW50UGFnZSA9IGNvbmZpZy5jdXJyZW50UGFnZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKG5vcm1hbGl6ZShjb25maWcuY3VycmVudFBhZ2UpIHx8IDApO1xuXHRcdH1cblxuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRQYWdlKCk7XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGN1cnJlbnRQYWdlKG5vcm1hbGl6ZSh2YWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KCkpO1xuXG5cblxuXHR2YXIgY3VycmVudFBhZ2VSZWFsSWR4O1xuXHR2YXIgcGFnZVNlbGVjdG9ycyA9IChmdW5jdGlvbihjb25maWcpIHtcblx0XHR2YXIgYWZ0ZXJIZWFkID0gY29uZmlnLmFmdGVySGVhZCB8fCAyO1xuXHRcdHZhciBiZWZvcmVUYWlsID0gY29uZmlnLmJlZm9yZVRhaWwgfHwgMjtcblx0XHR2YXIgYmVmb3JlQ3VycmVudCA9IGNvbmZpZy5iZWZvcmVDdXJyZW50IHx8IDI7XG5cdFx0dmFyIGFmdGVyQ3VycmVudCA9IGNvbmZpZy5hZnRlckN1cnJlbnQgfHwgMjtcblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVBhZ2VTZWxlY3RvcihpZHgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBpZHggKyAxLFxuXHRcdFx0XHRzdGF0ZTogXCJkZWZhdWx0XCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN1cnJlbnRQYWdlKGlkeCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IobGFiZWwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBsYWJlbCxcblx0XHRcdFx0c3RhdGU6IFwiZGlzYWJsZWRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSBbXTtcblxuXHRcdFx0dmFyIG51bU9mUGFnZXNWYWwgPSBudW1PZlBhZ2VzKCk7XG5cdFx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXG5cdFx0XHR2YXIgbm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblxuXHRcdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbnVtT2ZQYWdlc1ZhbDsgaWR4ICs9IDEpIHtcblx0XHRcdFx0aWYgKGlkeCA8PSBhZnRlckhlYWQgfHwgaWR4ID49IG51bU9mUGFnZXNWYWwgLSBiZWZvcmVUYWlsIC0gMSB8fCBpZHggPj0gY3VycmVudFBhZ2VWYWwgLSBiZWZvcmVDdXJyZW50ICYmIGlkeCA8PSBjdXJyZW50UGFnZVZhbCArIGFmdGVyQ3VycmVudCkge1xuXHRcdFx0XHRcdHZhciBwYWdlU2VsZWN0b3I7XG5cblx0XHRcdFx0XHRpZiAoaWR4ID09PSBjdXJyZW50UGFnZVZhbCkge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IoaWR4ICsgMSk7XG5cdFx0XHRcdFx0XHRjdXJyZW50UGFnZVJlYWxJZHggPSBlbGVtZW50cy5sZW5ndGg7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZVBhZ2VTZWxlY3RvcihpZHgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVsZW1lbnRzLnB1c2gocGFnZVNlbGVjdG9yKTtcblx0XHRcdFx0XHRub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICghbm9uQ2xpY2thYmxlSW5zZXJ0ZWQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnRzLnB1c2goY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IoXCIuLi5cIikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRub25DbGlja2FibGVJbnNlcnRlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW1lbnRzO1xuXHRcdH0pO1xuXHR9KGNvbmZpZykpO1xuXG5cblx0dmFyIG5leHQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgaWR4ID0gY3VycmVudFBhZ2VSZWFsSWR4ICsgMTtcblxuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblxuXHRcdGlmIChpZHggPj0gcGFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0aWR4ID0gcGFnZXMubGVuZ3RoIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZXNbaWR4XTtcblx0fSk7XG5cblx0dmFyIHByZXYgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgaWR4ID0gY3VycmVudFBhZ2VSZWFsSWR4IC0gMTtcblxuXHRcdGlmIChpZHggPCAwKSB7XG5cdFx0XHRpZHggPSAwO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbaWR4XTtcblx0fSk7XG5cblx0dmFyIGZpcnN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVswXTtcblx0fSk7XG5cblx0dmFyIGxhc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRyZXR1cm4gcGFnZXNbcGFnZXMubGVuZ3RoIC0gMV07XG5cdH0pO1xuXG5cblx0cmV0dXJuIHtcblx0XHRwYWdlU2VsZWN0b3JzOiBwYWdlU2VsZWN0b3JzLFxuXG5cdFx0Zmlyc3Q6IGZpcnN0LFxuXHRcdGxhc3Q6IGxhc3QsXG5cblx0XHRuZXh0OiBuZXh0LFxuXHRcdHByZXY6IHByZXYsXG5cblx0XHRjdXJyZW50UGFnZTogY3VycmVudFBhZ2UsXG5cblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcmFkaW9cIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBpdGVtc1wiPlxcblx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdHBhcmFtczoge1xcblx0XHRcdHN0YXRlOiBpc1NlbGVjdGVkKCkgPyBcXCdhY3RpdmVcXCcgOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdHZhcmlhdGlvbjogJHBhcmVudC52YXJpYXRpb24sXFxuXHRcdFx0bGFiZWw6IGxhYmVsLFxcblx0XHRcdGljb246IGljb24sXFxuXHRcdFx0cmFkaW86IHRydWUsXFxuXHRcdFx0Z3JvdXA6IGdyb3VwLFxcblx0XHRcdGNsaWNrOiBzZWxlY3RcXG5cdFx0fVxcblx0fVwiPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJhZGlvKGNvbmZpZykge1xuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgdm0gPSB7fTtcblxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBzaG91bGQgbm90IGJlIGVtcHR5XCIpO1xuXHR9XG5cblx0dm0uc2VsZWN0ZWQgPSBjb25maWcuc2VsZWN0ZWQgfHwga28ub2JzZXJ2YWJsZSgpO1xuXHR2bS5zZWxlY3RlZElkeCA9IGNvbmZpZy5zZWxlY3RlZElkeCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0dm0udmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXHR2bS5pdGVtcyA9IFtdO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cblx0XHR2YXIgYWN0ID0gY29uZmlnLml0ZW1zW2lkeF07XG5cblx0XHRpZiAoIWFjdC5sYWJlbCAmJiAhYWN0Lmljb24pIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIGljb24gcHJvcGVydHlcIik7XG5cdFx0fVxuXG5cdFx0dm0uaXRlbXMucHVzaChjcmVhdGVJdGVtVm0oYWN0LmxhYmVsLCBhY3QuaWNvbiwgaWR4KSk7XG5cdH1cblxuXHR2YXIgc2VsID0gdm0uc2VsZWN0ZWRJZHgoKTtcblxuXHRpZiAodHlwZW9mIHNlbCA9PT0gXCJudW1iZXJcIikge1xuXHRcdHNlbCA9IE1hdGguZmxvb3Ioc2VsKTtcblx0XHRzZWwgJT0gdm0uaXRlbXMubGVuZ3RoO1xuXG5cdFx0dm0uaXRlbXNbc2VsXS5zZWxlY3QoKTtcblxuXHR9IGVsc2Uge1xuXHRcdHZtLml0ZW1zWzBdLnNlbGVjdCgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlSXRlbVZtKGxhYmVsLCBpY29uLCBpZHgpIHtcblxuXHRcdHZhciBvYmogPSB7XG5cdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRpY29uOiBpY29uLFxuXHRcdFx0Z3JvdXA6IGNvbmZpZy5ncm91cCxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZtLnNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdHZtLnNlbGVjdGVkSWR4KGlkeCk7XG5cdFx0XHR9LFxuXHRcdFx0aXNTZWxlY3RlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYmogPT09IHZtLnNlbGVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmFkaW87XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZVwiPlxcblx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRwYXJlbnQgfSAtLT48IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL3ZtXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVUYWIoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwidGFiXCI7XG5cdGNvbmZpZy52YXJpYXRpb24gPSBcInRhYlwiO1xuXHRjb25maWcuc3RhdGUgPSBcImFjdGl2ZVwiO1xuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVRhYjtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8a25vYi1yYWRpbyBjbGFzcz1cImtub2ItcmFkaW8tLWlubGluZVwiIHBhcmFtcz1cIlxcblx0XHRncm91cDogdGFic0dyb3VwLFxcblx0XHR2YXJpYXRpb246IFxcJ3RhYlxcJyxcXG5cdFx0c2VsZWN0ZWRJZHg6IHNlbGVjdGVkSWR4LFxcblx0XHRpdGVtczogYnV0dG9uc1wiPlxcblx0PC9rbm9iLXJhZGlvPlxcblxcblx0PGRpdiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBwYW5lbHNcIj5cXG5cdFx0PGtub2ItdGFiIGRhdGEtYmluZD1cInZpc2libGU6ICRwYXJlbnQuc2VsZWN0ZWRJZHgoKSA9PSAkaW5kZXgoKVwiPlxcblx0XHRcdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdDwva25vYi10YWI+XFxuXHQ8L2Rpdj5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIG5leHRUYWJzR3JvdXBJZHggPSAwO1xuXG5mdW5jdGlvbiBjb252ZXJ0UGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XG5cdHBhcmFtcyA9IHBhcmFtcy5yZXBsYWNlKC8nL2csIFwiXFxcIlwiKTtcblxuXHR2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KFwiLFwiKTtcblxuXHR2YXIgY29udmVydGVkUGFyYW1zID0gW107XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcGFyYW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gcGFyYW1zW2lkeF07XG5cblx0XHRhY3QgPSBhY3QudHJpbSgpO1xuXG5cdFx0YWN0ID0gYWN0LnNwbGl0KFwiOlwiKTtcblxuXHRcdGlmIChhY3QubGVuZ3RoICE9PSAyKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRhY3QgPSBcIlxcXCJcIiArIGFjdFswXSArIFwiXFxcIlwiICsgXCI6XCIgKyBhY3RbMV07XG5cdFx0Y29udmVydGVkUGFyYW1zLnB1c2goYWN0KTtcblx0fVxuXG5cdHJldHVybiBKU09OLnBhcnNlKFwie1wiICsgY29udmVydGVkUGFyYW1zLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYWJzKGNvbmZpZywgY29tcG9uZW50SW5mbykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdGNvbXBvbmVudEluZm8gPSBjb21wb25lbnRJbmZvIHx8IHt9O1xuXHRjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMgPSBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMgfHwgW107XG5cblx0dmFyIGRlZmF1bHRUYWIgPSBjb25maWcuZGVmYXVsdFRhYiB8fCAwO1xuXG5cdHZhciB2bSA9IHt9O1xuXG5cdHZhciB0YWJCdXR0b25zID0gW107XG5cdHZhciB0YWJQYW5lbHMgPSBbXTtcblxuXHR2YXIgdGFiSWR4ID0gMDtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3RUZW1wbGF0ZU5vZGUgPSBjb21wb25lbnRJbmZvLnRlbXBsYXRlTm9kZXNbaWR4XTtcblxuXHRcdGlmIChhY3RUZW1wbGF0ZU5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJrbm9iLXRhYlwiKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHR2YXIgdGFiQnV0dG9uRGF0YSA9IGNvbnZlcnRQYXJhbXNUb09iamVjdChhY3RUZW1wbGF0ZU5vZGUuZ2V0QXR0cmlidXRlKFwicGFyYW1zXCIpKTtcblxuXHRcdHRhYkJ1dHRvbkRhdGEudGFiSWR4ID0gdGFiSWR4O1xuXHRcdHRhYklkeCArPSAxO1xuXG5cdFx0dGFiQnV0dG9ucy5wdXNoKHRhYkJ1dHRvbkRhdGEpO1xuXG5cdFx0dGFiUGFuZWxzLnB1c2goYWN0VGVtcGxhdGVOb2RlLmNoaWxkTm9kZXMpO1xuXHR9XG5cblx0aWYgKHRhYlBhbmVscy5sZW5ndGggPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwia25vYi10YWJzIGNvbXBvbmVudCBzaG91bGQgaGF2ZSBhdCBsZWFzdCBvbmUga25vYi10YWIgY29tcG9uZW50IGFzIGEgY2hpbGQgY29tcG9uZW50IVwiKTtcblx0fVxuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRhYkJ1dHRvbnMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3QgPSB0YWJCdXR0b25zW2lkeF07XG5cblx0XHRpZiAoIWFjdC5pY29uICYmICFhY3QubGVmdEljb24gJiYgIWFjdC5yaWdodEljb24gJiYgIWFjdC5sYWJlbCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGNoaWxkIGtub2ItdGFiIGNvbXBvbmVudHMgc2hvdWxkIGhhdmUgcHJvcGVyIHBhcmFtcyAoaWNvbiBhbmQvb3IgbGFiZWwpIGp1c3QgbGlrZSB3aXRoIGJ1dHRvbnMhXCIpO1xuXHRcdH1cblx0fVxuXG5cdHZtLnRhYnNHcm91cCA9IFwidGFic0dyb3VwX1wiICsgbmV4dFRhYnNHcm91cElkeDtcblx0bmV4dFRhYnNHcm91cElkeCArPSAxO1xuXG5cdHZtLnNlbGVjdGVkSWR4ID0ga28ub2JzZXJ2YWJsZShkZWZhdWx0VGFiKTtcblxuXHR2bS5idXR0b25zID0gdGFiQnV0dG9ucztcblx0dm0ucGFuZWxzID0gdGFiUGFuZWxzO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWJzO1xuIl19
