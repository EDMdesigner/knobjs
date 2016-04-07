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
		},
		"modalHead": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.transparent,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": theme.transparent,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": theme.transparent,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"action": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.info.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": theme.info.text,
				"color": theme.black,
				"fill": theme.black
			},
			"active": {
				"borderColor": theme.white,
				"backgroundColor": theme.info.text,
				"color": theme.black,
				"fill": theme.black
			}
		},
		"danger": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.error.text,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"borderColor": theme.white,
				"backgroundColor": theme.error.text,
				"color": theme.error.black,
				"fill": theme.error.black
			},
			"active": {
				"borderColor": theme.black,
				"backgroundColor": theme.error.text,
				"color": theme.error.black,
				"fill": theme.error.black
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
var createModalStyle = require("./modal/style");

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

	registerComponent("knob-modal", require("./modal/vm"), require("./modal/template.html"), createModalStyle(theme));
	registerComponent("knob-confirm", require("./modal/confirm/vm"), require("./modal/confirm/template.html"), createModalStyle(theme));
	registerComponent("knob-alert", require("./modal/alert/vm"), require("./modal/alert/template.html"), createModalStyle(theme));

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
},{"./base/vm":5,"./button/style":6,"./button/template.html":7,"./button/vm":8,"./dropdown/template.html":10,"./dropdown/vm":11,"./inlineTextEditor/template.html":12,"./inlineTextEditor/vm":13,"./input/style":14,"./input/template.html":15,"./input/vm":16,"./itemsPerPage/template.html":17,"./itemsPerPage/vm":18,"./knobRegisterComponent":19,"./modal/alert/template.html":21,"./modal/alert/vm":22,"./modal/confirm/template.html":23,"./modal/confirm/vm":24,"./modal/style":25,"./modal/template.html":26,"./modal/vm":27,"./pagedList/template.html":28,"./pagedList/vm":29,"./pagination/template.html":30,"./pagination/vm":31,"./radio/template.html":32,"./radio/vm":33,"./tabs/tab/template.html":34,"./tabs/tab/vm":35,"./tabs/template.html":36,"./tabs/vm":37}],10:[function(require,module,exports){
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
				"border-color": theme.darkGray
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
module.exports = '<div>\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				click: ok\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],22:[function(require,module,exports){
"use strict";

var ko = (window.ko);

module.exports = function createAlert(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (typeof config.message !== "string") {
		throw new Error("config.message must be a string");
	}

	if (typeof config.okLabel !== "string") {
		throw new Error("config.okLabel must be a string");
	}

	if (!ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	if (typeof config.callback !== "function") {
		throw new Error("config.callback must be a function");
	}

	var visible = config.visible;
	var okLabel = config.okLabel;
	var callback = config.callback;

	var title = config.title || "";
	var icon = config.icon || "";
	var message = config.message;

	var okLabel = config.okLabel;

	function ok() {
		callback();
		visible(!visible());
	}

	return {
		visible: visible,

		title: title,
		icon: icon,
		message: message,

		okLabel: okLabel,

		ok: ok
	};
};

},{}],23:[function(require,module,exports){
module.exports = '<div class="knob-confirm">\n	<knob-modal params="\n		title: title,\n		icon: icon,\n		visible: visible">\n		<div class="knob-confirm__content" data-bind="text: message"></div>\n		<div class="knob-confirm__buttons">\n			<knob-button params="\n				label: okLabel,\n				variation: \'primary\',\n				click: ok\n			"></knob-button>\n			<knob-button params="\n				label: cancelLabel,\n				click: cancel\n			"></knob-button>\n		</div>\n	</knob-modal>\n</div>\n';
},{}],24:[function(require,module,exports){
"use strict";

function createConfirmModal(config) {
	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (!config.message) {
		throw new Error("config.message element is mandatory!");
	}

	if (!config.okLabel) {
		throw new Error("config.okLabel element is mandatory!");
	}

	if (!config.cancelLabel) {
		throw new Error("config.cancelLabel element is mandatory!");
	}

	config = config || {};

	var visible = config.visible;
	var callback = config.callback;

	var title = config.title || "";
	var icon = config.icon || "";
	var message = config.message;

	var okLabel = config.okLabel;
	var cancelLabel = config.cancelLabel;


	function ok() {
		callback(true);
		visible(!visible());
	}

	function cancel() {
		callback(false);
		visible(!visible());
	}

	return {
		visible: visible,

		title: title,
		icon: icon,
		message: message,

		okLabel: okLabel,
		cancelLabel: cancelLabel,

		ok: ok,
		cancel: cancel
	};
}

module.exports = createConfirmModal;
},{}],25:[function(require,module,exports){
module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};

},{}],26:[function(require,module,exports){
module.exports = '<div class="knob-modal-overlay" data-bind="visible: visible">\n\n	<div class="knob-modal">\n		<div class="knob-modal__header" data-bind="style: style">\n			<knob-button class="button-close" params="variation: \'modalHead\', icon: \'#icon-close\', click: $component.visible.toggle"></knob-button>\n\n			<span class="desc">\n				<svg class="icon">\n					<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': icon}" xlink:href=""></use>\n				</svg>\n				<span data-bind="text: title"></span>\n			</span>\n\n		</div>\n		<div class="knob-modal__body">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n		</div>\n	</div>\n</div>\n';
},{}],27:[function(require,module,exports){
"use strict";
var ko = (window.ko);
var base = require("../base/vm");

function createModal(config) {

	if (!config) {
		throw new Error("config is mandatory!");
	}

	if (config.visible && !ko.isObservable(config.visible)) {
		throw new Error("config.visible must be an observable");
	}

	config = config || {};

	var visible = config.visible;
	var title = config.title;
	var icon = config.icon;

	visible.toggle = function() {
		visible(!visible());
	};

	config.component = "modal";

	var vm = base(config);

	vm.visible = visible;
	vm.title = title;
	vm.icon = icon;

	return vm;
}

module.exports = createModal;
},{"../base/vm":5}],28:[function(require,module,exports){
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\',\n								variation: \'default\',\n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count,\n										numOfPages: numOfPages,\n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-expand-more\', selectedIdx: sortIdx, selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<ul data-bind="css: listClass, foreach: items">\n			<li data-bind="css: $parent.itemClass">\n				<!-- ko template: { nodes: $componentTemplateNodes, data: {model: $data, parent: $parent, index: $index} } --><!-- /ko -->\n			</li>\n		</ul>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],29:[function(require,module,exports){
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

	list.listClass = config.listClass || "knob-pagedlist__list";
	list.itemClass = config.itemClass || "knob-pagedlist__item";
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

},{"../list/vm":20}],30:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-first-page\',\n							state: first().state,\n							click: first().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-left\',\n							state: prev().state,\n							click: prev().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label,\n							state: state,\n							variation: \'pagination\',\n							click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-chevron-right\',\n							state: next().state,\n							click: next().selectPage\n						}\n					}">\n	</span>\n	<span data-bind="component: {\n						name: \'knob-button\',\n						params: {\n							variation: \'pagination\',\n							icon: \'#icon-last-page\',\n							state: last().state,\n							click: last().selectPage\n						}\n					}">\n	</span>\n</div>';
},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
module.exports = '<div class="knob-radio" data-bind="foreach: items">\n	<div data-bind="component: {\n		name: \'knob-button\',\n		params: {\n			state: isSelected() ? \'active\' : \'default\',\n			variation: $parent.variation,\n			label: label,\n			icon: icon,\n			radio: true,\n			group: group,\n			click: select\n		}\n	}">\n	</div>\n</div>\n';
},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
module.exports = '<div data-bind="css: cssClass,\n					style: style">\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],35:[function(require,module,exports){
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

},{"../../base/vm":5}],36:[function(require,module,exports){
module.exports = '<div>\n	<knob-radio class="knob-radio--inline" params="\n		group: tabsGroup,\n		variation: \'tab\',\n		selectedIdx: selectedIdx,\n		items: buttons">\n	</knob-radio>\n\n	<div data-bind="foreach: panels">\n		<knob-tab data-bind="visible: $parent.selectedIdx() == $index()">\n			<!-- ko template: { nodes: $data } --><!-- /ko -->\n		</knob-tab>\n	</div>\n</div>';
},{}],37:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbCIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL21vZGFsL2FsZXJ0L3RlbXBsYXRlLmh0bWwiLCJzcmMvbW9kYWwvYWxlcnQvdm0uanMiLCJzcmMvbW9kYWwvY29uZmlybS90ZW1wbGF0ZS5odG1sIiwic3JjL21vZGFsL2NvbmZpcm0vdm0uanMiLCJzcmMvbW9kYWwvc3R5bGUuanMiLCJzcmMvbW9kYWwvdGVtcGxhdGUuaHRtbCIsInNyYy9tb2RhbC92bS5qcyIsInNyYy9wYWdlZExpc3QvdGVtcGxhdGUuaHRtbCIsInNyYy9wYWdlZExpc3Qvdm0uanMiLCJzcmMvcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2luYXRpb24vdm0uanMiLCJzcmMvcmFkaW8vdGVtcGxhdGUuaHRtbCIsInNyYy9yYWRpby92bS5qcyIsInNyYy90YWJzL3RhYi90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdGFiL3ZtLmpzIiwic3JjL3RhYnMvdGVtcGxhdGUuaHRtbCIsInNyYy90YWJzL3ZtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsaWNrQmVoYXZpb3VyKHZtKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlZG93biA9IG1vdXNlRG93bjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZXVwID0gbW91c2VVcDtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvY3VzQmVoYXZpb3VyKHZtKSB7XG5cblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZSh2bS5zdGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvY3VzKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmx1cigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLmZvY3VzID0gZm9jdXM7XG5cdHZtLmV2ZW50SGFuZGxlcnMuYmx1ciA9IGJsdXI7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob3ZlckJlaGF2aW91cih2bSkge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dmFyIHByZXZpb3VzU3RhdGU7XG5cblx0ZnVuY3Rpb24gbW91c2VPdmVyKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChhY3RTdGF0ZSAhPT0gXCJob3ZlclwiKSB7XG5cdFx0XHRwcmV2aW91c1N0YXRlID0gYWN0U3RhdGU7XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlT3V0KCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKHByZXZpb3VzU3RhdGUpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZW92ZXIgPSBtb3VzZU92ZXI7XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2VvdXQgPSBtb3VzZU91dDtcblxuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHZtcyA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdEJlaGF2aW91cih2bSwgY29uZmlnKSB7XG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBncm91cCA9IGNvbmZpZy5ncm91cCB8fCBcImRlZmF1bHRcIjtcblxuXHRpZiAoIXZtc1tncm91cF0pIHtcblx0XHR2bXNbZ3JvdXBdID0gW107XG5cdH1cblxuXHR2bXNbZ3JvdXBdLnB1c2godm0pO1xuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGFjdEdyb3VwVm1zID0gdm1zW2dyb3VwXTtcblxuXHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFjdEdyb3VwVm1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHRcdHZhciBhY3RWbSA9IGFjdEdyb3VwVm1zW2lkeF07XG5cblx0XHRcdGlmIChhY3RWbSA9PT0gdm0pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGFjdFZtLnN0YXRlKFwiZGVmYXVsdFwiKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlZG93biA9IG1vdXNlRG93bjtcblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZXVwID0gbW91c2VVcDtcblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG52YXIgaG92ZXJCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2hvdmVyXCIpO1xudmFyIGZvY3VzQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9mb2N1c1wiKTtcbnZhciBjbGlja0JlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvY2xpY2tcIik7XG52YXIgc2VsZWN0QmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9zZWxlY3RcIik7XG5cblxuZnVuY3Rpb24gY3JlYXRlQmFzZVZtKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuY29tcG9uZW50KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmNvbXBvbmVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuc3R5bGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3R5bGUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdHZhciBjb21wb25lbnQgPSBjb25maWcuY29tcG9uZW50O1xuXHR2YXIgc3R5bGUgPSBjb25maWcuc3R5bGU7XG5cblx0dmFyIHN0YXRlID0ga28ub2JzZXJ2YWJsZShjb25maWcuc3RhdGUgfHwgXCJkZWZhdWx0XCIpO1xuXHR2YXIgdmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXG5cdHZhciBjc3NDbGFzc0NvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFwia25vYi1cIiArIGNvbXBvbmVudCArIFwiIHN0YXRlLVwiICsgc3RhdGUoKSArIFwiIHZhcmlhdGlvbi1cIiArIHZhcmlhdGlvbjtcblx0fSk7XG5cdHZhciBzdHlsZUNvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN0YXRlVmFsID0gc3RhdGUoKTtcblxuXHRcdHJldHVybiBzdHlsZVt2YXJpYXRpb25dW3N0YXRlVmFsXTtcblx0fSk7XG5cblx0dmFyIHZtID0ge1xuXHRcdHZhcmlhdGlvbjogdmFyaWF0aW9uLFxuXHRcdHN0YXRlOiBzdGF0ZSxcblxuXHRcdGNzc0NsYXNzOiBjc3NDbGFzc0NvbXB1dGVkLFxuXHRcdHN0eWxlOiBzdHlsZUNvbXB1dGVkLFxuXG5cdFx0ZXZlbnRIYW5kbGVyczoge31cblx0fTtcblxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUVuYWJsZXIoYmVoYXZpb3VyLCBwcm9wcykge1xuXHRcdHJldHVybiB7XG5cdFx0XHRlbmFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRiZWhhdmlvdXIodm0sIGNvbmZpZyk7XG5cdFx0XHR9LFxuXHRcdFx0ZGlzYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdFx0XHRcdGlmICh2bS5ldmVudEhhbmRsZXJzW3Byb3BdKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgdm0uZXZlbnRIYW5kbGVyc1twcm9wXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHR2bS5iZWhhdmlvdXJzID0ge1xuXHRcdGhvdmVyOiBjcmVhdGVFbmFibGVyKGhvdmVyQmVoYXZpb3VyLCBbXCJtb3VzZW92ZXJcIiwgXCJtb3VzZW91dFwiXSksXG5cdFx0Zm9jdXM6IGNyZWF0ZUVuYWJsZXIoZm9jdXNCZWhhdmlvdXIsIFtcImZvY3VzXCIsIFwiYmx1clwiXSksXG5cdFx0Y2xpY2s6IGNyZWF0ZUVuYWJsZXIoY2xpY2tCZWhhdmlvdXIsIFtcIm1vdXNlZG93blwiLCBcIm1vdXNldXBcIl0pLFxuXHRcdHNlbGVjdDogY3JlYXRlRW5hYmxlcihzZWxlY3RCZWhhdmlvdXIsIFtcIm1vdXNlZG93blwiLCBcIm1vdXNldXBcIl0pXG5cdH07XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VWbTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLm1lZGl1bUdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInByaW1hcnlcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5zZWNvbmRhcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInRhYlwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcInBhZ2luYXRpb25cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlMFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJtb2RhbEhlYWRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUudHJhbnNwYXJlbnQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS50cmFuc3BhcmVudCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubWVkaXVtR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUudHJhbnNwYXJlbnQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJhY3Rpb25cIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuaW5mby50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmxhY2tcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcImRhbmdlclwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5lcnJvci50ZXh0LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmVycm9yLmJsYWNrLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZXJyb3IuYmxhY2tcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGNsaWNrOiBjbGljayxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImxhYmVsXCIgZGF0YS1iaW5kPVwidGV4dDogbGFiZWxcIj48L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiByaWdodEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiByaWdodEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPlxcblx0XHQ8L3N2Zz5cXG5cdDwvc3Bhbj5cXG48L2J1dHRvbj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKGNvbmZpZykge1xuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5jbGljayAmJiB0eXBlb2YgY29uZmlnLmNsaWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjbGljayBoYXMgdG8gYmUgYSBmdW5jdGlvbiFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5sYWJlbCAmJiAhY29uZmlnLmxlZnRJY29uICYmICFjb25maWcucmlnaHRJY29uICYmICFjb25maWcuaWNvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImVpdGhlciBsYWJlbC9sZWZ0aWNvbi9yaWdodGljb24vaWNvbiBoYXMgdG8gYmUgZ2l2ZW4hXCIpO1xuXHR9XG5cblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiYnV0dG9uXCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHZtLmJlaGF2aW91cnMuaG92ZXIuZW5hYmxlKCk7XG5cblx0aWYgKGNvbmZpZy5yYWRpbykge1xuXHRcdHZtLmJlaGF2aW91cnMuc2VsZWN0LmVuYWJsZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHZtLmJlaGF2aW91cnMuY2xpY2suZW5hYmxlKCk7XG5cdH1cblxuXHR2bS5sZWZ0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sZWZ0SWNvbiB8fCBjb25maWcuaWNvbikpO1xuXHR2bS5yaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcucmlnaHRJY29uKSk7XG5cdHZtLmxhYmVsID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxhYmVsKSk7XG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuXHR2bS5jbGljayA9IGNvbmZpZy5jbGljayB8fCBmdW5jdGlvbigpIHt9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b247XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxuLy8qL1xuXG4vL1RISVMgRklMRSBTSE9VTEQgQkUgR0VORVJBVEVEXG5cbnZhciByZWdpc3RlckNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2tub2JSZWdpc3RlckNvbXBvbmVudFwiKTtcbnZhciBiYXNlVm0gPSByZXF1aXJlKFwiLi9iYXNlL3ZtXCIpO1xuXG52YXIgY3JlYXRlQnV0dG9uU3R5bGUgPSByZXF1aXJlKFwiLi9idXR0b24vc3R5bGVcIik7XG52YXIgY3JlYXRlSW5wdXRTdHlsZSA9IHJlcXVpcmUoXCIuL2lucHV0L3N0eWxlXCIpO1xudmFyIGNyZWF0ZU1vZGFsU3R5bGUgPSByZXF1aXJlKFwiLi9tb2RhbC9zdHlsZVwiKTtcblxuZnVuY3Rpb24gaW5pdEtub2IodGhlbWUpIHtcblxuXHR2YXIgYnV0dG9uU3R5bGUgPSBjcmVhdGVCdXR0b25TdHlsZSh0aGVtZSk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWJ1dHRvblwiLCByZXF1aXJlKFwiLi9idXR0b24vdm1cIiksIHJlcXVpcmUoXCIuL2J1dHRvbi90ZW1wbGF0ZS5odG1sXCIpLCBidXR0b25TdHlsZSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbnB1dFwiLCByZXF1aXJlKFwiLi9pbnB1dC92bVwiKSwgcmVxdWlyZShcIi4vaW5wdXQvdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlSW5wdXRTdHlsZSh0aGVtZSkpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcmFkaW9cIiwgcmVxdWlyZShcIi4vcmFkaW8vdm1cIiksIHJlcXVpcmUoXCIuL3JhZGlvL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItaW5saW5lLXRleHQtZWRpdG9yXCIsIHJlcXVpcmUoXCIuL2lubGluZVRleHRFZGl0b3Ivdm1cIiksIHJlcXVpcmUoXCIuL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1kcm9wZG93blwiLCByZXF1aXJlKFwiLi9kcm9wZG93bi92bVwiKSwgcmVxdWlyZShcIi4vZHJvcGRvd24vdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdpbmF0aW9uXCIsIHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItaXRlbXMtcGVyLXBhZ2VcIiwgcmVxdWlyZShcIi4vaXRlbXNQZXJQYWdlL3ZtXCIpLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2UvdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdlZC1saXN0XCIsIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWxcIikpO1xuXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1tb2RhbFwiLCByZXF1aXJlKFwiLi9tb2RhbC92bVwiKSwgcmVxdWlyZShcIi4vbW9kYWwvdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlTW9kYWxTdHlsZSh0aGVtZSkpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItY29uZmlybVwiLCByZXF1aXJlKFwiLi9tb2RhbC9jb25maXJtL3ZtXCIpLCByZXF1aXJlKFwiLi9tb2RhbC9jb25maXJtL3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZU1vZGFsU3R5bGUodGhlbWUpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWFsZXJ0XCIsIHJlcXVpcmUoXCIuL21vZGFsL2FsZXJ0L3ZtXCIpLCByZXF1aXJlKFwiLi9tb2RhbC9hbGVydC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKHRoZW1lKSk7XG5cblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXRhYnNcIiwgcmVxdWlyZShcIi4vdGFicy92bVwiKSwgcmVxdWlyZShcIi4vdGFicy90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXRhYlwiLCByZXF1aXJlKFwiLi90YWJzL3RhYi92bVwiKSwgcmVxdWlyZShcIi4vdGFicy90YWIvdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogaW5pdEtub2IsXG5cblx0cmVnaXN0ZXJDb21wb25lbnQ6IHJlZ2lzdGVyQ29tcG9uZW50LFxuXHRiYXNlOiB7XG5cdFx0dm06IGJhc2VWbVxuXHR9XG59O1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5yaWdodEljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcucmlnaHRJY29uIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXHRpZiAoIWNvbmZpZy5pdGVtcykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblx0aWYgKGNvbmZpZy5zZWxlY3RlZCAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy5zZWxlY3RlZCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VsZWN0ZWQgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5pdGVtcyBzaG91bGQgbm90IGJlIGVtcHR5XCIpO1xuXHR9XG5cblx0dmFyIHJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoY29uZmlnLnJpZ2h0SWNvbik7XG5cblx0dmFyIG9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5pdGVtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cblx0XHRpZiAoIWNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsICYmICFjb25maWcuaXRlbXNbaWR4XS5pY29uKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xuXHRcdH1cblx0XHRvcHRpb25zLnB1c2goY3JlYXRlT3B0aW9uKHtcblx0XHRcdGxhYmVsOiBjb25maWcuaXRlbXNbaWR4XS5sYWJlbCxcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXG5cdFx0XHR2YWx1ZTogY29uZmlnLml0ZW1zW2lkeF0udmFsdWVcblx0XHR9KSk7XG5cdH1cblxuXHQvLyBjb25zb2xlLmxvZyhvcHRpb25zKCkpO1xuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpW2NvbmZpZy5zZWxlY3RlZElkeCB8fCAwXSk7XG5cblx0dmFyIGRyb3Bkb3duVmlzaWJsZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGVEcm9wZG93blZpc2libGUoaXRlbSwgZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHZhciB2aXNpYmxlID0gZHJvcGRvd25WaXNpYmxlKCk7XG5cblx0XHRkcm9wZG93blZpc2libGUoIXZpc2libGUpO1xuXG5cdFx0Ly8gc2hvdWxkIHJlbW92ZSB0aGlzIHdoZW4gdGVzdCBpbiBwaGFudG9tanNcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh2aXNpYmxlKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVPcHRpb24oY29uZmlnKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXG5cdFx0XHRpY29uOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5pY29uKSxcblx0XHRcdHZhbHVlOiBjb25maWcudmFsdWUsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxlY3RlZChvYmopO1xuXHRcdFx0XHRkcm9wZG93blZpc2libGUudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxuXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbkRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPHNwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhZWRpdE1vZGUoKVwiPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB2YWx1ZVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBlZGl0LCBpY29uOiBcXCcjaWNvbi1lZGl0XFwnXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBlZGl0TW9kZVwiPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJ2YWx1ZTogZWRpdGVkVmFsdWUsIGhhc0ZvY3VzOiBpbnB1dEhhc0ZvY3VzLCBrZXlEb3duOiBrZXlEb3duLCB2aXNpYmxlOiBlZGl0TW9kZVwiPjwva25vYi1pbnB1dD5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBzYXZlLCBpY29uOiBcXCcjaWNvbi1kb25lXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBjYW5jZWwsIGljb246IFxcJyNpY29uLWNsb3NlXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L3NwYW4+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlubGluZVRleHRFZGl0b3IoY29uZmlnKSB7XG5cdHZhciB2bSA9IHt9O1xuXG5cdHZhciBjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKGNvbmZpZy52YWx1ZSAmJiAha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudmFsdWUgaGFzIHRvIGJlIGFuIG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZShcIlwiKTtcblx0dm0uZWRpdGVkVmFsdWUgPSBrby5vYnNlcnZhYmxlKHZtLnZhbHVlKCkpO1xuXG5cdHZtLmVkaXRNb2RlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0dm0uZWRpdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLmVkaXRlZFZhbHVlKHZtLnZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKHRydWUpO1xuXHRcdHZtLmlucHV0SGFzRm9jdXModHJ1ZSk7XG5cdH07XG5cblx0dm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZtLnZhbHVlKHZtLmVkaXRlZFZhbHVlKCkpO1xuXHRcdHZtLmVkaXRNb2RlKGZhbHNlKTtcblx0fTtcblxuXHR2bS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XG5cdH07XG5cblx0dm0ua2V5RG93biA9IGZ1bmN0aW9uKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRyZXR1cm4gdm0uc2F2ZSgpO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xuXHRcdFx0cmV0dXJuIHZtLmNhbmNlbCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHR2bS5pbnB1dEhhc0ZvY3VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlubGluZVRleHRFZGl0b3I7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJvcmRlci1jb2xvclwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUubGlnaHRHcmF5XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxpbnB1dCBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGF0dHI6IHt0eXBlOiB0eXBlfSxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGhhc0ZvY3VzOiBoYXNGb2N1cyxcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCcsXFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmhhc0ZvY3VzICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLmhhc0ZvY3VzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5oYXNGb2N1cyBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS5iZWhhdmlvdXJzLmhvdmVyLmVuYWJsZSgpO1xuXHR2bS5iZWhhdmlvdXJzLmZvY3VzLmVuYWJsZSgpO1xuXG5cdHZtLnR5cGUgPSBjb25maWcudHlwZTtcblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZSgpO1xuXHR2bS5oYXNGb2N1cyA9IGNvbmZpZy5oYXNGb2N1cyB8fCBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRpZiAoY29uZmlnLmtleURvd24pIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzLmtleWRvd24gPSBjb25maWcua2V5RG93bjtcblx0fVxuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVJbnB1dDtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0cmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJyxcXG5cdHNlbGVjdGVkOiBpdGVtc1BlclBhZ2UsXFxuXHRpdGVtczogaXRlbXNQZXJQYWdlTGlzdFwiPlxcbjwva25vYi1kcm9wZG93bj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJdGVtc1BlclBhZ2UoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5udW1PZkl0ZW1zKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm51bU9mSXRlbXMgZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcuaXRlbXNQZXJQYWdlTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuXG5cdFx0XHRpZiAoIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLnZhbHVlICYmICFjb25maWcuaXRlbXNQZXJQYWdlTGlzdFtpXS5sYWJlbCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciB2YWx1ZSBwcm9wZXJ0eVwiKTtcblx0XHRcdH1cblxuXHRcdH1cblx0fVxuXG5cdHZhciBudW1PZkl0ZW1zID0gY29uZmlnLm51bU9mSXRlbXM7XG5cblx0dmFyIGl0ZW1zUGVyUGFnZUxpc3QgPSBjb25maWcuaXRlbXNQZXJQYWdlTGlzdCB8fCBbe1xuXHRcdGxhYmVsOiAxMCxcblx0XHR2YWx1ZTogMTBcblx0fSwge1xuXHRcdGxhYmVsOiAyNSxcblx0XHR2YWx1ZTogMjVcblx0fSwge1xuXHRcdGxhYmVsOiA1MCxcblx0XHR2YWx1ZTogNTBcblx0fSwge1xuXHRcdGxhYmVsOiAxMDAsXG5cdFx0dmFsdWU6IDEwMFxuXHR9XTtcblxuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZShpdGVtc1BlclBhZ2VMaXN0WzBdKTtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzIHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgbnVtT2ZJdGVtc1ZhbCA9IG51bU9mSXRlbXMoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRpZiAoIWl0ZW1zUGVyUGFnZVZhbCkge1xuXHRcdFx0cmV0dXJuIG51bU9mUGFnZXMoMCk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2UpIHtcblx0XHRcdGNvbmZpZy5pdGVtc1BlclBhZ2UoaXRlbXNQZXJQYWdlVmFsLnZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVtT2ZQYWdlcyhNYXRoLmNlaWwobnVtT2ZJdGVtc1ZhbCAvIGl0ZW1zUGVyUGFnZVZhbC52YWx1ZSkpO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdG51bU9mSXRlbXM6IG51bU9mSXRlbXMsXG5cdFx0aXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2UsXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcblxuXHRcdGl0ZW1zUGVyUGFnZUxpc3Q6IGl0ZW1zUGVyUGFnZUxpc3Rcblx0fTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGtub2JSZWdpc3RlckNvbXBvbmVudChuYW1lLCBjcmVhdGVWbSwgdGVtcGxhdGUsIHN0eWxlKSB7XG5cdGtvLmNvbXBvbmVudHMucmVnaXN0ZXIobmFtZSwge1xuXHRcdHZpZXdNb2RlbDoge1xuXHRcdFx0Y3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMsIGNvbXBvbmVudEluZm8pIHtcblx0XHRcdFx0cGFyYW1zLnN0eWxlID0gc3R5bGU7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVWbShwYXJhbXMsIGNvbXBvbmVudEluZm8pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtub2JSZWdpc3RlckNvbXBvbmVudDtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMaXN0KGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJzdG9yZVwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zdG9yZSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJmaWVsZHNcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInNvcnRcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc29ydCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcuaGFzT3duUHJvcGVydHkoXCJzZWFyY2hcIikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5zdG9yZSAhPT0gXCJvYmplY3RcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWFyY2ggbXVzdCBiZSBhbiBvYmplY3QhXCIpO1xuXHR9XG5cblx0aWYgKCEoY29uZmlnLmZpZWxkcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgbXVzdCBiZSBhbiBhcnJheSFcIik7XG5cdH1cblxuXHRpZiAoIShjb25maWcuc29ydCBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IG11c3QgYmUgYW4gYXJyYXkhXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcuc2VhcmNoICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBtdXN0IGJlIGEgc3RyaW5nIVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuZmllbGRzLmluZGV4T2YoY29uZmlnLnNlYXJjaCkgPT09IC0xKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmZpZWxkcyBtdXN0IGNvbnRhaW4gdGhlIHZhbHVlIG9mIGNvbmZpZy5zZWFyY2ghXCIpO1xuXHR9XG5cblx0dmFyIG9yZGVyRmllbGQ7XG5cblx0aWYgKGNvbmZpZy5vcmRlckJ5KSB7XG5cdFx0aWYgKHR5cGVvZiBjb25maWcub3JkZXJCeSAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9yZGVyQnkgbXVzdCBoYXZlIHRoZSBmb3JtYXQgb2YgeyA8a2V5PjogWzE7LTFdIH0gXCIpO1xuXHRcdH1cblxuXHRcdG9yZGVyRmllbGQgPSBPYmplY3Qua2V5cyhjb25maWcub3JkZXJCeSlbMF07XG5cdFx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihvcmRlckZpZWxkKSA9PT0gLTEgfHwgTWF0aC5hYnMoY29uZmlnLm9yZGVyQnlbb3JkZXJGaWVsZF0pICE9PSAxKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub3JkZXJCeSBtdXN0IGhhdmUgdGhlIGZvcm1hdCBvZiB7IDxrZXk+OiBbMTstMV0gfSBcIik7XG5cdFx0fVxuXG5cdFx0dmFyIHNvcnRDb250YWluc09yZGVyRmllbGQgPSBmYWxzZTtcblxuXHRcdGNvbmZpZy5zb3J0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0aWYgKGl0ZW0udmFsdWUgPT09IG9yZGVyRmllbGQpIHtcblx0XHRcdFx0c29ydENvbnRhaW5zT3JkZXJGaWVsZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghc29ydENvbnRhaW5zT3JkZXJGaWVsZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgbXVzdCBjb250YWluIHRoZSB2YWx1ZSBvZiBjb25maWcub3JkZXJCeSFcIik7XG5cdFx0fVxuXHR9XG5cblx0Y29uZmlnLnNvcnQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihpdGVtLnZhbHVlKSA9PT0gLTEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInZhbHVlcyBvZiBjb25maWcuc29ydCBtdXN0IGJlIGluIGNvbmZpZy5maWVsZHMhXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXHR2YXIgZmllbGRzID0gY29uZmlnLmZpZWxkcztcblxuXHR2YXIgc2VhcmNoID0ga28ub2JzZXJ2YWJsZShcIlwiKS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiBjb25maWcudGhyb3R0bGUgfHwgNTAwXG5cdH0pO1xuXG5cdHZhciBzb3J0T3B0aW9ucyA9IFtdO1xuXG5cdHZhciBkZWZhdWx0T3JkZXJJZHg7XG5cblx0ZnVuY3Rpb24gY3JlYXRlUXVlcnlPYmoocHJvcCwgYXNjKSB7XG5cdFx0dmFyIG9iaiA9IHt9O1xuXG5cdFx0b2JqW3Byb3BdID0gYXNjO1xuXG5cdFx0aWYgKG9yZGVyRmllbGQgJiYgcHJvcCA9PT0gb3JkZXJGaWVsZCAmJiBhc2MgPT09IGNvbmZpZy5vcmRlckJ5W29yZGVyRmllbGRdKSB7XG5cdFx0XHRkZWZhdWx0T3JkZXJJZHggPSBzb3J0T3B0aW9ucy5sZW5ndGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5zb3J0Lmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gY29uZmlnLnNvcnRbaWR4XTtcblxuXHRcdHNvcnRPcHRpb25zLnB1c2goe1xuXHRcdFx0aWNvbjogXCIjaWNvbi1zb3J0LWFzY1wiLFxuXHRcdFx0bGFiZWw6IGFjdC5sYWJlbCxcblx0XHRcdHZhbHVlOiBjcmVhdGVRdWVyeU9iaihhY3QudmFsdWUsIDEpXG5cdFx0fSk7XG5cdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtZGVzY1wiLFxuXHRcdFx0bGFiZWw6IGFjdC5sYWJlbCxcblx0XHRcdHZhbHVlOiBjcmVhdGVRdWVyeU9iaihhY3QudmFsdWUsIC0xKVxuXHRcdH0pO1xuXHR9XG5cblx0dmFyIHNvcnQgPSBrby5vYnNlcnZhYmxlKHNvcnRPcHRpb25zW2RlZmF1bHRPcmRlcklkeCB8fCAwXSk7XG5cdHZhciBzb3J0SWR4ID0gZGVmYXVsdE9yZGVySWR4IHx8IDA7XG5cblx0dmFyIHNraXAgPSBrby5vYnNlcnZhYmxlKDApO1xuXHR2YXIgbGltaXQgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHR9KTtcblxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblxuXHR2YXIgbG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VhcmNoVmFsID0gc2VhcmNoKCk7XG5cdFx0dmFyIHNvcnRWYWwgPSBzb3J0KCkudmFsdWU7XG5cdFx0dmFyIHNraXBWYWwgPSBza2lwKCk7XG5cdFx0dmFyIGxpbWl0VmFsID0gbGltaXQoKTtcblxuXHRcdHZhciBmaW5kID0ge307XG5cblx0XHRmaW5kW2NvbmZpZy5zZWFyY2hdID0gKG5ldyBSZWdFeHAoc2VhcmNoVmFsLCBcImlnXCIpKS50b1N0cmluZygpO1xuXG5cdFx0c3RvcmUuZmluZCA9IGZpbmQ7XG5cdFx0c3RvcmUuc29ydCA9IHNvcnRWYWw7XG5cdFx0c3RvcmUuc2tpcCA9IHNraXBWYWw7XG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdFZhbDtcblx0fSkuZXh0ZW5kKHtcblx0XHR0aHJvdHRsZTogMFxuXHR9KTtcblxuXHRmdW5jdGlvbiBiZWZvcmVMb2FkKCkge1xuXHRcdGlmIChsb2FkaW5nKCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTGlzdCBpcyBhbHJlYWR5IGxvYWRpbmcuLi5cIik7IC8vdGhpcyBtaWdodCBiZSBwcm9ibGVtYXRpYyBpZiB0aGVyZSBhcmUgbm8gZ29vZCB0aW1lb3V0IHNldHRpbmdzLlxuXHRcdH1cblxuXHRcdGxvYWRpbmcodHJ1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoZXJyKSB7XG5cdFx0bG9hZGluZyhmYWxzZSk7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKGVycik7XG5cdFx0fVxuXHRcdGVycm9yKG51bGwpO1xuXG5cdFx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdFx0fSk7XG5cblx0XHRjb3VudChzdG9yZS5jb3VudCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWFkT25seUNvbXB1dGVkKG9ic2VydmFibGUpIHtcblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYnNlcnZhYmxlKCk7XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aHJvdyBcIlRoaXMgY29tcHV0ZWQgdmFyaWFibGUgc2hvdWxkIG5vdCBiZSB3cml0dGVuLlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0c3RvcmU6IHN0b3JlLFxuXG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXG5cdFx0c2VhcmNoOiBzZWFyY2gsXG5cblx0XHRzb3J0OiBzb3J0LFxuXHRcdHNvcnRJZHg6IHNvcnRJZHgsXG5cdFx0c29ydE9wdGlvbnM6IHNvcnRPcHRpb25zLFxuXG5cdFx0c2tpcDogc2tpcCxcblx0XHRsaW1pdDogbGltaXQsXG5cblx0XHRpdGVtczogaXRlbXMsXG5cdFx0Y291bnQ6IHJlYWRPbmx5Q29tcHV0ZWQoY291bnQpLFxuXG5cdFx0bG9hZGluZzogcmVhZE9ubHlDb21wdXRlZChsb2FkaW5nKSxcblx0XHRlcnJvcjogcmVhZE9ubHlDb21wdXRlZChlcnJvcilcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItbW9kYWwgcGFyYW1zPVwiXFxuXHRcdHRpdGxlOiB0aXRsZSxcXG5cdFx0aWNvbjogaWNvbixcXG5cdFx0dmlzaWJsZTogdmlzaWJsZVwiPlxcblxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19jb250ZW50XCIgZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19idXR0b25zXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IG9rTGFiZWwsXFxuXHRcdFx0XHRjbGljazogb2tcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8L2Rpdj5cXG5cdDwva25vYi1tb2RhbD5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVBbGVydChjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcubWVzc2FnZSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIG11c3QgYmUgYSBzdHJpbmdcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5va0xhYmVsICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm9rTGFiZWwgbXVzdCBiZSBhIHN0cmluZ1wiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKGNvbmZpZy52aXNpYmxlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52aXNpYmxlIG11c3QgYmUgYW4gb2JzZXJ2YWJsZVwiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLmNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXHR9XG5cblx0dmFyIHZpc2libGUgPSBjb25maWcudmlzaWJsZTtcblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcblx0dmFyIGNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xuXG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZSB8fCBcIlwiO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uIHx8IFwiXCI7XG5cdHZhciBtZXNzYWdlID0gY29uZmlnLm1lc3NhZ2U7XG5cblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcblxuXHRmdW5jdGlvbiBvaygpIHtcblx0XHRjYWxsYmFjaygpO1xuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHZpc2libGU6IHZpc2libGUsXG5cblx0XHR0aXRsZTogdGl0bGUsXG5cdFx0aWNvbjogaWNvbixcblx0XHRtZXNzYWdlOiBtZXNzYWdlLFxuXG5cdFx0b2tMYWJlbDogb2tMYWJlbCxcblxuXHRcdG9rOiBva1xuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLWNvbmZpcm1cIj5cXG5cdDxrbm9iLW1vZGFsIHBhcmFtcz1cIlxcblx0XHR0aXRsZTogdGl0bGUsXFxuXHRcdGljb246IGljb24sXFxuXHRcdHZpc2libGU6IHZpc2libGVcIj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItY29uZmlybV9fY29udGVudFwiIGRhdGEtYmluZD1cInRleHQ6IG1lc3NhZ2VcIj48L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItY29uZmlybV9fYnV0dG9uc1wiPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRcdGxhYmVsOiBva0xhYmVsLFxcblx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwcmltYXJ5XFwnLFxcblx0XHRcdFx0Y2xpY2s6IG9rXFxuXHRcdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0XHRsYWJlbDogY2FuY2VsTGFiZWwsXFxuXHRcdFx0XHRjbGljazogY2FuY2VsXFxuXHRcdFx0XCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2tub2ItbW9kYWw+XFxuPC9kaXY+XFxuJzsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY3JlYXRlQ29uZmlybU1vZGFsKGNvbmZpZykge1xuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubWVzc2FnZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5tZXNzYWdlIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLm9rTGFiZWwpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub2tMYWJlbCBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5jYW5jZWxMYWJlbCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jYW5jZWxMYWJlbCBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIHZpc2libGUgPSBjb25maWcudmlzaWJsZTtcblx0dmFyIGNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xuXG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZSB8fCBcIlwiO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uIHx8IFwiXCI7XG5cdHZhciBtZXNzYWdlID0gY29uZmlnLm1lc3NhZ2U7XG5cblx0dmFyIG9rTGFiZWwgPSBjb25maWcub2tMYWJlbDtcblx0dmFyIGNhbmNlbExhYmVsID0gY29uZmlnLmNhbmNlbExhYmVsO1xuXG5cblx0ZnVuY3Rpb24gb2soKSB7XG5cdFx0Y2FsbGJhY2sodHJ1ZSk7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhbmNlbCgpIHtcblx0XHRjYWxsYmFjayhmYWxzZSk7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dmlzaWJsZTogdmlzaWJsZSxcblxuXHRcdHRpdGxlOiB0aXRsZSxcblx0XHRpY29uOiBpY29uLFxuXHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cblx0XHRva0xhYmVsOiBva0xhYmVsLFxuXHRcdGNhbmNlbExhYmVsOiBjYW5jZWxMYWJlbCxcblxuXHRcdG9rOiBvayxcblx0XHRjYW5jZWw6IGNhbmNlbFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUNvbmZpcm1Nb2RhbDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1tb2RhbC1vdmVybGF5XCIgZGF0YS1iaW5kPVwidmlzaWJsZTogdmlzaWJsZVwiPlxcblxcblx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxcIj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxfX2hlYWRlclwiIGRhdGEtYmluZD1cInN0eWxlOiBzdHlsZVwiPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cImJ1dHRvbi1jbG9zZVwiIHBhcmFtcz1cInZhcmlhdGlvbjogXFwnbW9kYWxIZWFkXFwnLCBpY29uOiBcXCcjaWNvbi1jbG9zZVxcJywgY2xpY2s6ICRjb21wb25lbnQudmlzaWJsZS50b2dnbGVcIj48L2tub2ItYnV0dG9uPlxcblxcblx0XHRcdDxzcGFuIGNsYXNzPVwiZGVzY1wiPlxcblx0XHRcdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogaWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdFx0XHQ8L3N2Zz5cXG5cdFx0XHRcdDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCI+PC9zcGFuPlxcblx0XHRcdDwvc3Bhbj5cXG5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLW1vZGFsX19ib2R5XCI+XFxuXHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRwYXJlbnQgfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi9iYXNlL3ZtXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVNb2RhbChjb25maWcpIHtcblxuXHRpZiAoIWNvbmZpZykge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZyBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy52aXNpYmxlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZpc2libGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZpc2libGUgbXVzdCBiZSBhbiBvYnNlcnZhYmxlXCIpO1xuXHR9XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciB2aXNpYmxlID0gY29uZmlnLnZpc2libGU7XG5cdHZhciB0aXRsZSA9IGNvbmZpZy50aXRsZTtcblx0dmFyIGljb24gPSBjb25maWcuaWNvbjtcblxuXHR2aXNpYmxlLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZpc2libGUoIXZpc2libGUoKSk7XG5cdH07XG5cblx0Y29uZmlnLmNvbXBvbmVudCA9IFwibW9kYWxcIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0udmlzaWJsZSA9IHZpc2libGU7XG5cdHZtLnRpdGxlID0gdGl0bGU7XG5cdHZtLmljb24gPSBpY29uO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVNb2RhbDsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdFwiPlxcblx0PCEtLSBrbyBpZjogZXJyb3IgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogZXJyb3JcIj48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcblxcblx0PGRpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2JhclwiPlxcblx0XHRcdDxpbnB1dCBjbGFzcz1cImtub2ItaW5wdXRcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBzZWFyY2gsIHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIi8+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwia25vYi1idXR0b24tc2VhcmNoXCIgcGFyYW1zPVwibGFiZWw6IFxcJ1xcJyxcXG5cdFx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1zZWFyY2hcXCdcIj5cXG5cdFx0XHQ8L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWl0ZW1zLXBlci1wYWdlIGNsYXNzPVwia25vYi1wYWdlbGlzdF9faXRlbXMtcGVyLXBhZ2VcIiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBjb3VudCxcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXMsXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPlxcblx0XHRcdDwva25vYi1pdGVtcy1wZXItcGFnZT5cXG5cdFx0XHQ8IS0tIGtvIGlmOiBzb3J0T3B0aW9ucy5sZW5ndGggPiAwIC0tPlxcblx0XHRcdFx0PGtub2ItZHJvcGRvd24gY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCIgcGFyYW1zPVwicmlnaHRJY29uOiBcXCcjaWNvbi1leHBhbmQtbW9yZVxcJywgc2VsZWN0ZWRJZHg6IHNvcnRJZHgsIHNlbGVjdGVkOiBzb3J0LCBpdGVtczogc29ydE9wdGlvbnNcIj48L2tub2ItZHJvcGRvd24+XFxuXHRcdFx0PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0XHQ8dWwgZGF0YS1iaW5kPVwiY3NzOiBsaXN0Q2xhc3MsIGZvcmVhY2g6IGl0ZW1zXCI+XFxuXHRcdFx0PGxpIGRhdGEtYmluZD1cImNzczogJHBhcmVudC5pdGVtQ2xhc3NcIj5cXG5cdFx0XHRcdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiB7bW9kZWw6ICRkYXRhLCBwYXJlbnQ6ICRwYXJlbnQsIGluZGV4OiAkaW5kZXh9IH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdFx0PC9saT5cXG5cdFx0PC91bD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2Plxcblx0PCEtLVxcblx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBwYWdpbmF0aW9uLm51bU9mSXRlbXMsIGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQtLT5cXG5cdDwhLS0ga28gaWY6IG51bU9mUGFnZXMoKSA+IDAgLS0+XFxuXHRcdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgY3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cdDwhLS0ga28gaWY6ICRkYXRhLmxvYWRNb3JlIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICFsb2FkaW5nKCksIGNsaWNrOiBsb2FkTW9yZVwiPkxvYWQgbW9yZS4uLjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLnN0b3JlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0b3JlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXG5cblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXG5cdHZhciBsaXN0ID0gY3JlYXRlTGlzdChjb25maWcpO1xuXHQvL3ZhciBwYWdpbmF0aW9uID0gY3JlYXRlUGFnaW5hdGlvbihjb25maWcucGFnaW5hdGlvbik7XG5cdC8vbGlzdC5wYWdpbmF0aW9uID0gcGFnaW5hdGlvbjtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoKTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoMTApO1xuXHR2YXIgY3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdGxpc3QubGlzdENsYXNzID0gY29uZmlnLmxpc3RDbGFzcyB8fCBcImtub2ItcGFnZWRsaXN0X19saXN0XCI7XG5cdGxpc3QuaXRlbUNsYXNzID0gY29uZmlnLml0ZW1DbGFzcyB8fCBcImtub2ItcGFnZWRsaXN0X19pdGVtXCI7XG5cdGxpc3QubnVtT2ZQYWdlcyA9IG51bU9mUGFnZXM7XG5cdGxpc3QuaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlO1xuXHRsaXN0LmN1cnJlbnRQYWdlID0gY3VycmVudFBhZ2U7XG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRsaXN0LnNraXAoY3VycmVudFBhZ2VWYWwgKiBpdGVtc1BlclBhZ2VWYWwpO1xuXHRcdGxpc3QubGltaXQoaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0Lypcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvdW50ID0gbGlzdC5jb3VudCgpO1xuXHRcdGxpc3QucGFnaW5hdGlvbi5udW1PZkl0ZW1zKGNvdW50KTtcblx0fSk7XG5cdCovXG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRsaXN0Lml0ZW1zKFtdKTtcblx0fVxuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2luYXRpb25cIiBkYXRhLWJpbmQ9XCJpZjogcGFnZVNlbGVjdG9ycygpLmxlbmd0aFwiPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1maXJzdC1wYWdlXFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGZpcnN0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogZmlyc3QoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWNoZXZyb24tbGVmdFxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBwcmV2KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogcHJldigpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImZvcmVhY2g6IHBhZ2VTZWxlY3RvcnNcIj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBsYWJlbCxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBzdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBzZWxlY3RQYWdlXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tY2hldnJvbi1yaWdodFxcJyxcXG5cdFx0XHRcdFx0XHRcdHN0YXRlOiBuZXh0KCkuc3RhdGUsXFxuXHRcdFx0XHRcdFx0XHRjbGljazogbmV4dCgpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tbGFzdC1wYWdlXFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IGxhc3QoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBsYXN0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoY29uZmlnLmFmdGVySGVhZCAmJiBjb25maWcuYWZ0ZXJIZWFkIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckhlYWQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5iZWZvcmVUYWlsICYmIGNvbmZpZy5iZWZvcmVUYWlsIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iZWZvcmVUYWlsIG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdGlmIChjb25maWcuYmVmb3JlQ3VycmVudCAmJiBjb25maWcuYmVmb3JlQ3VycmVudCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuYmVmb3JlQ3VycmVudCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmFmdGVyQ3VycmVudCAmJiBjb25maWcuYWZ0ZXJDdXJyZW50IDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5hZnRlckN1cnJlbnQgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0dmFyIG51bU9mUGFnZXM7XG5cblx0aWYgKGtvLmlzT2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcykpIHtcblx0XHRudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXM7XG5cdH0gZWxzZSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMgfHwgMTApO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlIDwgMCkge1xuXHRcdFx0dmFsdWUgPSAwO1xuXHRcdH1cblxuXHRcdHZhciBwYWdlc051bSA9IG51bU9mUGFnZXMoKTtcblxuXHRcdGlmICh2YWx1ZSA+PSBwYWdlc051bSkge1xuXHRcdFx0dmFsdWUgPSBwYWdlc051bSAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0dmFyIGN1cnJlbnRQYWdlID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoKTtcblxuXHRcdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0bnVtT2ZQYWdlcygpO1xuXHRcdFx0Y3VycmVudFBhZ2UoMCk7XG5cdFx0fSk7XG5cblx0XHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5jdXJyZW50UGFnZSkpIHtcblx0XHRcdGN1cnJlbnRQYWdlID0gY29uZmlnLmN1cnJlbnRQYWdlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUobm9ybWFsaXplKGNvbmZpZy5jdXJyZW50UGFnZSkgfHwgMCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFBhZ2UoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0Y3VycmVudFBhZ2Uobm9ybWFsaXplKHZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0oKSk7XG5cblxuXG5cdHZhciBjdXJyZW50UGFnZVJlYWxJZHg7XG5cdHZhciBwYWdlU2VsZWN0b3JzID0gKGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciBhZnRlckhlYWQgPSBjb25maWcuYWZ0ZXJIZWFkIHx8IDI7XG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xuXHRcdHZhciBiZWZvcmVDdXJyZW50ID0gY29uZmlnLmJlZm9yZUN1cnJlbnQgfHwgMjtcblx0XHR2YXIgYWZ0ZXJDdXJyZW50ID0gY29uZmlnLmFmdGVyQ3VycmVudCB8fCAyO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXG5cdFx0XHRcdHN0YXRlOiBcImRlZmF1bHRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3VycmVudFBhZ2UoaWR4KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihsYWJlbCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0XHRzdGF0ZTogXCJkaXNhYmxlZFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHt9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50cyA9IFtdO1xuXG5cdFx0XHR2YXIgbnVtT2ZQYWdlc1ZhbCA9IG51bU9mUGFnZXMoKTtcblx0XHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cblx0XHRcdHZhciBub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXG5cdFx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1PZlBhZ2VzVmFsOyBpZHggKz0gMSkge1xuXHRcdFx0XHRpZiAoaWR4IDw9IGFmdGVySGVhZCB8fCBpZHggPj0gbnVtT2ZQYWdlc1ZhbCAtIGJlZm9yZVRhaWwgLSAxIHx8IGlkeCA+PSBjdXJyZW50UGFnZVZhbCAtIGJlZm9yZUN1cnJlbnQgJiYgaWR4IDw9IGN1cnJlbnRQYWdlVmFsICsgYWZ0ZXJDdXJyZW50KSB7XG5cdFx0XHRcdFx0dmFyIHBhZ2VTZWxlY3RvcjtcblxuXHRcdFx0XHRcdGlmIChpZHggPT09IGN1cnJlbnRQYWdlVmFsKSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihpZHggKyAxKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlUmVhbElkeCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChwYWdlU2VsZWN0b3IpO1xuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFub25DbGlja2FibGVJbnNlcnRlZCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fSk7XG5cdH0oY29uZmlnKSk7XG5cblxuXHR2YXIgbmV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggKyAxO1xuXG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0aWYgKGlkeCA+PSBwYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHggPSBwYWdlcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlc1tpZHhdO1xuXHR9KTtcblxuXHR2YXIgcHJldiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggLSAxO1xuXG5cdFx0aWYgKGlkeCA8IDApIHtcblx0XHRcdGlkeCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVtpZHhdO1xuXHR9KTtcblxuXHR2YXIgZmlyc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpWzBdO1xuXHR9KTtcblxuXHR2YXIgbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblxuXHRcdHJldHVybiBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcblx0fSk7XG5cblxuXHRyZXR1cm4ge1xuXHRcdHBhZ2VTZWxlY3RvcnM6IHBhZ2VTZWxlY3RvcnMsXG5cblx0XHRmaXJzdDogZmlyc3QsXG5cdFx0bGFzdDogbGFzdCxcblxuXHRcdG5leHQ6IG5leHQsXG5cdFx0cHJldjogcHJldixcblxuXHRcdGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZSxcblxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXNcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1yYWRpb1wiIGRhdGEtYmluZD1cImZvcmVhY2g6IGl0ZW1zXCI+XFxuXHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0cGFyYW1zOiB7XFxuXHRcdFx0c3RhdGU6IGlzU2VsZWN0ZWQoKSA/IFxcJ2FjdGl2ZVxcJyA6IFxcJ2RlZmF1bHRcXCcsXFxuXHRcdFx0dmFyaWF0aW9uOiAkcGFyZW50LnZhcmlhdGlvbixcXG5cdFx0XHRsYWJlbDogbGFiZWwsXFxuXHRcdFx0aWNvbjogaWNvbixcXG5cdFx0XHRyYWRpbzogdHJ1ZSxcXG5cdFx0XHRncm91cDogZ3JvdXAsXFxuXHRcdFx0Y2xpY2s6IHNlbGVjdFxcblx0XHR9XFxuXHR9XCI+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24gY3JlYXRlUmFkaW8oY29uZmlnKSB7XG5cblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciB2bSA9IHt9O1xuXG5cdGlmIChjb25maWcuaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLml0ZW1zIHNob3VsZCBub3QgYmUgZW1wdHlcIik7XG5cdH1cblxuXHR2bS5zZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLnNlbGVjdGVkSWR4ID0gY29uZmlnLnNlbGVjdGVkSWR4IHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHR2bS52YXJpYXRpb24gPSBjb25maWcudmFyaWF0aW9uIHx8IFwiZGVmYXVsdFwiO1xuXG5cdHZtLml0ZW1zID0gW107XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLml0ZW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblxuXHRcdHZhciBhY3QgPSBjb25maWcuaXRlbXNbaWR4XTtcblxuXHRcdGlmICghYWN0LmxhYmVsICYmICFhY3QuaWNvbikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZWFjaCBlbGVtZW50IG9mIGNvbmZpZy5pdGVtcyBoYXMgdG8gaGF2ZSBsYWJlbCBhbmQvb3IgaWNvbiBwcm9wZXJ0eVwiKTtcblx0XHR9XG5cblx0XHR2bS5pdGVtcy5wdXNoKGNyZWF0ZUl0ZW1WbShhY3QubGFiZWwsIGFjdC5pY29uLCBpZHgpKTtcblx0fVxuXG5cdHZhciBzZWwgPSB2bS5zZWxlY3RlZElkeCgpO1xuXG5cdGlmICh0eXBlb2Ygc2VsID09PSBcIm51bWJlclwiKSB7XG5cdFx0c2VsID0gTWF0aC5mbG9vcihzZWwpO1xuXHRcdHNlbCAlPSB2bS5pdGVtcy5sZW5ndGg7XG5cblx0XHR2bS5pdGVtc1tzZWxdLnNlbGVjdCgpO1xuXG5cdH0gZWxzZSB7XG5cdFx0dm0uaXRlbXNbMF0uc2VsZWN0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVJdGVtVm0obGFiZWwsIGljb24sIGlkeCkge1xuXG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBsYWJlbCxcblx0XHRcdGljb246IGljb24sXG5cdFx0XHRncm91cDogY29uZmlnLmdyb3VwLFxuXHRcdFx0c2VsZWN0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dm0uc2VsZWN0ZWQob2JqKTtcblx0XHRcdFx0dm0uc2VsZWN0ZWRJZHgoaWR4KTtcblx0XHRcdH0sXG5cdFx0XHRpc1NlbGVjdGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9iaiA9PT0gdm0uc2VsZWN0ZWQoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSYWRpbztcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlXCI+XFxuXHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJHBhcmVudCB9IC0tPjwhLS0gL2tvIC0tPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uLy4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRhYihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb25maWcuY29tcG9uZW50ID0gXCJ0YWJcIjtcblx0Y29uZmlnLnZhcmlhdGlvbiA9IFwidGFiXCI7XG5cdGNvbmZpZy5zdGF0ZSA9IFwiYWN0aXZlXCI7XG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVGFiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDxrbm9iLXJhZGlvIGNsYXNzPVwia25vYi1yYWRpby0taW5saW5lXCIgcGFyYW1zPVwiXFxuXHRcdGdyb3VwOiB0YWJzR3JvdXAsXFxuXHRcdHZhcmlhdGlvbjogXFwndGFiXFwnLFxcblx0XHRzZWxlY3RlZElkeDogc2VsZWN0ZWRJZHgsXFxuXHRcdGl0ZW1zOiBidXR0b25zXCI+XFxuXHQ8L2tub2ItcmFkaW8+XFxuXFxuXHQ8ZGl2IGRhdGEtYmluZD1cImZvcmVhY2g6IHBhbmVsc1wiPlxcblx0XHQ8a25vYi10YWIgZGF0YS1iaW5kPVwidmlzaWJsZTogJHBhcmVudC5zZWxlY3RlZElkeCgpID09ICRpbmRleCgpXCI+XFxuXHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0PC9rbm9iLXRhYj5cXG5cdDwvZGl2PlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG52YXIgbmV4dFRhYnNHcm91cElkeCA9IDA7XG5cbmZ1bmN0aW9uIGNvbnZlcnRQYXJhbXNUb09iamVjdChwYXJhbXMpIHtcblx0cGFyYW1zID0gcGFyYW1zLnJlcGxhY2UoLycvZywgXCJcXFwiXCIpO1xuXG5cdHZhciBwYXJhbXMgPSBwYXJhbXMuc3BsaXQoXCIsXCIpO1xuXG5cdHZhciBjb252ZXJ0ZWRQYXJhbXMgPSBbXTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBwYXJhbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3QgPSBwYXJhbXNbaWR4XTtcblxuXHRcdGFjdCA9IGFjdC50cmltKCk7XG5cblx0XHRhY3QgPSBhY3Quc3BsaXQoXCI6XCIpO1xuXG5cdFx0aWYgKGFjdC5sZW5ndGggIT09IDIpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGFjdCA9IFwiXFxcIlwiICsgYWN0WzBdICsgXCJcXFwiXCIgKyBcIjpcIiArIGFjdFsxXTtcblx0XHRjb252ZXJ0ZWRQYXJhbXMucHVzaChhY3QpO1xuXHR9XG5cblx0cmV0dXJuIEpTT04ucGFyc2UoXCJ7XCIgKyBjb252ZXJ0ZWRQYXJhbXMuam9pbihcIixcIikgKyBcIn1cIik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRhYnMoY29uZmlnLCBjb21wb25lbnRJbmZvKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblx0Y29tcG9uZW50SW5mbyA9IGNvbXBvbmVudEluZm8gfHwge307XG5cdGNvbXBvbmVudEluZm8udGVtcGxhdGVOb2RlcyA9IGNvbXBvbmVudEluZm8udGVtcGxhdGVOb2RlcyB8fCBbXTtcblxuXHR2YXIgZGVmYXVsdFRhYiA9IGNvbmZpZy5kZWZhdWx0VGFiIHx8IDA7XG5cblx0dmFyIHZtID0ge307XG5cblx0dmFyIHRhYkJ1dHRvbnMgPSBbXTtcblx0dmFyIHRhYlBhbmVscyA9IFtdO1xuXG5cdHZhciB0YWJJZHggPSAwO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbXBvbmVudEluZm8udGVtcGxhdGVOb2Rlcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdFRlbXBsYXRlTm9kZSA9IGNvbXBvbmVudEluZm8udGVtcGxhdGVOb2Rlc1tpZHhdO1xuXG5cdFx0aWYgKGFjdFRlbXBsYXRlTm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcImtub2ItdGFiXCIpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdHZhciB0YWJCdXR0b25EYXRhID0gY29udmVydFBhcmFtc1RvT2JqZWN0KGFjdFRlbXBsYXRlTm9kZS5nZXRBdHRyaWJ1dGUoXCJwYXJhbXNcIikpO1xuXG5cdFx0dGFiQnV0dG9uRGF0YS50YWJJZHggPSB0YWJJZHg7XG5cdFx0dGFiSWR4ICs9IDE7XG5cblx0XHR0YWJCdXR0b25zLnB1c2godGFiQnV0dG9uRGF0YSk7XG5cblx0XHR0YWJQYW5lbHMucHVzaChhY3RUZW1wbGF0ZU5vZGUuY2hpbGROb2Rlcyk7XG5cdH1cblxuXHRpZiAodGFiUGFuZWxzLmxlbmd0aCA8IDEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJrbm9iLXRhYnMgY29tcG9uZW50IHNob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBrbm9iLXRhYiBjb21wb25lbnQgYXMgYSBjaGlsZCBjb21wb25lbnQhXCIpO1xuXHR9XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGFiQnV0dG9ucy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdCA9IHRhYkJ1dHRvbnNbaWR4XTtcblxuXHRcdGlmICghYWN0Lmljb24gJiYgIWFjdC5sZWZ0SWNvbiAmJiAhYWN0LnJpZ2h0SWNvbiAmJiAhYWN0LmxhYmVsKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY2hpbGQga25vYi10YWIgY29tcG9uZW50cyBzaG91bGQgaGF2ZSBwcm9wZXIgcGFyYW1zIChpY29uIGFuZC9vciBsYWJlbCkganVzdCBsaWtlIHdpdGggYnV0dG9ucyFcIik7XG5cdFx0fVxuXHR9XG5cblx0dm0udGFic0dyb3VwID0gXCJ0YWJzR3JvdXBfXCIgKyBuZXh0VGFic0dyb3VwSWR4O1xuXHRuZXh0VGFic0dyb3VwSWR4ICs9IDE7XG5cblx0dm0uc2VsZWN0ZWRJZHggPSBrby5vYnNlcnZhYmxlKGRlZmF1bHRUYWIpO1xuXG5cdHZtLmJ1dHRvbnMgPSB0YWJCdXR0b25zO1xuXHR2bS5wYW5lbHMgPSB0YWJQYW5lbHM7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVRhYnM7XG4iXX0=
