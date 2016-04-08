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
module.exports = '<input data-bind="css: cssClass,\n					style: style,\n					attr: {type: type, placeholder: placeholder},\n					event: eventHandlers,\n					hasFocus: hasFocus,\n					disable: state() === \'disabled\',\n					value: value,\n					valueUpdate: \'afterkeydown\'" />';
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
	config.placeholder = config.placeholder || "";

	var vm = base(config);

	vm.behaviours.hover.enable();
	vm.behaviours.focus.enable();

	vm.placeholder = config.placeholder;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbCIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL21vZGFsL2FsZXJ0L3RlbXBsYXRlLmh0bWwiLCJzcmMvbW9kYWwvYWxlcnQvdm0uanMiLCJzcmMvbW9kYWwvY29uZmlybS90ZW1wbGF0ZS5odG1sIiwic3JjL21vZGFsL2NvbmZpcm0vdm0uanMiLCJzcmMvbW9kYWwvc3R5bGUuanMiLCJzcmMvbW9kYWwvdGVtcGxhdGUuaHRtbCIsInNyYy9tb2RhbC92bS5qcyIsInNyYy9wYWdlZExpc3QvdGVtcGxhdGUuaHRtbCIsInNyYy9wYWdlZExpc3Qvdm0uanMiLCJzcmMvcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2luYXRpb24vdm0uanMiLCJzcmMvcmFkaW8vdGVtcGxhdGUuaHRtbCIsInNyYy9yYWRpby92bS5qcyIsInNyYy90YWJzL3RhYi90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdGFiL3ZtLmpzIiwic3JjL3RhYnMvdGVtcGxhdGUuaHRtbCIsInNyYy90YWJzL3ZtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbGlja0JlaGF2aW91cih2bSkge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VEb3duKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZWRvd24gPSBtb3VzZURvd247XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb2N1c0JlaGF2aW91cih2bSkge1xuXG5cdGlmICghdm0pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bSBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUodm0uc3RhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0uc3RhdGUgaGFzIHRvIGJlIGEga25vY2tvdXQgb2JzZXJ2YWJsZSFcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBmb2N1cygpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJsdXIoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJkZWZhdWx0XCIpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5mb2N1cyA9IGZvY3VzO1xuXHR2bS5ldmVudEhhbmRsZXJzLmJsdXIgPSBibHVyO1xuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaG92ZXJCZWhhdmlvdXIodm0pIHtcblx0aWYgKCF2bSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWtvLmlzT2JzZXJ2YWJsZSh2bS5zdGF0ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ2bS5zdGF0ZSBoYXMgdG8gYmUgYSBrbm9ja291dCBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdHZhciBwcmV2aW91c1N0YXRlO1xuXG5cdGZ1bmN0aW9uIG1vdXNlT3ZlcigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIgfHwgYWN0U3RhdGUgPT09IFwiYWN0aXZlXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYWN0U3RhdGUgIT09IFwiaG92ZXJcIikge1xuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIgfHwgYWN0U3RhdGUgPT09IFwiYWN0aXZlXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShwcmV2aW91c1N0YXRlKTtcblx0fVxuXG5cdGlmICghdm0uZXZlbnRIYW5kbGVycykge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMgPSB7fTtcblx0fVxuXG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2VvdmVyID0gbW91c2VPdmVyO1xuXHR2bS5ldmVudEhhbmRsZXJzLm1vdXNlb3V0ID0gbW91c2VPdXQ7XG5cblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB2bXMgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3RCZWhhdmlvdXIodm0sIGNvbmZpZykge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgZ3JvdXAgPSBjb25maWcuZ3JvdXAgfHwgXCJkZWZhdWx0XCI7XG5cblx0aWYgKCF2bXNbZ3JvdXBdKSB7XG5cdFx0dm1zW2dyb3VwXSA9IFtdO1xuXHR9XG5cblx0dm1zW2dyb3VwXS5wdXNoKHZtKTtcblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBhY3RHcm91cFZtcyA9IHZtc1tncm91cF07XG5cblx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhY3RHcm91cFZtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0XHR2YXIgYWN0Vm0gPSBhY3RHcm91cFZtc1tpZHhdO1xuXG5cdFx0XHRpZiAoYWN0Vm0gPT09IHZtKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRhY3RWbS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZWRvd24gPSBtb3VzZURvd247XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGhvdmVyQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9ob3ZlclwiKTtcbnZhciBmb2N1c0JlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvZm9jdXNcIik7XG52YXIgY2xpY2tCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2NsaWNrXCIpO1xudmFyIHNlbGVjdEJlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvc2VsZWN0XCIpO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VWbShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLmNvbXBvbmVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jb21wb25lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLnN0eWxlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0eWxlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHR2YXIgY29tcG9uZW50ID0gY29uZmlnLmNvbXBvbmVudDtcblx0dmFyIHN0eWxlID0gY29uZmlnLnN0eWxlO1xuXG5cdHZhciBzdGF0ZSA9IGtvLm9ic2VydmFibGUoY29uZmlnLnN0YXRlIHx8IFwiZGVmYXVsdFwiKTtcblx0dmFyIHZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblxuXHR2YXIgY3NzQ2xhc3NDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBcImtub2ItXCIgKyBjb21wb25lbnQgKyBcIiBzdGF0ZS1cIiArIHN0YXRlKCkgKyBcIiB2YXJpYXRpb24tXCIgKyB2YXJpYXRpb247XG5cdH0pO1xuXHR2YXIgc3R5bGVDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdGF0ZVZhbCA9IHN0YXRlKCk7XG5cblx0XHRyZXR1cm4gc3R5bGVbdmFyaWF0aW9uXVtzdGF0ZVZhbF07XG5cdH0pO1xuXG5cdHZhciB2bSA9IHtcblx0XHR2YXJpYXRpb246IHZhcmlhdGlvbixcblx0XHRzdGF0ZTogc3RhdGUsXG5cblx0XHRjc3NDbGFzczogY3NzQ2xhc3NDb21wdXRlZCxcblx0XHRzdHlsZTogc3R5bGVDb21wdXRlZCxcblxuXHRcdGV2ZW50SGFuZGxlcnM6IHt9XG5cdH07XG5cblxuXHRmdW5jdGlvbiBjcmVhdGVFbmFibGVyKGJlaGF2aW91ciwgcHJvcHMpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZW5hYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0YmVoYXZpb3VyKHZtLCBjb25maWcpO1xuXHRcdFx0fSxcblx0XHRcdGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0XHRpZiAodm0uZXZlbnRIYW5kbGVyc1twcm9wXSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHZtLmV2ZW50SGFuZGxlcnNbcHJvcF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0dm0uYmVoYXZpb3VycyA9IHtcblx0XHRob3ZlcjogY3JlYXRlRW5hYmxlcihob3ZlckJlaGF2aW91ciwgW1wibW91c2VvdmVyXCIsIFwibW91c2VvdXRcIl0pLFxuXHRcdGZvY3VzOiBjcmVhdGVFbmFibGVyKGZvY3VzQmVoYXZpb3VyLCBbXCJmb2N1c1wiLCBcImJsdXJcIl0pLFxuXHRcdGNsaWNrOiBjcmVhdGVFbmFibGVyKGNsaWNrQmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKSxcblx0XHRzZWxlY3Q6IGNyZWF0ZUVuYWJsZXIoc2VsZWN0QmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKVxuXHR9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlVm07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlDb2xvcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5tZWRpdW1HcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwcmltYXJ5XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnNlY29uZGFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuc2Vjb25kYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5saWdodEdyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ0YWJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5kYXJrR3JheVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLmJsYWNrLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJwYWdpbmF0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGFya0dyYXksXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZTBcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmRhcmtHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwibW9kYWxIZWFkXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnRyYW5zcGFyZW50LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUudHJhbnNwYXJlbnQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUubWVkaXVtR3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLm1lZGl1bUdyYXlcblx0XHRcdH0sXG5cdFx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnRyYW5zcGFyZW50LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUud2hpdGVcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwiYWN0aW9uXCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmluZm8udGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJsYWNrXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJvcmRlckNvbG9yXCI6IHRoZW1lLndoaXRlLFxuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5pbmZvLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5ibGFja1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJkYW5nZXJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYm9yZGVyQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmVycm9yLnRleHQsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZXJyb3IuYmxhY2ssXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5lcnJvci5ibGFja1xuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJib3JkZXJDb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZXJyb3IudGV4dCxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5lcnJvci5ibGFjayxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmVycm9yLmJsYWNrXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxidXR0b24gZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRjbGljazogY2xpY2ssXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJ1wiPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogbGVmdEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBsZWZ0SWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdDwvc3ZnPlxcblx0PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtYmluZD1cInRleHQ6IGxhYmVsXCI+PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogcmlnaHRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+XFxuXHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogcmlnaHRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuPC9idXR0b24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihjb25maWcpIHtcblx0aWYgKCFjb25maWcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmIChjb25maWcuY2xpY2sgJiYgdHlwZW9mIGNvbmZpZy5jbGljayAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY2xpY2sgaGFzIHRvIGJlIGEgZnVuY3Rpb24hXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcubGFiZWwgJiYgIWNvbmZpZy5sZWZ0SWNvbiAmJiAhY29uZmlnLnJpZ2h0SWNvbiAmJiAhY29uZmlnLmljb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlaXRoZXIgbGFiZWwvbGVmdGljb24vcmlnaHRpY29uL2ljb24gaGFzIHRvIGJlIGdpdmVuIVwiKTtcblx0fVxuXG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImJ1dHRvblwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS5iZWhhdmlvdXJzLmhvdmVyLmVuYWJsZSgpO1xuXG5cdGlmIChjb25maWcucmFkaW8pIHtcblx0XHR2bS5iZWhhdmlvdXJzLnNlbGVjdC5lbmFibGUoKTtcblx0fSBlbHNlIHtcblx0XHR2bS5iZWhhdmlvdXJzLmNsaWNrLmVuYWJsZSgpO1xuXHR9XG5cblx0dm0ubGVmdEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGVmdEljb24gfHwgY29uZmlnLmljb24pKTtcblx0dm0ucmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLnJpZ2h0SWNvbikpO1xuXHR2bS5sYWJlbCA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sYWJlbCkpO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG52YXIgYmFzZVZtID0gcmVxdWlyZShcIi4vYmFzZS92bVwiKTtcblxudmFyIGNyZWF0ZUJ1dHRvblN0eWxlID0gcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlXCIpO1xudmFyIGNyZWF0ZUlucHV0U3R5bGUgPSByZXF1aXJlKFwiLi9pbnB1dC9zdHlsZVwiKTtcbnZhciBjcmVhdGVNb2RhbFN0eWxlID0gcmVxdWlyZShcIi4vbW9kYWwvc3R5bGVcIik7XG5cbmZ1bmN0aW9uIGluaXRLbm9iKHRoZW1lKSB7XG5cblx0dmFyIGJ1dHRvblN0eWxlID0gY3JlYXRlQnV0dG9uU3R5bGUodGhlbWUpO1xuXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgYnV0dG9uU3R5bGUpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItaW5wdXRcIiwgcmVxdWlyZShcIi4vaW5wdXQvdm1cIiksIHJlcXVpcmUoXCIuL2lucHV0L3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZUlucHV0U3R5bGUodGhlbWUpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXJhZGlvXCIsIHJlcXVpcmUoXCIuL3JhZGlvL3ZtXCIpLCByZXF1aXJlKFwiLi9yYWRpby90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWlubGluZS10ZXh0LWVkaXRvclwiLCByZXF1aXJlKFwiLi9pbmxpbmVUZXh0RWRpdG9yL3ZtXCIpLCByZXF1aXJlKFwiLi9pbmxpbmVUZXh0RWRpdG9yL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItZHJvcGRvd25cIiwgcmVxdWlyZShcIi4vZHJvcGRvd24vdm1cIiksIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnaW5hdGlvblwiLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3ZtXCIpLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWl0ZW1zLXBlci1wYWdlXCIsIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS92bVwiKSwgcmVxdWlyZShcIi4vaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnZWQtbGlzdFwiLCByZXF1aXJlKFwiLi9wYWdlZExpc3Qvdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sXCIpKTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItbW9kYWxcIiwgcmVxdWlyZShcIi4vbW9kYWwvdm1cIiksIHJlcXVpcmUoXCIuL21vZGFsL3RlbXBsYXRlLmh0bWxcIiksIGNyZWF0ZU1vZGFsU3R5bGUodGhlbWUpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWNvbmZpcm1cIiwgcmVxdWlyZShcIi4vbW9kYWwvY29uZmlybS92bVwiKSwgcmVxdWlyZShcIi4vbW9kYWwvY29uZmlybS90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVNb2RhbFN0eWxlKHRoZW1lKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1hbGVydFwiLCByZXF1aXJlKFwiLi9tb2RhbC9hbGVydC92bVwiKSwgcmVxdWlyZShcIi4vbW9kYWwvYWxlcnQvdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlTW9kYWxTdHlsZSh0aGVtZSkpO1xuXG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi10YWJzXCIsIHJlcXVpcmUoXCIuL3RhYnMvdm1cIiksIHJlcXVpcmUoXCIuL3RhYnMvdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi10YWJcIiwgcmVxdWlyZShcIi4vdGFicy90YWIvdm1cIiksIHJlcXVpcmUoXCIuL3RhYnMvdGFiL3RlbXBsYXRlLmh0bWxcIiksIGJ1dHRvblN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRLbm9iLFxuXG5cdHJlZ2lzdGVyQ29tcG9uZW50OiByZWdpc3RlckNvbXBvbmVudCxcblx0YmFzZToge1xuXHRcdHZtOiBiYXNlVm1cblx0fVxufTtcbi8vIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd25cIj5cXG5cdDwhLS0gd2l0aCBwYXJhbXMsIHRoZSBzZWxlY3RlZCgpLmxhYmVsIHdvblxcJ3QgYmUgcmVjYWxjdWxhdGVkLCB3aGVuIHNlbGVjdGVkIGlzIGNoYW5nZWQuLi4gLS0+XFxuXHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge2xhYmVsOiBzZWxlY3RlZCgpLmxhYmVsLFxcblx0XHRcdFx0XHRcdGljb246IHNlbGVjdGVkKCkuaWNvbixcXG5cdFx0XHRcdFx0XHRyaWdodEljb246IHJpZ2h0SWNvbixcXG5cdFx0XHRcdFx0XHRjbGljazogZHJvcGRvd25WaXNpYmxlLnRvZ2dsZX19XCI+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgY2xhc3M9XCJrbm9iLWRyb3Bkb3duLW1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBvcHRpb25zLCB2aXNpYmxlOiBkcm9wZG93blZpc2libGVcIj5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IGxhYmVsLCBpY29uOiBpY29uLCBjbGljazogc2VsZWN0fX0sIFxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogJGRhdGEgIT09ICRwYXJlbnQuc2VsZWN0ZWQoKVwiPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbkRyb3Bkb3duKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcucmlnaHRJY29uKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnJpZ2h0SWNvbiBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblx0aWYgKCFjb25maWcuaXRlbXMpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuaXRlbXMgZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cdGlmIChjb25maWcuc2VsZWN0ZWQgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcuc2VsZWN0ZWQpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlbGVjdGVkIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5pdGVtcy5sZW5ndGggPT09IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuaXRlbXMgc2hvdWxkIG5vdCBiZSBlbXB0eVwiKTtcblx0fVxuXG5cdHZhciByaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5yaWdodEljb24pO1xuXG5cdHZhciBvcHRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXG5cdFx0aWYgKCFjb25maWcuaXRlbXNbaWR4XS5sYWJlbCAmJiAhY29uZmlnLml0ZW1zW2lkeF0uaWNvbikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiZWFjaCBlbGVtZW50IG9mIGNvbmZpZy5pdGVtcyBoYXMgdG8gaGF2ZSBsYWJlbCBhbmQvb3IgaWNvbiBwcm9wZXJ0eVwiKTtcblx0XHR9XG5cdFx0b3B0aW9ucy5wdXNoKGNyZWF0ZU9wdGlvbih7XG5cdFx0XHRsYWJlbDogY29uZmlnLml0ZW1zW2lkeF0ubGFiZWwsXG5cdFx0XHRpY29uOiBjb25maWcuaXRlbXNbaWR4XS5pY29uLFxuXHRcdFx0dmFsdWU6IGNvbmZpZy5pdGVtc1tpZHhdLnZhbHVlXG5cdFx0fSkpO1xuXHR9XG5cblx0Ly8gY29uc29sZS5sb2cob3B0aW9ucygpKTtcblxuXHR2YXIgc2VsZWN0ZWQgPSBjb25maWcuc2VsZWN0ZWQgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdHNlbGVjdGVkKG9wdGlvbnMoKVtjb25maWcuc2VsZWN0ZWRJZHggfHwgMF0pO1xuXG5cdHZhciBkcm9wZG93blZpc2libGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRkcm9wZG93blZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlRHJvcGRvd25WaXNpYmxlKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR2YXIgdmlzaWJsZSA9IGRyb3Bkb3duVmlzaWJsZSgpO1xuXG5cdFx0ZHJvcGRvd25WaXNpYmxlKCF2aXNpYmxlKTtcblxuXHRcdC8vIHNob3VsZCByZW1vdmUgdGhpcyB3aGVuIHRlc3QgaW4gcGhhbnRvbWpzXG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodmlzaWJsZSkge1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGVEcm9wZG93blZpc2libGUsIGZhbHNlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGVEcm9wZG93blZpc2libGUsIGZhbHNlKTtcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gY3JlYXRlT3B0aW9uKGNvbmZpZykge1xuXHRcdHZhciBvYmogPSB7XG5cdFx0XHRsYWJlbDoga28ub2JzZXJ2YWJsZShjb25maWcubGFiZWwpLFxuXHRcdFx0aWNvbjoga28ub2JzZXJ2YWJsZShjb25maWcuaWNvbiksXG5cdFx0XHR2YWx1ZTogY29uZmlnLnZhbHVlLFxuXHRcdFx0c2VsZWN0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZWN0ZWQob2JqKTtcblx0XHRcdFx0ZHJvcGRvd25WaXNpYmxlLnRvZ2dsZSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRyaWdodEljb246IHJpZ2h0SWNvbixcblxuXHRcdHNlbGVjdGVkOiBzZWxlY3RlZCxcblx0XHRvcHRpb25zOiBvcHRpb25zLFxuXG5cdFx0ZHJvcGRvd25WaXNpYmxlOiBkcm9wZG93blZpc2libGVcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b25Ecm9wZG93bjtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxzcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogIWVkaXRNb2RlKClcIj5cXG5cdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdmFsdWVcIj48L3NwYW4+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogZWRpdCwgaWNvbjogXFwnI2ljb24tZWRpdFxcJ1wiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogZWRpdE1vZGVcIj5cXG5cdFx0PGtub2ItaW5wdXQgcGFyYW1zPVwidmFsdWU6IGVkaXRlZFZhbHVlLCBoYXNGb2N1czogaW5wdXRIYXNGb2N1cywga2V5RG93bjoga2V5RG93biwgdmlzaWJsZTogZWRpdE1vZGVcIj48L2tub2ItaW5wdXQ+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogc2F2ZSwgaWNvbjogXFwnI2ljb24tZG9uZVxcJ1wiPjwva25vYi1idXR0b24+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBjbGljazogY2FuY2VsLCBpY29uOiBcXCcjaWNvbi1jbG9zZVxcJ1wiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuPC9zcGFuPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5mdW5jdGlvbiBjcmVhdGVJbmxpbmVUZXh0RWRpdG9yKGNvbmZpZykge1xuXHR2YXIgdm0gPSB7fTtcblxuXHR2YXIgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmIChjb25maWcudmFsdWUgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcudmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZhbHVlIGhhcyB0byBiZSBhbiBvYnNlcnZhYmxlIVwiKTtcblx0fVxuXG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlIHx8IGtvLm9ic2VydmFibGUoXCJcIik7XG5cdHZtLmVkaXRlZFZhbHVlID0ga28ub2JzZXJ2YWJsZSh2bS52YWx1ZSgpKTtcblxuXHR2bS5lZGl0TW9kZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdHZtLmVkaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5lZGl0ZWRWYWx1ZSh2bS52YWx1ZSgpKTtcblx0XHR2bS5lZGl0TW9kZSh0cnVlKTtcblx0XHR2bS5pbnB1dEhhc0ZvY3VzKHRydWUpO1xuXHR9O1xuXG5cdHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2bS52YWx1ZSh2bS5lZGl0ZWRWYWx1ZSgpKTtcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XG5cdH07XG5cblx0dm0uY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0dm0uZWRpdE1vZGUoZmFsc2UpO1xuXHR9O1xuXG5cdHZtLmtleURvd24gPSBmdW5jdGlvbihpdGVtLCBldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0cmV0dXJuIHZtLnNhdmUoKTtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcblx0XHRcdHJldHVybiB2bS5jYW5jZWwoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0dm0uaW5wdXRIYXNGb2N1cyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVJbmxpbmVUZXh0RWRpdG9yO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5ibGFjayxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuZGFya0dyYXlcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLmRhcmtHcmF5XG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5wcmltYXJ5Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUubGlnaHRHcmF5LFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmxpZ2h0R3JheSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmxpZ2h0R3JheVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8aW5wdXQgZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRhdHRyOiB7dHlwZTogdHlwZSwgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyfSxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGhhc0ZvY3VzOiBoYXNGb2N1cyxcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCcsXFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLnZhbHVlICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLnZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy52YWx1ZSBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmhhc0ZvY3VzICYmICFrby5pc09ic2VydmFibGUoY29uZmlnLmhhc0ZvY3VzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5oYXNGb2N1cyBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXHRjb25maWcucGxhY2Vob2xkZXIgPSBjb25maWcucGxhY2Vob2xkZXIgfHwgXCJcIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0uYmVoYXZpb3Vycy5ob3Zlci5lbmFibGUoKTtcblx0dm0uYmVoYXZpb3Vycy5mb2N1cy5lbmFibGUoKTtcblxuXHR2bS5wbGFjZWhvbGRlciA9IGNvbmZpZy5wbGFjZWhvbGRlcjtcblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLmhhc0ZvY3VzID0gY29uZmlnLmhhc0ZvY3VzIHx8IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdGlmIChjb25maWcua2V5RG93bikge1xuXHRcdHZtLmV2ZW50SGFuZGxlcnMua2V5ZG93biA9IGNvbmZpZy5rZXlEb3duO1xuXHR9XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlucHV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1zUGVyUGFnZShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLm51bU9mSXRlbXMpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcubnVtT2ZJdGVtcyBlbGVtZW50IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG5cblx0XHRcdGlmICghY29uZmlnLml0ZW1zUGVyUGFnZUxpc3RbaV0udmFsdWUgJiYgIWNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0W2ldLmxhYmVsKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImVhY2ggZWxlbWVudCBvZiBjb25maWcuaXRlbXMgaGFzIHRvIGhhdmUgbGFiZWwgYW5kL29yIHZhbHVlIHByb3BlcnR5XCIpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0dmFyIG51bU9mSXRlbXMgPSBjb25maWcubnVtT2ZJdGVtcztcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XG5cdFx0bGFiZWw6IDEwLFxuXHRcdHZhbHVlOiAxMFxuXHR9LCB7XG5cdFx0bGFiZWw6IDI1LFxuXHRcdHZhbHVlOiAyNVxuXHR9LCB7XG5cdFx0bGFiZWw6IDUwLFxuXHRcdHZhbHVlOiA1MFxuXHR9LCB7XG5cdFx0bGFiZWw6IDEwMCxcblx0XHR2YWx1ZTogMTAwXG5cdH1dO1xuXG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKGl0ZW1zUGVyUGFnZUxpc3RbMF0pO1xuXG5cdHZhciBudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXMgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBudW1PZkl0ZW1zVmFsID0gbnVtT2ZJdGVtcygpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGlmICghaXRlbXNQZXJQYWdlVmFsKSB7XG5cdFx0XHRyZXR1cm4gbnVtT2ZQYWdlcygwKTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZSkge1xuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxuXG5cdFx0aXRlbXNQZXJQYWdlTGlzdDogaXRlbXNQZXJQYWdlTGlzdFxuXHR9O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24ga25vYlJlZ2lzdGVyQ29tcG9uZW50KG5hbWUsIGNyZWF0ZVZtLCB0ZW1wbGF0ZSwgc3R5bGUpIHtcblx0a28uY29tcG9uZW50cy5yZWdpc3RlcihuYW1lLCB7XG5cdFx0dmlld01vZGVsOiB7XG5cdFx0XHRjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcywgY29tcG9uZW50SW5mbykge1xuXHRcdFx0XHRwYXJhbXMuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVZtKHBhcmFtcywgY29tcG9uZW50SW5mbyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga25vYlJlZ2lzdGVyQ29tcG9uZW50O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInN0b3JlXCIpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0b3JlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImZpZWxkc1wiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5maWVsZHMgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmhhc093blByb3BlcnR5KFwic29ydFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zb3J0IGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcInNlYXJjaFwiKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5zZWFyY2ggaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLnN0b3JlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNlYXJjaCBtdXN0IGJlIGFuIG9iamVjdCFcIik7XG5cdH1cblxuXHRpZiAoIShjb25maWcuZmllbGRzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmZpZWxkcyBtdXN0IGJlIGFuIGFycmF5IVwiKTtcblx0fVxuXG5cdGlmICghKGNvbmZpZy5zb3J0IGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnNvcnQgbXVzdCBiZSBhbiBhcnJheSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5zZWFyY2ggIT09IFwic3RyaW5nXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc2VhcmNoIG11c3QgYmUgYSBzdHJpbmchXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5maWVsZHMuaW5kZXhPZihjb25maWcuc2VhcmNoKSA9PT0gLTEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuZmllbGRzIG11c3QgY29udGFpbiB0aGUgdmFsdWUgb2YgY29uZmlnLnNlYXJjaCFcIik7XG5cdH1cblxuXHR2YXIgb3JkZXJGaWVsZDtcblxuXHRpZiAoY29uZmlnLm9yZGVyQnkpIHtcblx0XHRpZiAodHlwZW9mIGNvbmZpZy5vcmRlckJ5ICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub3JkZXJCeSBtdXN0IGhhdmUgdGhlIGZvcm1hdCBvZiB7IDxrZXk+OiBbMTstMV0gfSBcIik7XG5cdFx0fVxuXG5cdFx0b3JkZXJGaWVsZCA9IE9iamVjdC5rZXlzKGNvbmZpZy5vcmRlckJ5KVswXTtcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKG9yZGVyRmllbGQpID09PSAtMSB8fCBNYXRoLmFicyhjb25maWcub3JkZXJCeVtvcmRlckZpZWxkXSkgIT09IDEpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5vcmRlckJ5IG11c3QgaGF2ZSB0aGUgZm9ybWF0IG9mIHsgPGtleT46IFsxOy0xXSB9IFwiKTtcblx0XHR9XG5cblx0XHR2YXIgc29ydENvbnRhaW5zT3JkZXJGaWVsZCA9IGZhbHNlO1xuXG5cdFx0Y29uZmlnLnNvcnQuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRpZiAoaXRlbS52YWx1ZSA9PT0gb3JkZXJGaWVsZCkge1xuXHRcdFx0XHRzb3J0Q29udGFpbnNPcmRlckZpZWxkID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFzb3J0Q29udGFpbnNPcmRlckZpZWxkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc29ydCBtdXN0IGNvbnRhaW4gdGhlIHZhbHVlIG9mIGNvbmZpZy5vcmRlckJ5IVwiKTtcblx0XHR9XG5cdH1cblxuXHRjb25maWcuc29ydC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRpZiAoY29uZmlnLmZpZWxkcy5pbmRleE9mKGl0ZW0udmFsdWUpID09PSAtMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwidmFsdWVzIG9mIGNvbmZpZy5zb3J0IG11c3QgYmUgaW4gY29uZmlnLmZpZWxkcyFcIik7XG5cdFx0fVxuXHR9KTtcblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cdHZhciBmaWVsZHMgPSBjb25maWcuZmllbGRzO1xuXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IGNvbmZpZy50aHJvdHRsZSB8fCA1MDBcblx0fSk7XG5cblx0dmFyIHNvcnRPcHRpb25zID0gW107XG5cblx0dmFyIGRlZmF1bHRPcmRlcklkeDtcblxuXHRmdW5jdGlvbiBjcmVhdGVRdWVyeU9iaihwcm9wLCBhc2MpIHtcblx0XHR2YXIgb2JqID0ge307XG5cblx0XHRvYmpbcHJvcF0gPSBhc2M7XG5cblx0XHRpZiAob3JkZXJGaWVsZCAmJiBwcm9wID09PSBvcmRlckZpZWxkICYmIGFzYyA9PT0gY29uZmlnLm9yZGVyQnlbb3JkZXJGaWVsZF0pIHtcblx0XHRcdGRlZmF1bHRPcmRlcklkeCA9IHNvcnRPcHRpb25zLmxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLnNvcnQubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdHZhciBhY3QgPSBjb25maWcuc29ydFtpZHhdO1xuXG5cdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRpY29uOiBcIiNpY29uLXNvcnQtYXNjXCIsXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgMSlcblx0XHR9KTtcblx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdGljb246IFwiI2ljb24tc29ydC1kZXNjXCIsXG5cdFx0XHRsYWJlbDogYWN0LmxhYmVsLFxuXHRcdFx0dmFsdWU6IGNyZWF0ZVF1ZXJ5T2JqKGFjdC52YWx1ZSwgLTEpXG5cdFx0fSk7XG5cdH1cblxuXHR2YXIgc29ydCA9IGtvLm9ic2VydmFibGUoc29ydE9wdGlvbnNbZGVmYXVsdE9yZGVySWR4IHx8IDBdKTtcblx0dmFyIHNvcnRJZHggPSBkZWZhdWx0T3JkZXJJZHggfHwgMDtcblxuXHR2YXIgc2tpcCA9IGtvLm9ic2VydmFibGUoMCk7XG5cdHZhciBsaW1pdCA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0dmFyIGl0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdH0pO1xuXG5cdHZhciBjb3VudCA9IGtvLm9ic2VydmFibGUoMCk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXG5cdHZhciBsb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXHR2YXIgZXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5P1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWFyY2hWYWwgPSBzZWFyY2goKTtcblx0XHR2YXIgc29ydFZhbCA9IHNvcnQoKS52YWx1ZTtcblx0XHR2YXIgc2tpcFZhbCA9IHNraXAoKTtcblx0XHR2YXIgbGltaXRWYWwgPSBsaW1pdCgpO1xuXG5cdFx0dmFyIGZpbmQgPSB7fTtcblxuXHRcdGZpbmRbY29uZmlnLnNlYXJjaF0gPSAobmV3IFJlZ0V4cChzZWFyY2hWYWwsIFwiaWdcIikpLnRvU3RyaW5nKCk7XG5cblx0XHRzdG9yZS5maW5kID0gZmluZDtcblx0XHRzdG9yZS5zb3J0ID0gc29ydFZhbDtcblx0XHRzdG9yZS5za2lwID0gc2tpcFZhbDtcblx0XHRzdG9yZS5saW1pdCA9IGxpbWl0VmFsO1xuXHR9KS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiAwXG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGJlZm9yZUxvYWQoKSB7XG5cdFx0aWYgKGxvYWRpbmcoKSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJMaXN0IGlzIGFscmVhZHkgbG9hZGluZy4uLlwiKTsgLy90aGlzIG1pZ2h0IGJlIHByb2JsZW1hdGljIGlmIHRoZXJlIGFyZSBubyBnb29kIHRpbWVvdXQgc2V0dGluZ3MuXG5cdFx0fVxuXG5cdFx0bG9hZGluZyh0cnVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZChlcnIpIHtcblx0XHRsb2FkaW5nKGZhbHNlKTtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoZXJyKTtcblx0XHR9XG5cdFx0ZXJyb3IobnVsbCk7XG5cblx0XHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdGNvdW50KHN0b3JlLmNvdW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRPbmx5Q29tcHV0ZWQob2JzZXJ2YWJsZSkge1xuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9ic2VydmFibGUoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRocm93IFwiVGhpcyBjb21wdXRlZCB2YXJpYWJsZSBzaG91bGQgbm90IGJlIHdyaXR0ZW4uXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cdHN0b3JlLmxvYWQuYWZ0ZXIuYWRkKGFmdGVyTG9hZCk7XG5cblx0cmV0dXJuIHtcblx0XHRzdG9yZTogc3RvcmUsXG5cblx0XHRmaWVsZHM6IGZpZWxkcywgLy9zaG91bGQgZmlsdGVyIHRvIHRoZSBmaWVsZHMuIChzZWxlY3QpXG5cblx0XHRzZWFyY2g6IHNlYXJjaCxcblxuXHRcdHNvcnQ6IHNvcnQsXG5cdFx0c29ydElkeDogc29ydElkeCxcblx0XHRzb3J0T3B0aW9uczogc29ydE9wdGlvbnMsXG5cblx0XHRza2lwOiBza2lwLFxuXHRcdGxpbWl0OiBsaW1pdCxcblxuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRjb3VudDogcmVhZE9ubHlDb21wdXRlZChjb3VudCksXG5cblx0XHRsb2FkaW5nOiByZWFkT25seUNvbXB1dGVkKGxvYWRpbmcpLFxuXHRcdGVycm9yOiByZWFkT25seUNvbXB1dGVkKGVycm9yKVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8a25vYi1tb2RhbCBwYXJhbXM9XCJcXG5cdFx0dGl0bGU6IHRpdGxlLFxcblx0XHRpY29uOiBpY29uLFxcblx0XHR2aXNpYmxlOiB2aXNpYmxlXCI+XFxuXFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLWNvbmZpcm1fX2NvbnRlbnRcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiBtZXNzYWdlXCI+PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLWNvbmZpcm1fX2J1dHRvbnNcIj5cXG5cdFx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwiXFxuXHRcdFx0XHRsYWJlbDogb2tMYWJlbCxcXG5cdFx0XHRcdGNsaWNrOiBva1xcblx0XHRcdFwiPjwva25vYi1idXR0b24+XFxuXHRcdDwvZGl2Plxcblx0PC9rbm9iLW1vZGFsPlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUFsZXJ0KGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNvbmZpZy5tZXNzYWdlICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm1lc3NhZ2UgbXVzdCBiZSBhIHN0cmluZ1wiKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29uZmlnLm9rTGFiZWwgIT09IFwic3RyaW5nXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcub2tMYWJlbCBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuXHR9XG5cblx0aWYgKCFrby5pc09ic2VydmFibGUoY29uZmlnLnZpc2libGUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnZpc2libGUgbXVzdCBiZSBhbiBvYnNlcnZhYmxlXCIpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb25maWcuY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG5cdH1cblxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xuXHR2YXIgb2tMYWJlbCA9IGNvbmZpZy5va0xhYmVsO1xuXHR2YXIgY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cblx0dmFyIHRpdGxlID0gY29uZmlnLnRpdGxlIHx8IFwiXCI7XG5cdHZhciBpY29uID0gY29uZmlnLmljb24gfHwgXCJcIjtcblx0dmFyIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZTtcblxuXHR2YXIgb2tMYWJlbCA9IGNvbmZpZy5va0xhYmVsO1xuXG5cdGZ1bmN0aW9uIG9rKCkge1xuXHRcdGNhbGxiYWNrKCk7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dmlzaWJsZTogdmlzaWJsZSxcblxuXHRcdHRpdGxlOiB0aXRsZSxcblx0XHRpY29uOiBpY29uLFxuXHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cblx0XHRva0xhYmVsOiBva0xhYmVsLFxuXG5cdFx0b2s6IG9rXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItY29uZmlybVwiPlxcblx0PGtub2ItbW9kYWwgcGFyYW1zPVwiXFxuXHRcdHRpdGxlOiB0aXRsZSxcXG5cdFx0aWNvbjogaWNvbixcXG5cdFx0dmlzaWJsZTogdmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19jb250ZW50XCIgZGF0YS1iaW5kPVwidGV4dDogbWVzc2FnZVwiPjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1jb25maXJtX19idXR0b25zXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cIlxcblx0XHRcdFx0bGFiZWw6IG9rTGFiZWwsXFxuXHRcdFx0XHR2YXJpYXRpb246IFxcJ3ByaW1hcnlcXCcsXFxuXHRcdFx0XHRjbGljazogb2tcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJcXG5cdFx0XHRcdGxhYmVsOiBjYW5jZWxMYWJlbCxcXG5cdFx0XHRcdGNsaWNrOiBjYW5jZWxcXG5cdFx0XHRcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8L2Rpdj5cXG5cdDwva25vYi1tb2RhbD5cXG48L2Rpdj5cXG4nOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVDb25maXJtTW9kYWwoY29uZmlnKSB7XG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoIWNvbmZpZy5tZXNzYWdlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLm1lc3NhZ2UgZWxlbWVudCBpcyBtYW5kYXRvcnkhXCIpO1xuXHR9XG5cblx0aWYgKCFjb25maWcub2tMYWJlbCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5va0xhYmVsIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLmNhbmNlbExhYmVsKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmNhbmNlbExhYmVsIGVsZW1lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgdmlzaWJsZSA9IGNvbmZpZy52aXNpYmxlO1xuXHR2YXIgY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cblx0dmFyIHRpdGxlID0gY29uZmlnLnRpdGxlIHx8IFwiXCI7XG5cdHZhciBpY29uID0gY29uZmlnLmljb24gfHwgXCJcIjtcblx0dmFyIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZTtcblxuXHR2YXIgb2tMYWJlbCA9IGNvbmZpZy5va0xhYmVsO1xuXHR2YXIgY2FuY2VsTGFiZWwgPSBjb25maWcuY2FuY2VsTGFiZWw7XG5cblxuXHRmdW5jdGlvbiBvaygpIHtcblx0XHRjYWxsYmFjayh0cnVlKTtcblx0XHR2aXNpYmxlKCF2aXNpYmxlKCkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FuY2VsKCkge1xuXHRcdGNhbGxiYWNrKGZhbHNlKTtcblx0XHR2aXNpYmxlKCF2aXNpYmxlKCkpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR2aXNpYmxlOiB2aXNpYmxlLFxuXG5cdFx0dGl0bGU6IHRpdGxlLFxuXHRcdGljb246IGljb24sXG5cdFx0bWVzc2FnZTogbWVzc2FnZSxcblxuXHRcdG9rTGFiZWw6IG9rTGFiZWwsXG5cdFx0Y2FuY2VsTGFiZWw6IGNhbmNlbExhYmVsLFxuXG5cdFx0b2s6IG9rLFxuXHRcdGNhbmNlbDogY2FuY2VsXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ29uZmlybU1vZGFsOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVDb25maWcodGhlbWUpIHtcblx0cmV0dXJuIHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYmxhY2ssXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUud2hpdGUsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS53aGl0ZVxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5kYXJrR3JheSxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS53aGl0ZSxcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLndoaXRlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLW1vZGFsLW92ZXJsYXlcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiB2aXNpYmxlXCI+XFxuXFxuXHQ8ZGl2IGNsYXNzPVwia25vYi1tb2RhbFwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1tb2RhbF9faGVhZGVyXCIgZGF0YS1iaW5kPVwic3R5bGU6IHN0eWxlXCI+XFxuXHRcdFx0PGtub2ItYnV0dG9uIGNsYXNzPVwiYnV0dG9uLWNsb3NlXCIgcGFyYW1zPVwidmFyaWF0aW9uOiBcXCdtb2RhbEhlYWRcXCcsIGljb246IFxcJyNpY29uLWNsb3NlXFwnLCBjbGljazogJGNvbXBvbmVudC52aXNpYmxlLnRvZ2dsZVwiPjwva25vYi1idXR0b24+XFxuXFxuXHRcdFx0PHNwYW4gY2xhc3M9XCJkZXNjXCI+XFxuXHRcdFx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBpY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0XHRcdDwvc3ZnPlxcblx0XHRcdFx0PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+XFxuXHRcdFx0PC9zcGFuPlxcblxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItbW9kYWxfX2JvZHlcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJHBhcmVudCB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsKGNvbmZpZykge1xuXG5cdGlmICghY29uZmlnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLnZpc2libGUgJiYgIWtvLmlzT2JzZXJ2YWJsZShjb25maWcudmlzaWJsZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcudmlzaWJsZSBtdXN0IGJlIGFuIG9ic2VydmFibGVcIik7XG5cdH1cblxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIHZpc2libGUgPSBjb25maWcudmlzaWJsZTtcblx0dmFyIHRpdGxlID0gY29uZmlnLnRpdGxlO1xuXHR2YXIgaWNvbiA9IGNvbmZpZy5pY29uO1xuXG5cdHZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmlzaWJsZSghdmlzaWJsZSgpKTtcblx0fTtcblxuXHRjb25maWcuY29tcG9uZW50ID0gXCJtb2RhbFwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS52aXNpYmxlID0gdmlzaWJsZTtcblx0dm0udGl0bGUgPSB0aXRsZTtcblx0dm0uaWNvbiA9IGljb247XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZU1vZGFsOyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0XCI+XFxuXHQ8IS0tIGtvIGlmOiBlcnJvciAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OiBlcnJvclwiPjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuXFxuXHQ8ZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdF9fYmFyXCI+XFxuXHRcdFx0PGlucHV0IGNsYXNzPVwia25vYi1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHNlYXJjaCwgdmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiLz5cXG5cdFx0XHQ8a25vYi1idXR0b24gY2xhc3M9XCJrbm9iLWJ1dHRvbi1zZWFyY2hcIiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLFxcblx0XHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ2RlZmF1bHRcXCcsXFxuXHRcdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLXNlYXJjaFxcJ1wiPlxcblx0XHRcdDwva25vYi1idXR0b24+XFxuXHRcdFx0PGtub2ItaXRlbXMtcGVyLXBhZ2UgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19pdGVtcy1wZXItcGFnZVwiIHBhcmFtcz1cIm51bU9mSXRlbXM6IGNvdW50LFxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+XFxuXHRcdFx0PC9rbm9iLWl0ZW1zLXBlci1wYWdlPlxcblx0XHRcdDwhLS0ga28gaWY6IHNvcnRPcHRpb25zLmxlbmd0aCA+IDAgLS0+XFxuXHRcdFx0XHQ8a25vYi1kcm9wZG93biBjbGFzcz1cImtub2ItZHJvcGRvd25cIiBwYXJhbXM9XCJyaWdodEljb246IFxcJyNpY29uLWV4cGFuZC1tb3JlXFwnLCBzZWxlY3RlZElkeDogc29ydElkeCwgc2VsZWN0ZWQ6IHNvcnQsIGl0ZW1zOiBzb3J0T3B0aW9uc1wiPjwva25vYi1kcm9wZG93bj5cXG5cdFx0XHQ8IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHRcdDx1bCBkYXRhLWJpbmQ9XCJjc3M6IGxpc3RDbGFzcywgZm9yZWFjaDogaXRlbXNcIj5cXG5cdFx0XHQ8bGkgZGF0YS1iaW5kPVwiY3NzOiAkcGFyZW50Lml0ZW1DbGFzc1wiPlxcblx0XHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6IHttb2RlbDogJGRhdGEsIHBhcmVudDogJHBhcmVudCwgaW5kZXg6ICRpbmRleH0gfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0XHQ8L2xpPlxcblx0XHQ8L3VsPlxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+XFxuXHQ8IS0tXFxuXHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mSXRlbXM6IHBhZ2luYXRpb24ubnVtT2ZJdGVtcywgaXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdC0tPlxcblx0PCEtLSBrbyBpZjogbnVtT2ZQYWdlcygpID4gMCAtLT5cXG5cdFx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLCBjdXJyZW50UGFnZTogY3VycmVudFBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdDwhLS0gL2tvIC0tPlxcblx0PCEtLSBrbyBpZjogJGRhdGEubG9hZE1vcmUgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogIWxvYWRpbmcoKSwgY2xpY2s6IGxvYWRNb3JlXCI+TG9hZCBtb3JlLi4uPC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBjcmVhdGVMaXN0ID0gcmVxdWlyZShcIi4uL2xpc3Qvdm1cIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnZWRMaXN0KGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0aWYgKCFjb25maWcuc3RvcmUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuc3RvcmUgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cblxuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cblx0dmFyIGxpc3QgPSBjcmVhdGVMaXN0KGNvbmZpZyk7XG5cdC8vdmFyIHBhZ2luYXRpb24gPSBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZy5wYWdpbmF0aW9uKTtcblx0Ly9saXN0LnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuXG5cdHZhciBudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZSgpO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZSgxMCk7XG5cdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0bGlzdC5saXN0Q2xhc3MgPSBjb25maWcubGlzdENsYXNzIHx8IFwia25vYi1wYWdlZGxpc3RfX2xpc3RcIjtcblx0bGlzdC5pdGVtQ2xhc3MgPSBjb25maWcuaXRlbUNsYXNzIHx8IFwia25vYi1wYWdlZGxpc3RfX2l0ZW1cIjtcblx0bGlzdC5udW1PZlBhZ2VzID0gbnVtT2ZQYWdlcztcblx0bGlzdC5pdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2U7XG5cdGxpc3QuY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGxpc3Quc2tpcChjdXJyZW50UGFnZVZhbCAqIGl0ZW1zUGVyUGFnZVZhbCk7XG5cdFx0bGlzdC5saW1pdChpdGVtc1BlclBhZ2VWYWwpO1xuXHR9KTtcblxuXHQvKlxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY291bnQgPSBsaXN0LmNvdW50KCk7XG5cdFx0bGlzdC5wYWdpbmF0aW9uLm51bU9mSXRlbXMoY291bnQpO1xuXHR9KTtcblx0Ki9cblxuXHRmdW5jdGlvbiBiZWZvcmVMb2FkKCkge1xuXHRcdGxpc3QuaXRlbXMoW10pO1xuXHR9XG5cblx0cmV0dXJuIGxpc3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcGFnaW5hdGlvblwiIGRhdGEtYmluZD1cImlmOiBwYWdlU2VsZWN0b3JzKCkubGVuZ3RoXCI+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJyxcXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHtcXG5cdFx0XHRcdFx0XHRcdHZhcmlhdGlvbjogXFwncGFnaW5hdGlvblxcJyxcXG5cdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLWZpcnN0LXBhZ2VcXCcsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogZmlyc3QoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBmaXJzdCgpLnNlbGVjdFBhZ2VcXG5cdFx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdH1cIj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tY2hldnJvbi1sZWZ0XFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IHByZXYoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBwcmV2KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFnZVNlbGVjdG9yc1wiPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IGxhYmVsLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IHN0YXRlLFxcblx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdwYWdpbmF0aW9uXFwnLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IHNlbGVjdFBhZ2VcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1jaGV2cm9uLXJpZ2h0XFwnLFxcblx0XHRcdFx0XHRcdFx0c3RhdGU6IG5leHQoKS5zdGF0ZSxcXG5cdFx0XHRcdFx0XHRcdGNsaWNrOiBuZXh0KCkuc2VsZWN0UGFnZVxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0fVwiPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7XFxuXHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ3BhZ2luYXRpb25cXCcsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1sYXN0LXBhZ2VcXCcsXFxuXHRcdFx0XHRcdFx0XHRzdGF0ZTogbGFzdCgpLnN0YXRlLFxcblx0XHRcdFx0XHRcdFx0Y2xpY2s6IGxhc3QoKS5zZWxlY3RQYWdlXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdFx0XHR9XCI+XFxuXHQ8L3NwYW4+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvbihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmIChjb25maWcuYWZ0ZXJIZWFkICYmIGNvbmZpZy5hZnRlckhlYWQgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmFmdGVySGVhZCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHRpZiAoY29uZmlnLmJlZm9yZVRhaWwgJiYgY29uZmlnLmJlZm9yZVRhaWwgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmJlZm9yZVRhaWwgbXVzdCBiZSBsYXJnZXIgdGhhbiB6ZXJvXCIpO1xuXHR9XG5cblx0aWYgKGNvbmZpZy5iZWZvcmVDdXJyZW50ICYmIGNvbmZpZy5iZWZvcmVDdXJyZW50IDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5iZWZvcmVDdXJyZW50IG11c3QgYmUgbGFyZ2VyIHRoYW4gemVyb1wiKTtcblx0fVxuXG5cdGlmIChjb25maWcuYWZ0ZXJDdXJyZW50ICYmIGNvbmZpZy5hZnRlckN1cnJlbnQgPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLmFmdGVyQ3VycmVudCBtdXN0IGJlIGxhcmdlciB0aGFuIHplcm9cIik7XG5cdH1cblxuXHR2YXIgbnVtT2ZQYWdlcztcblxuXHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzKSkge1xuXHRcdG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcztcblx0fSBlbHNlIHtcblx0XHRudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcyB8fCAxMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPCAwKSB7XG5cdFx0XHR2YWx1ZSA9IDA7XG5cdFx0fVxuXG5cdFx0dmFyIHBhZ2VzTnVtID0gbnVtT2ZQYWdlcygpO1xuXG5cdFx0aWYgKHZhbHVlID49IHBhZ2VzTnVtKSB7XG5cdFx0XHR2YWx1ZSA9IHBhZ2VzTnVtIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHR2YXIgY3VycmVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZSgpO1xuXG5cdFx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRudW1PZlBhZ2VzKCk7XG5cdFx0XHRjdXJyZW50UGFnZSgwKTtcblx0XHR9KTtcblxuXHRcdGlmIChrby5pc09ic2VydmFibGUoY29uZmlnLmN1cnJlbnRQYWdlKSkge1xuXHRcdFx0Y3VycmVudFBhZ2UgPSBjb25maWcuY3VycmVudFBhZ2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZShub3JtYWxpemUoY29uZmlnLmN1cnJlbnRQYWdlKSB8fCAwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50UGFnZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRjdXJyZW50UGFnZShub3JtYWxpemUodmFsdWUpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSgpKTtcblxuXG5cblx0dmFyIGN1cnJlbnRQYWdlUmVhbElkeDtcblx0dmFyIHBhZ2VTZWxlY3RvcnMgPSAoZnVuY3Rpb24oY29uZmlnKSB7XG5cdFx0dmFyIGFmdGVySGVhZCA9IGNvbmZpZy5hZnRlckhlYWQgfHwgMjtcblx0XHR2YXIgYmVmb3JlVGFpbCA9IGNvbmZpZy5iZWZvcmVUYWlsIHx8IDI7XG5cdFx0dmFyIGJlZm9yZUN1cnJlbnQgPSBjb25maWcuYmVmb3JlQ3VycmVudCB8fCAyO1xuXHRcdHZhciBhZnRlckN1cnJlbnQgPSBjb25maWcuYWZ0ZXJDdXJyZW50IHx8IDI7XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogaWR4ICsgMSxcblx0XHRcdFx0c3RhdGU6IFwiZGVmYXVsdFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdXJyZW50UGFnZShpZHgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGxhYmVsKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRcdHN0YXRlOiBcImRpc2FibGVkXCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge31cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gW107XG5cblx0XHRcdHZhciBudW1PZlBhZ2VzVmFsID0gbnVtT2ZQYWdlcygpO1xuXHRcdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblxuXHRcdFx0dmFyIG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bU9mUGFnZXNWYWw7IGlkeCArPSAxKSB7XG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtIDEgfHwgaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpIHtcblx0XHRcdFx0XHR2YXIgcGFnZVNlbGVjdG9yO1xuXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gY3VycmVudFBhZ2VWYWwpIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGlkeCArIDEpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFBhZ2VSZWFsSWR4ID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKHBhZ2VTZWxlY3Rvcik7XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW5vbkNsaWNrYWJsZUluc2VydGVkKSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKFwiLi4uXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtZW50cztcblx0XHR9KTtcblx0fShjb25maWcpKTtcblxuXG5cdHZhciBuZXh0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCArIDE7XG5cblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRpZiAoaWR4ID49IHBhZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VzW2lkeF07XG5cdH0pO1xuXG5cdHZhciBwcmV2ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCAtIDE7XG5cblx0XHRpZiAoaWR4IDwgMCkge1xuXHRcdFx0aWR4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpW2lkeF07XG5cdH0pO1xuXG5cdHZhciBmaXJzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbMF07XG5cdH0pO1xuXG5cdHZhciBsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0cmV0dXJuIHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdO1xuXHR9KTtcblxuXG5cdHJldHVybiB7XG5cdFx0cGFnZVNlbGVjdG9yczogcGFnZVNlbGVjdG9ycyxcblxuXHRcdGZpcnN0OiBmaXJzdCxcblx0XHRsYXN0OiBsYXN0LFxuXG5cdFx0bmV4dDogbmV4dCxcblx0XHRwcmV2OiBwcmV2LFxuXG5cdFx0Y3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlLFxuXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlc1xuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXJhZGlvXCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRwYXJhbXM6IHtcXG5cdFx0XHRzdGF0ZTogaXNTZWxlY3RlZCgpID8gXFwnYWN0aXZlXFwnIDogXFwnZGVmYXVsdFxcJyxcXG5cdFx0XHR2YXJpYXRpb246ICRwYXJlbnQudmFyaWF0aW9uLFxcblx0XHRcdGxhYmVsOiBsYWJlbCxcXG5cdFx0XHRpY29uOiBpY29uLFxcblx0XHRcdHJhZGlvOiB0cnVlLFxcblx0XHRcdGdyb3VwOiBncm91cCxcXG5cdFx0XHRjbGljazogc2VsZWN0XFxuXHRcdH1cXG5cdH1cIj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5mdW5jdGlvbiBjcmVhdGVSYWRpbyhjb25maWcpIHtcblxuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIHZtID0ge307XG5cblx0aWYgKGNvbmZpZy5pdGVtcy5sZW5ndGggPT09IDApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb25maWcuaXRlbXMgc2hvdWxkIG5vdCBiZSBlbXB0eVwiKTtcblx0fVxuXG5cdHZtLnNlbGVjdGVkID0gY29uZmlnLnNlbGVjdGVkIHx8IGtvLm9ic2VydmFibGUoKTtcblx0dm0uc2VsZWN0ZWRJZHggPSBjb25maWcuc2VsZWN0ZWRJZHggfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdHZtLnZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblx0dm0uaXRlbXMgPSBbXTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXG5cdFx0dmFyIGFjdCA9IGNvbmZpZy5pdGVtc1tpZHhdO1xuXG5cdFx0aWYgKCFhY3QubGFiZWwgJiYgIWFjdC5pY29uKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJlYWNoIGVsZW1lbnQgb2YgY29uZmlnLml0ZW1zIGhhcyB0byBoYXZlIGxhYmVsIGFuZC9vciBpY29uIHByb3BlcnR5XCIpO1xuXHRcdH1cblxuXHRcdHZtLml0ZW1zLnB1c2goY3JlYXRlSXRlbVZtKGFjdC5sYWJlbCwgYWN0Lmljb24sIGlkeCkpO1xuXHR9XG5cblx0dmFyIHNlbCA9IHZtLnNlbGVjdGVkSWR4KCk7XG5cblx0aWYgKHR5cGVvZiBzZWwgPT09IFwibnVtYmVyXCIpIHtcblx0XHRzZWwgPSBNYXRoLmZsb29yKHNlbCk7XG5cdFx0c2VsICU9IHZtLml0ZW1zLmxlbmd0aDtcblxuXHRcdHZtLml0ZW1zW3NlbF0uc2VsZWN0KCk7XG5cblx0fSBlbHNlIHtcblx0XHR2bS5pdGVtc1swXS5zZWxlY3QoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUl0ZW1WbShsYWJlbCwgaWNvbiwgaWR4KSB7XG5cblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0aWNvbjogaWNvbixcblx0XHRcdGdyb3VwOiBjb25maWcuZ3JvdXAsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2bS5zZWxlY3RlZChvYmopO1xuXHRcdFx0XHR2bS5zZWxlY3RlZElkeChpZHgpO1xuXHRcdFx0fSxcblx0XHRcdGlzU2VsZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JqID09PSB2bS5zZWxlY3RlZCgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJhZGlvO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGVcIj5cXG5cdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiAkcGFyZW50IH0gLS0+PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlVGFiKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdGNvbmZpZy5jb21wb25lbnQgPSBcInRhYlwiO1xuXHRjb25maWcudmFyaWF0aW9uID0gXCJ0YWJcIjtcblx0Y29uZmlnLnN0YXRlID0gXCJhY3RpdmVcIjtcblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItcmFkaW8gY2xhc3M9XCJrbm9iLXJhZGlvLS1pbmxpbmVcIiBwYXJhbXM9XCJcXG5cdFx0Z3JvdXA6IHRhYnNHcm91cCxcXG5cdFx0dmFyaWF0aW9uOiBcXCd0YWJcXCcsXFxuXHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0aXRlbXM6IGJ1dHRvbnNcIj5cXG5cdDwva25vYi1yYWRpbz5cXG5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFuZWxzXCI+XFxuXHRcdDxrbm9iLXRhYiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LnNlbGVjdGVkSWR4KCkgPT0gJGluZGV4KClcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2tub2ItdGFiPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBuZXh0VGFic0dyb3VwSWR4ID0gMDtcblxuZnVuY3Rpb24gY29udmVydFBhcmFtc1RvT2JqZWN0KHBhcmFtcykge1xuXHRwYXJhbXMgPSBwYXJhbXMucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XG5cblx0dmFyIHBhcmFtcyA9IHBhcmFtcy5zcGxpdChcIixcIik7XG5cblx0dmFyIGNvbnZlcnRlZFBhcmFtcyA9IFtdO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHBhcmFtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdCA9IHBhcmFtc1tpZHhdO1xuXG5cdFx0YWN0ID0gYWN0LnRyaW0oKTtcblxuXHRcdGFjdCA9IGFjdC5zcGxpdChcIjpcIik7XG5cblx0XHRpZiAoYWN0Lmxlbmd0aCAhPT0gMikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0YWN0ID0gXCJcXFwiXCIgKyBhY3RbMF0gKyBcIlxcXCJcIiArIFwiOlwiICsgYWN0WzFdO1xuXHRcdGNvbnZlcnRlZFBhcmFtcy5wdXNoKGFjdCk7XG5cdH1cblxuXHRyZXR1cm4gSlNPTi5wYXJzZShcIntcIiArIGNvbnZlcnRlZFBhcmFtcy5qb2luKFwiLFwiKSArIFwifVwiKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFicyhjb25maWcsIGNvbXBvbmVudEluZm8pIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb21wb25lbnRJbmZvID0gY29tcG9uZW50SW5mbyB8fCB7fTtcblx0Y29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzIHx8IFtdO1xuXG5cdHZhciBkZWZhdWx0VGFiID0gY29uZmlnLmRlZmF1bHRUYWIgfHwgMDtcblxuXHR2YXIgdm0gPSB7fTtcblxuXHR2YXIgdGFiQnV0dG9ucyA9IFtdO1xuXHR2YXIgdGFiUGFuZWxzID0gW107XG5cblx0dmFyIHRhYklkeCA9IDA7XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0VGVtcGxhdGVOb2RlID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzW2lkeF07XG5cblx0XHRpZiAoYWN0VGVtcGxhdGVOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwia25vYi10YWJcIikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFyIHRhYkJ1dHRvbkRhdGEgPSBjb252ZXJ0UGFyYW1zVG9PYmplY3QoYWN0VGVtcGxhdGVOb2RlLmdldEF0dHJpYnV0ZShcInBhcmFtc1wiKSk7XG5cblx0XHR0YWJCdXR0b25EYXRhLnRhYklkeCA9IHRhYklkeDtcblx0XHR0YWJJZHggKz0gMTtcblxuXHRcdHRhYkJ1dHRvbnMucHVzaCh0YWJCdXR0b25EYXRhKTtcblxuXHRcdHRhYlBhbmVscy5wdXNoKGFjdFRlbXBsYXRlTm9kZS5jaGlsZE5vZGVzKTtcblx0fVxuXG5cdGlmICh0YWJQYW5lbHMubGVuZ3RoIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImtub2ItdGFicyBjb21wb25lbnQgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIGtub2ItdGFiIGNvbXBvbmVudCBhcyBhIGNoaWxkIGNvbXBvbmVudCFcIik7XG5cdH1cblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0YWJCdXR0b25zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gdGFiQnV0dG9uc1tpZHhdO1xuXG5cdFx0aWYgKCFhY3QuaWNvbiAmJiAhYWN0LmxlZnRJY29uICYmICFhY3QucmlnaHRJY29uICYmICFhY3QubGFiZWwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBjaGlsZCBrbm9iLXRhYiBjb21wb25lbnRzIHNob3VsZCBoYXZlIHByb3BlciBwYXJhbXMgKGljb24gYW5kL29yIGxhYmVsKSBqdXN0IGxpa2Ugd2l0aCBidXR0b25zIVwiKTtcblx0XHR9XG5cdH1cblxuXHR2bS50YWJzR3JvdXAgPSBcInRhYnNHcm91cF9cIiArIG5leHRUYWJzR3JvdXBJZHg7XG5cdG5leHRUYWJzR3JvdXBJZHggKz0gMTtcblxuXHR2bS5zZWxlY3RlZElkeCA9IGtvLm9ic2VydmFibGUoZGVmYXVsdFRhYik7XG5cblx0dm0uYnV0dG9ucyA9IHRhYkJ1dHRvbnM7XG5cdHZtLnBhbmVscyA9IHRhYlBhbmVscztcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVGFicztcbiJdfQ==
