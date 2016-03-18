(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.knob = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

module.exports = function clickBehaviour(vm) {
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

module.exports = function focusBehaviour(vm) {
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
				"backgroundColor": theme.baseBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.baseHoverBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"active": {
				"backgroundColor": theme.baseActiveBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.DisabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.primaryHoverBg,
				"color": theme.primaryHoverButtonFontColor,
				"fill": theme.primaryHoverButtonFontColor
			},
			"active": {
				"backgroundColor": theme.primaryActiveBg,
				"color": theme.primaryActiveButtonFontColor,
				"fill": theme.primaryActiveButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.disabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		},
		"tab": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.primaryHoverBg,
				"color": theme.primaryHoverButtonFontColor,
				"fill": theme.primaryHoverButtonFontColor
			},
			"active": {
				"backgroundColor": theme.primaryActiveBg,
				"color": theme.primaryActiveButtonFontColor,
				"fill": theme.primaryActiveButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.disabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		}
	};
};

},{}],7:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass, \n					style: style, \n					click: click, \n					event: eventHandlers,\n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
},{}],8:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");

function createButton(config) {
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
	registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), createButtonStyle(theme));
	registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), createInputStyle(theme));
	registerComponent("knob-radio", require("./radio/vm"), require("./radio/template.html"));
	registerComponent("knob-inline-text-editor", require("./inlineTextEditor/vm"), require("./inlineTextEditor/template.html"));
	registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html"));
	registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"));
	registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
	registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));

	registerComponent("knob-tabs", require("./tabs/vm"), require("./tabs/template.html"));
	registerComponent("knob-tab", require("./tabs/tab/vm"), require("./tabs/tab/template.html"));
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
	var rightIcon = ko.observable(config.rightIcon);

	var options = ko.observableArray([]);

	for (var idx = 0; idx < config.items.length; idx += 1) {
		options.push(createOption({
			label: config.items[idx].label,
			icon: config.items[idx].icon,
			value: config.items[idx].value
		}));
	}

	var selected = config.selected || ko.observable();

	selected(options()[0]);


	var dropdownVisible = ko.observable(false);

	dropdownVisible.toggle = function toggleDropdownVisible(item, event) {
		if (event) {
			event.stopPropagation();
		}

		var visible = dropdownVisible();

		dropdownVisible(!visible);


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
module.exports = '<span>\n	<span data-bind="visible: !editMode()">\n		<span data-bind="text: value"></span>\n		<knob-button params="label: \'\', click: edit, icon: \'#icon-edit\'">\n	</span>\n	<span data-bind="visible: editMode">\n		<knob-input params="value: editedValue, hasFocus: inputHasFocus, keyDown: keyDown, visible: editMode"></knob-input>\n		<knob-button params="label: \'\', click: save, icon: \'#icon-succes\'"></knob-button>\n		<knob-button params="label: \'\', click: cancel, icon: \'#icon-delete\'"></knob-button>\n	</span>\n</span>';
},{}],13:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function createInlineTextEditor(config) {
	var vm = {};

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
				"backgroundColor": theme.inputBg,
				"color": theme.inputText,
				"border-color": theme.inputBorder
			},
			"hover": {
				"backgroundColor": theme.inputBg,
				"color": theme.inputText,
				"border-color": theme.inputText
			},
			"active": {
				"backgroundColor": theme.inputBg,
				"color": theme.inputActiveColor,
				"fill": theme.inputActiveColor
			},
			"disabled": {
				"backgroundColor": theme.inputBorder,
				"color": theme.inputDisabledColor,
				"fill": theme.inputActiveColor
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
module.exports = '<knob-dropdown params="\n	rightIcon: \'#icon-down\',\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],18:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createItemsPerPage(config) {
	config = config || {};
	var numOfItems = config.numOfItems || ko.observable(0);

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
	var store = config.store;

	var fields = config.fields;

	var search = ko.observable("").extend({
		throttle: 500
	});

	//config.sorters
	// - label
	// - prop

	var sortOptions = [];

	function createQureyObj(prop, asc) {
		var obj = {};

		obj[prop] = asc;
		return obj;
	}
	if (config.sort) {
		for (var idx = 0; idx < config.sort.length; idx += 1) {
			var act = config.sort[idx];

			sortOptions.push({
				icon: "#icon-a-z",
				label: act,
				value: createQureyObj(act, 1)
			});
			sortOptions.push({
				icon: "#icon-z-a",
				label: act,
				value: createQureyObj(act, -1)
			});
		}
	}

	var sort = ko.observable(sortOptions[0]);

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
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\',\n								variation: \'default\',\n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count,\n										numOfPages: numOfPages,\n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-down\', selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<div class="knob-pagelist__result" data-bind="foreach: items">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: {model: $data, parent: $parent, index: $index} } --><!-- /ko -->\n		</div>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],22:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);
var createList = require("../list/vm");

module.exports = function createPagedList(config) {
	config = config || {};

	var store = config.store;

	store.load.before.add(afterLoad);

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


	function afterLoad() {
		list.items([]);
	}

	return list;
};

},{"../list/vm":20}],23:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-first\', state: first().state, click: first().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-prev\', state: prev().state, click: prev().selectPage}}"></span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label, state: state, click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-next\', state: next().state, click: next().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-last\', state: last().state, click: last().selectPage}}"></span>\n</div>';
},{}],24:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createPagination(config) {
	config = config || {};

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
		var currentPage = config.currentPage || ko.observable(0);

		ko.computed(function() {
			numOfPages();
			currentPage(0);
		});

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
	var vm = {};

	vm.selected = config.selected || ko.observable();
	vm.selectedIdx = config.selectedIdx || ko.observable();

	vm.variation = config.variation || "default";

	vm.items = [];

	for (var idx = 0; idx < config.items.length; idx += 1) {
		var act = config.items[idx];

		vm.items.push(createItemVm(act.label, act.icon, idx));
	}

	var sel = vm.selectedIdx();

	if (typeof sel === "number") {
		sel = Math.floor(sel);
		sel %= vm.items.length;

		vm.items[sel].select();
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
module.exports = '<div>\n	<!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><!-- /ko -->\n</div>';
},{}],28:[function(require,module,exports){
/*jslint node: true */
"use strict";

function createTab() {
	return {};
}

module.exports = createTab;

},{}],29:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL2NsaWNrLmpzIiwic3JjL2Jhc2UvYmVoYXZpb3Vycy9mb2N1cy5qcyIsInNyYy9iYXNlL2JlaGF2aW91cnMvaG92ZXIuanMiLCJzcmMvYmFzZS9iZWhhdmlvdXJzL3NlbGVjdC5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lubGluZVRleHRFZGl0b3IvdGVtcGxhdGUuaHRtbCIsInNyYy9pbmxpbmVUZXh0RWRpdG9yL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2VkTGlzdC92bS5qcyIsInNyYy9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnaW5hdGlvbi92bS5qcyIsInNyYy9yYWRpby90ZW1wbGF0ZS5odG1sIiwic3JjL3JhZGlvL3ZtLmpzIiwic3JjL3RhYnMvdGFiL3RlbXBsYXRlLmh0bWwiLCJzcmMvdGFicy90YWIvdm0uanMiLCJzcmMvdGFicy90ZW1wbGF0ZS5odG1sIiwic3JjL3RhYnMvdm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xpY2tCZWhhdmlvdXIodm0pIHtcblx0ZnVuY3Rpb24gbW91c2VEb3duKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZWRvd24gPSBtb3VzZURvd247XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvY3VzQmVoYXZpb3VyKHZtKSB7XG5cdGZ1bmN0aW9uIGZvY3VzKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmx1cigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdH1cblxuXHRpZiAoIXZtLmV2ZW50SGFuZGxlcnMpIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzID0ge307XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzLmZvY3VzID0gZm9jdXM7XG5cdHZtLmV2ZW50SGFuZGxlcnMuYmx1ciA9IGJsdXI7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob3ZlckJlaGF2aW91cih2bSkge1xuXHRpZiAoIXZtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidm0gaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICgha28uaXNPYnNlcnZhYmxlKHZtLnN0YXRlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcInZtLnN0YXRlIGhhcyB0byBiZSBhIGtub2Nrb3V0IG9ic2VydmFibGUhXCIpO1xuXHR9XG5cblx0dmFyIHByZXZpb3VzU3RhdGU7XG5cblx0ZnVuY3Rpb24gbW91c2VPdmVyKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChhY3RTdGF0ZSAhPT0gXCJob3ZlclwiKSB7XG5cdFx0XHRwcmV2aW91c1N0YXRlID0gYWN0U3RhdGU7XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlT3V0KCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIiB8fCBhY3RTdGF0ZSA9PT0gXCJhY3RpdmVcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKHByZXZpb3VzU3RhdGUpO1xuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZW92ZXIgPSBtb3VzZU92ZXI7XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2VvdXQgPSBtb3VzZU91dDtcblxuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHZtcyA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdEJlaGF2aW91cih2bSwgY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgZ3JvdXAgPSBjb25maWcuZ3JvdXAgfHwgXCJkZWZhdWx0XCI7XG5cblx0aWYgKCF2bXNbZ3JvdXBdKSB7XG5cdFx0dm1zW2dyb3VwXSA9IFtdO1xuXHR9XG5cblx0dm1zW2dyb3VwXS5wdXNoKHZtKTtcblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBhY3RHcm91cFZtcyA9IHZtc1tncm91cF07XG5cblx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhY3RHcm91cFZtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0XHR2YXIgYWN0Vm0gPSBhY3RHcm91cFZtc1tpZHhdO1xuXG5cdFx0XHRpZiAoYWN0Vm0gPT09IHZtKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRhY3RWbS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCF2bS5ldmVudEhhbmRsZXJzKSB7XG5cdFx0dm0uZXZlbnRIYW5kbGVycyA9IHt9O1xuXHR9XG5cblx0dm0uZXZlbnRIYW5kbGVycy5tb3VzZWRvd24gPSBtb3VzZURvd247XG5cdHZtLmV2ZW50SGFuZGxlcnMubW91c2V1cCA9IG1vdXNlVXA7XG5cblx0cmV0dXJuIHZtO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGhvdmVyQmVoYXZpb3VyID0gcmVxdWlyZShcIi4vYmVoYXZpb3Vycy9ob3ZlclwiKTtcbnZhciBmb2N1c0JlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvZm9jdXNcIik7XG52YXIgY2xpY2tCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi9iZWhhdmlvdXJzL2NsaWNrXCIpO1xudmFyIHNlbGVjdEJlaGF2aW91ciA9IHJlcXVpcmUoXCIuL2JlaGF2aW91cnMvc2VsZWN0XCIpO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VWbShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdGlmICghY29uZmlnLmNvbXBvbmVudCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNvbmZpZy5jb21wb25lbnQgaXMgbWFuZGF0b3J5IVwiKTtcblx0fVxuXG5cdGlmICghY29uZmlnLnN0eWxlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiY29uZmlnLnN0eWxlIGlzIG1hbmRhdG9yeSFcIik7XG5cdH1cblxuXHR2YXIgY29tcG9uZW50ID0gY29uZmlnLmNvbXBvbmVudDtcblx0dmFyIHN0eWxlID0gY29uZmlnLnN0eWxlO1xuXG5cdHZhciBzdGF0ZSA9IGtvLm9ic2VydmFibGUoY29uZmlnLnN0YXRlIHx8IFwiZGVmYXVsdFwiKTtcblx0dmFyIHZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblxuXHR2YXIgY3NzQ2xhc3NDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBcImtub2ItXCIgKyBjb21wb25lbnQgKyBcIiBzdGF0ZS1cIiArIHN0YXRlKCkgKyBcIiB2YXJpYXRpb24tXCIgKyB2YXJpYXRpb247XG5cdH0pO1xuXHR2YXIgc3R5bGVDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdGF0ZVZhbCA9IHN0YXRlKCk7XG5cblx0XHRyZXR1cm4gc3R5bGVbdmFyaWF0aW9uXVtzdGF0ZVZhbF07XG5cdH0pO1xuXG5cdHZhciB2bSA9IHtcblx0XHR2YXJpYXRpb246IHZhcmlhdGlvbixcblx0XHRzdGF0ZTogc3RhdGUsXG5cblx0XHRjc3NDbGFzczogY3NzQ2xhc3NDb21wdXRlZCxcblx0XHRzdHlsZTogc3R5bGVDb21wdXRlZCxcblxuXHRcdGV2ZW50SGFuZGxlcnM6IHt9XG5cdH07XG5cblxuXHRmdW5jdGlvbiBjcmVhdGVFbmFibGVyKGJlaGF2aW91ciwgcHJvcHMpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZW5hYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0YmVoYXZpb3VyKHZtLCBjb25maWcpO1xuXHRcdFx0fSxcblx0XHRcdGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0XHRpZiAodm0uZXZlbnRIYW5kbGVyc1twcm9wXSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHZtLmV2ZW50SGFuZGxlcnNbcHJvcF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0dm0uYmVoYXZpb3VycyA9IHtcblx0XHRob3ZlcjogY3JlYXRlRW5hYmxlcihob3ZlckJlaGF2aW91ciwgW1wibW91c2VvdmVyXCIsIFwibW91c2VvdXRcIl0pLFxuXHRcdGZvY3VzOiBjcmVhdGVFbmFibGVyKGZvY3VzQmVoYXZpb3VyLCBbXCJmb2N1c1wiLCBcImJsdXJcIl0pLFxuXHRcdGNsaWNrOiBjcmVhdGVFbmFibGVyKGNsaWNrQmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKSxcblx0XHRzZWxlY3Q6IGNyZWF0ZUVuYWJsZXIoc2VsZWN0QmVoYXZpb3VyLCBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCJdKVxuXHR9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlVm07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlQ29uZmlnKHRoZW1lKSB7XG5cdHJldHVybiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmJhc2VCZyxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5iYXNlQnV0dG9uRm9udENvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmFzZUJ1dHRvbkZvbnRDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5iYXNlSG92ZXJCZyxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5iYXNlQnV0dG9uRm9udENvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuYmFzZUJ1dHRvbkZvbnRDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuYmFzZUFjdGl2ZUJnLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJhc2VCdXR0b25Gb250Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5iYXNlQnV0dG9uRm9udENvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLkRpc2FibGVkQnV0dG9uQmcsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGlzYWJsZWRCdXR0b25Db2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRpc2FibGVkQnV0dG9uQ29sb3Jcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicHJpbWFyeVwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5wcmltYXJ5Q29sb3IsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuYmFzZUJ1dHRvbkZvbnRDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmJhc2VCdXR0b25Gb250Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUhvdmVyQmcsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUhvdmVyQnV0dG9uRm9udENvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUucHJpbWFyeUhvdmVyQnV0dG9uRm9udENvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5wcmltYXJ5QWN0aXZlQmcsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUucHJpbWFyeUFjdGl2ZUJ1dHRvbkZvbnRDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlBY3RpdmVCdXR0b25Gb250Q29sb3Jcblx0XHRcdH0sXG5cdFx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuZGlzYWJsZWRCdXR0b25CZyxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5kaXNhYmxlZEJ1dHRvbkNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuZGlzYWJsZWRCdXR0b25Db2xvclxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJ0YWJcIjoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUNvbG9yLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmJhc2VCdXR0b25Gb250Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5iYXNlQnV0dG9uRm9udENvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLnByaW1hcnlIb3ZlckJnLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlIb3ZlckJ1dHRvbkZvbnRDb2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLnByaW1hcnlIb3ZlckJ1dHRvbkZvbnRDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUucHJpbWFyeUFjdGl2ZUJnLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLnByaW1hcnlBY3RpdmVCdXR0b25Gb250Q29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5wcmltYXJ5QWN0aXZlQnV0dG9uRm9udENvbG9yXG5cdFx0XHR9LFxuXHRcdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IHRoZW1lLmRpc2FibGVkQnV0dG9uQmcsXG5cdFx0XHRcdFwiY29sb3JcIjogdGhlbWUuZGlzYWJsZWRCdXR0b25Db2xvcixcblx0XHRcdFx0XCJmaWxsXCI6IHRoZW1lLmRpc2FibGVkQnV0dG9uQ29sb3Jcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLCBcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLCBcXG5cdFx0XHRcdFx0Y2xpY2s6IGNsaWNrLCBcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImxhYmVsXCIgZGF0YS1iaW5kPVwidGV4dDogbGFiZWxcIj48L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiByaWdodEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiByaWdodEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPlxcblx0XHQ8L3N2Zz5cXG5cdDwvc3Bhbj5cXG48L2J1dHRvbj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKGNvbmZpZykge1xuXHRjb25maWcuY29tcG9uZW50ID0gXCJidXR0b25cIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0uYmVoYXZpb3Vycy5ob3Zlci5lbmFibGUoKTtcblxuXHRpZiAoY29uZmlnLnJhZGlvKSB7XG5cdFx0dm0uYmVoYXZpb3Vycy5zZWxlY3QuZW5hYmxlKCk7XG5cdH0gZWxzZSB7XG5cdFx0dm0uYmVoYXZpb3Vycy5jbGljay5lbmFibGUoKTtcblx0fVxuXG5cdHZtLmxlZnRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxlZnRJY29uIHx8IGNvbmZpZy5pY29uKSk7XG5cdHZtLnJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5yaWdodEljb24pKTtcblx0dm0ubGFiZWwgPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGFiZWwpKTtcblx0dm0udmFsdWUgPSBjb25maWcudmFsdWU7XG5cdHZtLmNsaWNrID0gY29uZmlnLmNsaWNrIHx8IGZ1bmN0aW9uKCkge307XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbjtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG4vLyovXG5cbi8vVEhJUyBGSUxFIFNIT1VMRCBCRSBHRU5FUkFURURcblxudmFyIHJlZ2lzdGVyQ29tcG9uZW50ID0gcmVxdWlyZShcIi4va25vYlJlZ2lzdGVyQ29tcG9uZW50XCIpO1xudmFyIGJhc2VWbSA9IHJlcXVpcmUoXCIuL2Jhc2Uvdm1cIik7XG5cbnZhciBjcmVhdGVCdXR0b25TdHlsZSA9IHJlcXVpcmUoXCIuL2J1dHRvbi9zdHlsZVwiKTtcbnZhciBjcmVhdGVJbnB1dFN0eWxlID0gcmVxdWlyZShcIi4vaW5wdXQvc3R5bGVcIik7XG5cbmZ1bmN0aW9uIGluaXRLbm9iKHRoZW1lKSB7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgY3JlYXRlQnV0dG9uU3R5bGUodGhlbWUpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWlucHV0XCIsIHJlcXVpcmUoXCIuL2lucHV0L3ZtXCIpLCByZXF1aXJlKFwiLi9pbnB1dC90ZW1wbGF0ZS5odG1sXCIpLCBjcmVhdGVJbnB1dFN0eWxlKHRoZW1lKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1yYWRpb1wiLCByZXF1aXJlKFwiLi9yYWRpby92bVwiKSwgcmVxdWlyZShcIi4vcmFkaW8vdGVtcGxhdGUuaHRtbFwiKSk7XG5cdHJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbmxpbmUtdGV4dC1lZGl0b3JcIiwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci92bVwiKSwgcmVxdWlyZShcIi4vaW5saW5lVGV4dEVkaXRvci90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2luYXRpb25cIiwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi92bVwiKSwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sXCIpKTtcblx0cmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWl0ZW1zLXBlci1wYWdlXCIsIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS92bVwiKSwgcmVxdWlyZShcIi4vaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnZWQtbGlzdFwiLCByZXF1aXJlKFwiLi9wYWdlZExpc3Qvdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sXCIpKTtcblxuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFic1wiLCByZXF1aXJlKFwiLi90YWJzL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RlbXBsYXRlLmh0bWxcIikpO1xuXHRyZWdpc3RlckNvbXBvbmVudChcImtub2ItdGFiXCIsIHJlcXVpcmUoXCIuL3RhYnMvdGFiL3ZtXCIpLCByZXF1aXJlKFwiLi90YWJzL3RhYi90ZW1wbGF0ZS5odG1sXCIpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRLbm9iLFxuXG5cdHJlZ2lzdGVyQ29tcG9uZW50OiByZWdpc3RlckNvbXBvbmVudCxcblx0YmFzZToge1xuXHRcdHZtOiBiYXNlVm1cblx0fVxufTtcbi8vIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd25cIj5cXG5cdDwhLS0gd2l0aCBwYXJhbXMsIHRoZSBzZWxlY3RlZCgpLmxhYmVsIHdvblxcJ3QgYmUgcmVjYWxjdWxhdGVkLCB3aGVuIHNlbGVjdGVkIGlzIGNoYW5nZWQuLi4gLS0+XFxuXHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdHBhcmFtczoge2xhYmVsOiBzZWxlY3RlZCgpLmxhYmVsLFxcblx0XHRcdFx0XHRcdGljb246IHNlbGVjdGVkKCkuaWNvbixcXG5cdFx0XHRcdFx0XHRyaWdodEljb246IHJpZ2h0SWNvbixcXG5cdFx0XHRcdFx0XHRjbGljazogZHJvcGRvd25WaXNpYmxlLnRvZ2dsZX19XCI+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgY2xhc3M9XCJrbm9iLWRyb3Bkb3duLW1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBvcHRpb25zLCB2aXNpYmxlOiBkcm9wZG93blZpc2libGVcIj5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0XHRcdFx0XHRcdG5hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLFxcblx0XHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IGxhYmVsLCBpY29uOiBpY29uLCBjbGljazogc2VsZWN0fX0sIFxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogJGRhdGEgIT09ICRwYXJlbnQuc2VsZWN0ZWQoKVwiPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbkRyb3Bkb3duKGNvbmZpZykge1xuXHR2YXIgcmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShjb25maWcucmlnaHRJY29uKTtcblxuXHR2YXIgb3B0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLml0ZW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHRvcHRpb25zLnB1c2goY3JlYXRlT3B0aW9uKHtcblx0XHRcdGxhYmVsOiBjb25maWcuaXRlbXNbaWR4XS5sYWJlbCxcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXG5cdFx0XHR2YWx1ZTogY29uZmlnLml0ZW1zW2lkeF0udmFsdWVcblx0XHR9KSk7XG5cdH1cblxuXHR2YXIgc2VsZWN0ZWQgPSBjb25maWcuc2VsZWN0ZWQgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdHNlbGVjdGVkKG9wdGlvbnMoKVswXSk7XG5cblxuXHR2YXIgZHJvcGRvd25WaXNpYmxlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cblx0ZHJvcGRvd25WaXNpYmxlLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZURyb3Bkb3duVmlzaWJsZShpdGVtLCBldmVudCkge1xuXHRcdGlmIChldmVudCkge1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0dmFyIHZpc2libGUgPSBkcm9wZG93blZpc2libGUoKTtcblxuXHRcdGRyb3Bkb3duVmlzaWJsZSghdmlzaWJsZSk7XG5cblxuXHRcdGlmICh2aXNpYmxlKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVPcHRpb24oY29uZmlnKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXG5cdFx0XHRpY29uOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5pY29uKSxcblx0XHRcdHZhbHVlOiBjb25maWcudmFsdWUsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxlY3RlZChvYmopO1xuXHRcdFx0XHRkcm9wZG93blZpc2libGUudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxuXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbkRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPHNwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhZWRpdE1vZGUoKVwiPlxcblx0XHQ8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB2YWx1ZVwiPjwvc3Bhbj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBlZGl0LCBpY29uOiBcXCcjaWNvbi1lZGl0XFwnXCI+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBlZGl0TW9kZVwiPlxcblx0XHQ8a25vYi1pbnB1dCBwYXJhbXM9XCJ2YWx1ZTogZWRpdGVkVmFsdWUsIGhhc0ZvY3VzOiBpbnB1dEhhc0ZvY3VzLCBrZXlEb3duOiBrZXlEb3duLCB2aXNpYmxlOiBlZGl0TW9kZVwiPjwva25vYi1pbnB1dD5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIGNsaWNrOiBzYXZlLCBpY29uOiBcXCcjaWNvbi1zdWNjZXNcXCdcIj48L2tub2ItYnV0dG9uPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IFxcJ1xcJywgY2xpY2s6IGNhbmNlbCwgaWNvbjogXFwnI2ljb24tZGVsZXRlXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG48L3NwYW4+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlubGluZVRleHRFZGl0b3IoY29uZmlnKSB7XG5cdHZhciB2bSA9IHt9O1xuXG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlIHx8IGtvLm9ic2VydmFibGUoXCJcIik7XG5cdHZtLmVkaXRlZFZhbHVlID0ga28ub2JzZXJ2YWJsZSh2bS52YWx1ZSgpKTtcblxuXHR2bS5lZGl0TW9kZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdHZtLmVkaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2bS5lZGl0ZWRWYWx1ZSh2bS52YWx1ZSgpKTtcblx0XHR2bS5lZGl0TW9kZSh0cnVlKTtcblx0XHR2bS5pbnB1dEhhc0ZvY3VzKHRydWUpO1xuXHR9O1xuXG5cdHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2bS52YWx1ZSh2bS5lZGl0ZWRWYWx1ZSgpKTtcblx0XHR2bS5lZGl0TW9kZShmYWxzZSk7XG5cdH07XG5cblx0dm0uY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0dm0uZWRpdE1vZGUoZmFsc2UpO1xuXHR9O1xuXG5cdHZtLmtleURvd24gPSBmdW5jdGlvbihpdGVtLCBldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0cmV0dXJuIHZtLnNhdmUoKTtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcblx0XHRcdHJldHVybiB2bS5jYW5jZWwoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0dm0uaW5wdXRIYXNGb2N1cyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVJbmxpbmVUZXh0RWRpdG9yO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTdHlsZUNvbmZpZyh0aGVtZSkge1xuXHRyZXR1cm4ge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5pbnB1dEJnLFxuXHRcdFx0XHRcImNvbG9yXCI6IHRoZW1lLmlucHV0VGV4dCxcblx0XHRcdFx0XCJib3JkZXItY29sb3JcIjogdGhlbWUuaW5wdXRCb3JkZXJcblx0XHRcdH0sXG5cdFx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuaW5wdXRCZyxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbnB1dFRleHQsXG5cdFx0XHRcdFwiYm9yZGVyLWNvbG9yXCI6IHRoZW1lLmlucHV0VGV4dFxuXHRcdFx0fSxcblx0XHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogdGhlbWUuaW5wdXRCZyxcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbnB1dEFjdGl2ZUNvbG9yLFxuXHRcdFx0XHRcImZpbGxcIjogdGhlbWUuaW5wdXRBY3RpdmVDb2xvclxuXHRcdFx0fSxcblx0XHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiB0aGVtZS5pbnB1dEJvcmRlcixcblx0XHRcdFx0XCJjb2xvclwiOiB0aGVtZS5pbnB1dERpc2FibGVkQ29sb3IsXG5cdFx0XHRcdFwiZmlsbFwiOiB0aGVtZS5pbnB1dEFjdGl2ZUNvbG9yXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxpbnB1dCBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsXFxuXHRcdFx0XHRcdGF0dHI6IHt0eXBlOiB0eXBlfSxcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsXFxuXHRcdFx0XHRcdGhhc0ZvY3VzOiBoYXNGb2N1cyxcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCcsXFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHR2bS5iZWhhdmlvdXJzLmhvdmVyLmVuYWJsZSgpO1xuXHR2bS5iZWhhdmlvdXJzLmZvY3VzLmVuYWJsZSgpO1xuXG5cdHZtLnR5cGUgPSBjb25maWcudHlwZTtcblx0dm0udmFsdWUgPSBjb25maWcudmFsdWUgfHwga28ub2JzZXJ2YWJsZSgpO1xuXHR2bS5oYXNGb2N1cyA9IGNvbmZpZy5oYXNGb2N1cyB8fCBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRpZiAoY29uZmlnLmtleURvd24pIHtcblx0XHR2bS5ldmVudEhhbmRsZXJzLmtleWRvd24gPSBjb25maWcua2V5RG93bjtcblx0fVxuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVJbnB1dDtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0cmlnaHRJY29uOiBcXCcjaWNvbi1kb3duXFwnLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1zUGVyUGFnZShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHR2YXIgbnVtT2ZJdGVtcyA9IGNvbmZpZy5udW1PZkl0ZW1zIHx8IGtvLm9ic2VydmFibGUoMCk7XG5cblx0dmFyIGl0ZW1zUGVyUGFnZUxpc3QgPSBjb25maWcuaXRlbXNQZXJQYWdlTGlzdCB8fCBbe1xuXHRcdGxhYmVsOiAxMCxcblx0XHR2YWx1ZTogMTBcblx0fSwge1xuXHRcdGxhYmVsOiAyNSxcblx0XHR2YWx1ZTogMjVcblx0fSwge1xuXHRcdGxhYmVsOiA1MCxcblx0XHR2YWx1ZTogNTBcblx0fSwge1xuXHRcdGxhYmVsOiAxMDAsXG5cdFx0dmFsdWU6IDEwMFxuXHR9XTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoaXRlbXNQZXJQYWdlTGlzdFswXSk7XG5cblx0dmFyIG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcyB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG51bU9mSXRlbXNWYWwgPSBudW1PZkl0ZW1zKCk7XG5cdFx0dmFyIGl0ZW1zUGVyUGFnZVZhbCA9IGl0ZW1zUGVyUGFnZSgpO1xuXG5cdFx0aWYgKCFpdGVtc1BlclBhZ2VWYWwpIHtcblx0XHRcdHJldHVybiBudW1PZlBhZ2VzKDApO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWcuaXRlbXNQZXJQYWdlKSB7XG5cdFx0XHRjb25maWcuaXRlbXNQZXJQYWdlKGl0ZW1zUGVyUGFnZVZhbC52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bU9mUGFnZXMoTWF0aC5jZWlsKG51bU9mSXRlbXNWYWwgLyBpdGVtc1BlclBhZ2VWYWwudmFsdWUpKTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRudW1PZkl0ZW1zOiBudW1PZkl0ZW1zLFxuXHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlLFxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXMsXG5cblx0XHRpdGVtc1BlclBhZ2VMaXN0OiBpdGVtc1BlclBhZ2VMaXN0XG5cdH07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5mdW5jdGlvbiBrbm9iUmVnaXN0ZXJDb21wb25lbnQobmFtZSwgY3JlYXRlVm0sIHRlbXBsYXRlLCBzdHlsZSkge1xuXHRrby5jb21wb25lbnRzLnJlZ2lzdGVyKG5hbWUsIHtcblx0XHR2aWV3TW9kZWw6IHtcblx0XHRcdGNyZWF0ZVZpZXdNb2RlbDogZnVuY3Rpb24ocGFyYW1zLCBjb21wb25lbnRJbmZvKSB7XG5cdFx0XHRcdHBhcmFtcy5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0XHRyZXR1cm4gY3JlYXRlVm0ocGFyYW1zLCBjb21wb25lbnRJbmZvKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrbm9iUmVnaXN0ZXJDb21wb25lbnQ7XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoY29uZmlnKSB7XG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHR2YXIgZmllbGRzID0gY29uZmlnLmZpZWxkcztcblxuXHR2YXIgc2VhcmNoID0ga28ub2JzZXJ2YWJsZShcIlwiKS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiA1MDBcblx0fSk7XG5cblx0Ly9jb25maWcuc29ydGVyc1xuXHQvLyAtIGxhYmVsXG5cdC8vIC0gcHJvcFxuXG5cdHZhciBzb3J0T3B0aW9ucyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZVF1cmV5T2JqKHByb3AsIGFzYykge1xuXHRcdHZhciBvYmogPSB7fTtcblxuXHRcdG9ialtwcm9wXSA9IGFzYztcblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cdGlmIChjb25maWcuc29ydCkge1xuXHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbmZpZy5zb3J0Lmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHRcdHZhciBhY3QgPSBjb25maWcuc29ydFtpZHhdO1xuXG5cdFx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWNvbjogXCIjaWNvbi1hLXpcIixcblx0XHRcdFx0bGFiZWw6IGFjdCxcblx0XHRcdFx0dmFsdWU6IGNyZWF0ZVF1cmV5T2JqKGFjdCwgMSlcblx0XHRcdH0pO1xuXHRcdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRcdGljb246IFwiI2ljb24tei1hXCIsXG5cdFx0XHRcdGxhYmVsOiBhY3QsXG5cdFx0XHRcdHZhbHVlOiBjcmVhdGVRdXJleU9iaihhY3QsIC0xKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIHNvcnQgPSBrby5vYnNlcnZhYmxlKHNvcnRPcHRpb25zWzBdKTtcblxuXHR2YXIgc2tpcCA9IGtvLm9ic2VydmFibGUoMCk7XG5cdHZhciBsaW1pdCA9IGtvLm9ic2VydmFibGUoMCk7XG5cblxuXHR2YXIgaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXG5cdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXG5cdFx0aXRlbXMucHVzaChpdGVtKTtcblx0fSk7XG5cblx0dmFyIGNvdW50ID0ga28ub2JzZXJ2YWJsZSgwKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5XG5cblx0dmFyIGxvYWRpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5XG5cdHZhciBlcnJvciA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHk/XG5cblxuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWFyY2hWYWwgPSBzZWFyY2goKTtcblx0XHR2YXIgc29ydFZhbCA9IHNvcnQoKS52YWx1ZTtcblx0XHR2YXIgc2tpcFZhbCA9IHNraXAoKTtcblx0XHR2YXIgbGltaXRWYWwgPSBsaW1pdCgpO1xuXG5cdFx0dmFyIGZpbmQgPSB7fTtcblxuXHRcdGZpbmRbY29uZmlnLnNlYXJjaF0gPSAobmV3IFJlZ0V4cChzZWFyY2hWYWwsIFwiaWdcIikpLnRvU3RyaW5nKCk7XG5cblx0XHRzdG9yZS5maW5kID0gZmluZDtcblx0XHRzdG9yZS5zb3J0ID0gc29ydFZhbDtcblx0XHRzdG9yZS5za2lwID0gc2tpcFZhbDtcblx0XHRzdG9yZS5saW1pdCA9IGxpbWl0VmFsO1xuXHR9KS5leHRlbmQoe1xuXHRcdHRocm90dGxlOiAwXG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGJlZm9yZUxvYWQoKSB7XG5cdFx0aWYgKGxvYWRpbmcoKSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJMaXN0IGlzIGFscmVhZHkgbG9hZGluZy4uLlwiKTsgLy90aGlzIG1pZ2h0IGJlIHByb2JsZW1hdGljIGlmIHRoZXJlIGFyZSBubyBnb29kIHRpbWVvdXQgc2V0dGluZ3MuXG5cdFx0fVxuXG5cdFx0bG9hZGluZyh0cnVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZChlcnIpIHtcblx0XHRsb2FkaW5nKGZhbHNlKTtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoZXJyKTtcblx0XHR9XG5cdFx0ZXJyb3IobnVsbCk7XG5cblx0XHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdGNvdW50KHN0b3JlLmNvdW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRPbmx5Q29tcHV0ZWQob2JzZXJ2YWJsZSkge1xuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9ic2VydmFibGUoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRocm93IFwiVGhpcyBjb21wdXRlZCB2YXJpYWJsZSBzaG91bGQgbm90IGJlIHdyaXR0ZW4uXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChiZWZvcmVMb2FkKTtcblx0c3RvcmUubG9hZC5hZnRlci5hZGQoYWZ0ZXJMb2FkKTtcblxuXHRyZXR1cm4ge1xuXHRcdHN0b3JlOiBzdG9yZSxcblxuXHRcdGZpZWxkczogZmllbGRzLCAvL3Nob3VsZCBmaWx0ZXIgdG8gdGhlIGZpZWxkcy4gKHNlbGVjdClcblxuXHRcdHNlYXJjaDogc2VhcmNoLFxuXG5cdFx0c29ydDogc29ydCxcblx0XHRzb3J0T3B0aW9uczogc29ydE9wdGlvbnMsXG5cblx0XHRza2lwOiBza2lwLFxuXHRcdGxpbWl0OiBsaW1pdCxcblxuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRjb3VudDogcmVhZE9ubHlDb21wdXRlZChjb3VudCksXG5cblx0XHRsb2FkaW5nOiByZWFkT25seUNvbXB1dGVkKGxvYWRpbmcpLFxuXHRcdGVycm9yOiByZWFkT25seUNvbXB1dGVkKGVycm9yKVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0XCI+XFxuXHQ8IS0tIGtvIGlmOiBlcnJvciAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OiBlcnJvclwiPjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuXFxuXHQ8ZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdF9fYmFyXCI+XFxuXHRcdFx0PGlucHV0IGNsYXNzPVwia25vYi1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHNlYXJjaCwgdmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiLz5cXG5cdFx0XHQ8a25vYi1idXR0b24gY2xhc3M9XCJrbm9iLWJ1dHRvbi1zZWFyY2hcIiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLFxcblx0XHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ2RlZmF1bHRcXCcsXFxuXHRcdFx0XHRcdFx0XHRcdGljb246IFxcJyNpY29uLXNlYXJjaFxcJ1wiPlxcblx0XHRcdDwva25vYi1idXR0b24+XFxuXHRcdFx0PGtub2ItaXRlbXMtcGVyLXBhZ2UgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19pdGVtcy1wZXItcGFnZVwiIHBhcmFtcz1cIm51bU9mSXRlbXM6IGNvdW50LFxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+XFxuXHRcdFx0PC9rbm9iLWl0ZW1zLXBlci1wYWdlPlxcblx0XHRcdDwhLS0ga28gaWY6IHNvcnRPcHRpb25zLmxlbmd0aCA+IDAgLS0+XFxuXHRcdFx0XHQ8a25vYi1kcm9wZG93biBjbGFzcz1cImtub2ItZHJvcGRvd25cIiBwYXJhbXM9XCJyaWdodEljb246IFxcJyNpY29uLWRvd25cXCcsIHNlbGVjdGVkOiBzb3J0LCBpdGVtczogc29ydE9wdGlvbnNcIj48L2tub2ItZHJvcGRvd24+XFxuXHRcdFx0PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdF9fcmVzdWx0XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YToge21vZGVsOiAkZGF0YSwgcGFyZW50OiAkcGFyZW50LCBpbmRleDogJGluZGV4fSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2Plxcblx0PCEtLVxcblx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBwYWdpbmF0aW9uLm51bU9mSXRlbXMsIGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQtLT5cXG5cdDwhLS0ga28gaWY6IG51bU9mUGFnZXMoKSA+IDAgLS0+XFxuXHRcdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgY3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cdDwhLS0ga28gaWY6ICRkYXRhLmxvYWRNb3JlIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICFsb2FkaW5nKCksIGNsaWNrOiBsb2FkTW9yZVwiPkxvYWQgbW9yZS4uLjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYWZ0ZXJMb2FkKTtcblxuXHR2YXIgbGlzdCA9IGNyZWF0ZUxpc3QoY29uZmlnKTtcblx0Ly92YXIgcGFnaW5hdGlvbiA9IGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnLnBhZ2luYXRpb24pO1xuXHQvL2xpc3QucGFnaW5hdGlvbiA9IHBhZ2luYXRpb247XG5cblx0dmFyIG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKCk7XG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKDEwKTtcblx0dmFyIGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZSgwKTtcblxuXHRsaXN0Lm51bU9mUGFnZXMgPSBudW1PZlBhZ2VzO1xuXHRsaXN0Lml0ZW1zUGVyUGFnZSA9IGl0ZW1zUGVyUGFnZTtcblx0bGlzdC5jdXJyZW50UGFnZSA9IGN1cnJlbnRQYWdlO1xuXG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRsaXN0LnNraXAoY3VycmVudFBhZ2VWYWwgKiBpdGVtc1BlclBhZ2VWYWwpO1xuXHRcdGxpc3QubGltaXQoaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0Lypcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvdW50ID0gbGlzdC5jb3VudCgpO1xuXHRcdGxpc3QucGFnaW5hdGlvbi5udW1PZkl0ZW1zKGNvdW50KTtcblx0fSk7XG5cdCovXG5cblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoKSB7XG5cdFx0bGlzdC5pdGVtcyhbXSk7XG5cdH1cblxuXHRyZXR1cm4gbGlzdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdpbmF0aW9uXCIgZGF0YS1iaW5kPVwiaWY6IHBhZ2VTZWxlY3RvcnMoKS5sZW5ndGhcIj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1maXJzdFxcJywgc3RhdGU6IGZpcnN0KCkuc3RhdGUsIGNsaWNrOiBmaXJzdCgpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1wcmV2XFwnLCBzdGF0ZTogcHJldigpLnN0YXRlLCBjbGljazogcHJldigpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImZvcmVhY2g6IHBhZ2VTZWxlY3RvcnNcIj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBsYWJlbCwgc3RhdGU6IHN0YXRlLCBjbGljazogc2VsZWN0UGFnZVwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tbmV4dFxcJywgc3RhdGU6IG5leHQoKS5zdGF0ZSwgY2xpY2s6IG5leHQoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tbGFzdFxcJywgc3RhdGU6IGxhc3QoKS5zdGF0ZSwgY2xpY2s6IGxhc3QoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvbihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBudW1PZlBhZ2VzO1xuXG5cdGlmIChrby5pc09ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMpKSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzO1xuXHR9IGVsc2Uge1xuXHRcdG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzIHx8IDEwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA8IDApIHtcblx0XHRcdHZhbHVlID0gMDtcblx0XHR9XG5cblx0XHR2YXIgcGFnZXNOdW0gPSBudW1PZlBhZ2VzKCk7XG5cblx0XHRpZiAodmFsdWUgPj0gcGFnZXNOdW0pIHtcblx0XHRcdHZhbHVlID0gcGFnZXNOdW0gLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdHZhciBjdXJyZW50UGFnZSA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2UgPSBjb25maWcuY3VycmVudFBhZ2UgfHwga28ub2JzZXJ2YWJsZSgwKTtcblxuXHRcdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0bnVtT2ZQYWdlcygpO1xuXHRcdFx0Y3VycmVudFBhZ2UoMCk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50UGFnZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRjdXJyZW50UGFnZShub3JtYWxpemUodmFsdWUpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSgpKTtcblxuXHR2YXIgY3VycmVudFBhZ2VSZWFsSWR4O1xuXHR2YXIgcGFnZVNlbGVjdG9ycyA9IChmdW5jdGlvbihjb25maWcpIHtcblx0XHR2YXIgYWZ0ZXJIZWFkID0gY29uZmlnLmFmdGVySGVhZCB8fCAyO1xuXHRcdHZhciBiZWZvcmVUYWlsID0gY29uZmlnLmJlZm9yZVRhaWwgfHwgMjtcblx0XHR2YXIgYmVmb3JlQ3VycmVudCA9IGNvbmZpZy5iZWZvcmVDdXJyZW50IHx8IDI7XG5cdFx0dmFyIGFmdGVyQ3VycmVudCA9IGNvbmZpZy5hZnRlckN1cnJlbnQgfHwgMjtcblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVBhZ2VTZWxlY3RvcihpZHgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBpZHggKyAxLFxuXHRcdFx0XHRzdGF0ZTogXCJkZWZhdWx0XCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN1cnJlbnRQYWdlKGlkeCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IobGFiZWwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBsYWJlbCxcblx0XHRcdFx0c3RhdGU6IFwiZGlzYWJsZWRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSBbXTtcblxuXHRcdFx0dmFyIG51bU9mUGFnZXNWYWwgPSBudW1PZlBhZ2VzKCk7XG5cdFx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXG5cdFx0XHR2YXIgbm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblxuXHRcdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbnVtT2ZQYWdlc1ZhbDsgaWR4ICs9IDEpIHtcblx0XHRcdFx0aWYgKGlkeCA8PSBhZnRlckhlYWQgfHwgaWR4ID49IG51bU9mUGFnZXNWYWwgLSBiZWZvcmVUYWlsIC0gMSB8fCBpZHggPj0gY3VycmVudFBhZ2VWYWwgLSBiZWZvcmVDdXJyZW50ICYmIGlkeCA8PSBjdXJyZW50UGFnZVZhbCArIGFmdGVyQ3VycmVudCkge1xuXHRcdFx0XHRcdHZhciBwYWdlU2VsZWN0b3I7XG5cblx0XHRcdFx0XHRpZiAoaWR4ID09PSBjdXJyZW50UGFnZVZhbCkge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IoaWR4ICsgMSk7XG5cdFx0XHRcdFx0XHRjdXJyZW50UGFnZVJlYWxJZHggPSBlbGVtZW50cy5sZW5ndGg7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZVBhZ2VTZWxlY3RvcihpZHgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVsZW1lbnRzLnB1c2gocGFnZVNlbGVjdG9yKTtcblx0XHRcdFx0XHRub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICghbm9uQ2xpY2thYmxlSW5zZXJ0ZWQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnRzLnB1c2goY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IoXCIuLi5cIikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRub25DbGlja2FibGVJbnNlcnRlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW1lbnRzO1xuXHRcdH0pO1xuXHR9KGNvbmZpZykpO1xuXG5cblx0dmFyIG5leHQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgaWR4ID0gY3VycmVudFBhZ2VSZWFsSWR4ICsgMTtcblxuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblxuXHRcdGlmIChpZHggPj0gcGFnZXMubGVuZ3RoIC0gMSkge1xuXHRcdFx0aWR4ID0gcGFnZXMubGVuZ3RoIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZXNbaWR4XTtcblx0fSk7XG5cblx0dmFyIHByZXYgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgaWR4ID0gY3VycmVudFBhZ2VSZWFsSWR4IC0gMTtcblxuXHRcdGlmIChpZHggPCAwKSB7XG5cdFx0XHRpZHggPSAwO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbaWR4XTtcblx0fSk7XG5cblx0dmFyIGZpcnN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVswXTtcblx0fSk7XG5cblx0dmFyIGxhc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRyZXR1cm4gcGFnZXNbcGFnZXMubGVuZ3RoIC0gMV07XG5cdH0pO1xuXG5cblx0cmV0dXJuIHtcblx0XHRwYWdlU2VsZWN0b3JzOiBwYWdlU2VsZWN0b3JzLFxuXG5cdFx0Zmlyc3Q6IGZpcnN0LFxuXHRcdGxhc3Q6IGxhc3QsXG5cblx0XHRuZXh0OiBuZXh0LFxuXHRcdHByZXY6IHByZXYsXG5cblx0XHRjdXJyZW50UGFnZTogY3VycmVudFBhZ2UsXG5cblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcmFkaW9cIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBpdGVtc1wiPlxcblx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtcXG5cdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdHBhcmFtczoge1xcblx0XHRcdHN0YXRlOiBpc1NlbGVjdGVkKCkgPyBcXCdhY3RpdmVcXCcgOiBcXCdkZWZhdWx0XFwnLFxcblx0XHRcdHZhcmlhdGlvbjogJHBhcmVudC52YXJpYXRpb24sXFxuXHRcdFx0bGFiZWw6IGxhYmVsLFxcblx0XHRcdGljb246IGljb24sXFxuXHRcdFx0cmFkaW86IHRydWUsXFxuXHRcdFx0Z3JvdXA6IGdyb3VwLFxcblx0XHRcdGNsaWNrOiBzZWxlY3RcXG5cdFx0fVxcblx0fVwiPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJhZGlvKGNvbmZpZykge1xuXHR2YXIgdm0gPSB7fTtcblxuXHR2bS5zZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHZtLnNlbGVjdGVkSWR4ID0gY29uZmlnLnNlbGVjdGVkSWR4IHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHR2bS52YXJpYXRpb24gPSBjb25maWcudmFyaWF0aW9uIHx8IFwiZGVmYXVsdFwiO1xuXG5cdHZtLml0ZW1zID0gW107XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLml0ZW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gY29uZmlnLml0ZW1zW2lkeF07XG5cblx0XHR2bS5pdGVtcy5wdXNoKGNyZWF0ZUl0ZW1WbShhY3QubGFiZWwsIGFjdC5pY29uLCBpZHgpKTtcblx0fVxuXG5cdHZhciBzZWwgPSB2bS5zZWxlY3RlZElkeCgpO1xuXG5cdGlmICh0eXBlb2Ygc2VsID09PSBcIm51bWJlclwiKSB7XG5cdFx0c2VsID0gTWF0aC5mbG9vcihzZWwpO1xuXHRcdHNlbCAlPSB2bS5pdGVtcy5sZW5ndGg7XG5cblx0XHR2bS5pdGVtc1tzZWxdLnNlbGVjdCgpO1xuXHR9XG5cblxuXHRmdW5jdGlvbiBjcmVhdGVJdGVtVm0obGFiZWwsIGljb24sIGlkeCkge1xuXHRcdHZhciBvYmogPSB7XG5cdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRpY29uOiBpY29uLFxuXHRcdFx0Z3JvdXA6IGNvbmZpZy5ncm91cCxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZtLnNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdHZtLnNlbGVjdGVkSWR4KGlkeCk7XG5cdFx0XHR9LFxuXHRcdFx0aXNTZWxlY3RlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYmogPT09IHZtLnNlbGVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmFkaW87XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRwYXJlbnQgfSAtLT48IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVUYWIoKSB7XG5cdHJldHVybiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUYWI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2Plxcblx0PGtub2ItcmFkaW8gY2xhc3M9XCJrbm9iLXJhZGlvLS1pbmxpbmVcIiBwYXJhbXM9XCJcXG5cdFx0Z3JvdXA6IHRhYnNHcm91cCxcXG5cdFx0dmFyaWF0aW9uOiBcXCd0YWJcXCcsXFxuXHRcdHNlbGVjdGVkSWR4OiBzZWxlY3RlZElkeCxcXG5cdFx0aXRlbXM6IGJ1dHRvbnNcIj5cXG5cdDwva25vYi1yYWRpbz5cXG5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFuZWxzXCI+XFxuXHRcdDxrbm9iLXRhYiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LnNlbGVjdGVkSWR4KCkgPT0gJGluZGV4KClcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2tub2ItdGFiPlxcblx0PC9kaXY+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBuZXh0VGFic0dyb3VwSWR4ID0gMDtcblxuZnVuY3Rpb24gY29udmVydFBhcmFtc1RvT2JqZWN0KHBhcmFtcykge1xuXHRwYXJhbXMgPSBwYXJhbXMucmVwbGFjZSgvJy9nLCBcIlxcXCJcIik7XG5cblx0dmFyIHBhcmFtcyA9IHBhcmFtcy5zcGxpdChcIixcIik7XG5cblx0dmFyIGNvbnZlcnRlZFBhcmFtcyA9IFtdO1xuXG5cdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHBhcmFtcy5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0dmFyIGFjdCA9IHBhcmFtc1tpZHhdO1xuXG5cdFx0YWN0ID0gYWN0LnRyaW0oKTtcblxuXHRcdGFjdCA9IGFjdC5zcGxpdChcIjpcIik7XG5cblx0XHRpZiAoYWN0Lmxlbmd0aCAhPT0gMikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0YWN0ID0gXCJcXFwiXCIgKyBhY3RbMF0gKyBcIlxcXCJcIiArIFwiOlwiICsgYWN0WzFdO1xuXHRcdGNvbnZlcnRlZFBhcmFtcy5wdXNoKGFjdCk7XG5cdH1cblxuXHRyZXR1cm4gSlNPTi5wYXJzZShcIntcIiArIGNvbnZlcnRlZFBhcmFtcy5qb2luKFwiLFwiKSArIFwifVwiKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFicyhjb25maWcsIGNvbXBvbmVudEluZm8pIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRjb21wb25lbnRJbmZvID0gY29tcG9uZW50SW5mbyB8fCB7fTtcblx0Y29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzIHx8IFtdO1xuXG5cdHZhciBkZWZhdWx0VGFiID0gY29uZmlnLmRlZmF1bHRUYWIgfHwgMDtcblxuXHR2YXIgdm0gPSB7fTtcblxuXHR2YXIgdGFiQnV0dG9ucyA9IFtdO1xuXHR2YXIgdGFiUGFuZWxzID0gW107XG5cblx0dmFyIHRhYklkeCA9IDA7XG5cblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0VGVtcGxhdGVOb2RlID0gY29tcG9uZW50SW5mby50ZW1wbGF0ZU5vZGVzW2lkeF07XG5cblx0XHRpZiAoYWN0VGVtcGxhdGVOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwia25vYi10YWJcIikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0dmFyIHRhYkJ1dHRvbkRhdGEgPSBjb252ZXJ0UGFyYW1zVG9PYmplY3QoYWN0VGVtcGxhdGVOb2RlLmdldEF0dHJpYnV0ZShcInBhcmFtc1wiKSk7XG5cblx0XHR0YWJCdXR0b25EYXRhLnRhYklkeCA9IHRhYklkeDtcblx0XHR0YWJJZHggKz0gMTtcblxuXHRcdHRhYkJ1dHRvbnMucHVzaCh0YWJCdXR0b25EYXRhKTtcblxuXHRcdHRhYlBhbmVscy5wdXNoKGFjdFRlbXBsYXRlTm9kZS5jaGlsZE5vZGVzKTtcblx0fVxuXG5cdGlmICh0YWJQYW5lbHMubGVuZ3RoIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImtub2ItdGFicyBjb21wb25lbnQgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIGtub2ItdGFiIGNvbXBvbmVudCBhcyBhIGNoaWxkIGNvbXBvbmVudCFcIik7XG5cdH1cblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0YWJCdXR0b25zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHR2YXIgYWN0ID0gdGFiQnV0dG9uc1tpZHhdO1xuXG5cdFx0aWYgKCFhY3QuaWNvbiAmJiAhYWN0LmxlZnRJY29uICYmICFhY3QucmlnaHRJY29uICYmICFhY3QubGFiZWwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBjaGlsZCBrbm9iLXRhYiBjb21wb25lbnRzIHNob3VsZCBoYXZlIHByb3BlciBwYXJhbXMgKGljb24gYW5kL29yIGxhYmVsKSBqdXN0IGxpa2Ugd2l0aCBidXR0b25zIVwiKTtcblx0XHR9XG5cdH1cblxuXHR2bS50YWJzR3JvdXAgPSBcInRhYnNHcm91cF9cIiArIG5leHRUYWJzR3JvdXBJZHg7XG5cdG5leHRUYWJzR3JvdXBJZHggKz0gMTtcblxuXHR2bS5zZWxlY3RlZElkeCA9IGtvLm9ic2VydmFibGUoZGVmYXVsdFRhYik7XG5cblx0dm0uYnV0dG9ucyA9IHRhYkJ1dHRvbnM7XG5cdHZtLnBhbmVscyA9IHRhYlBhbmVscztcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlVGFicztcbiJdfQ==
