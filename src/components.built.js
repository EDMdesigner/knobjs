(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

module.exports = function buttonBehaviour(vm) {
	var previousState;

	function mouseOver() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		vm.state("hover");
	}

	function mouseOut() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state(previousState);
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

	vm.eventHandlers = {
		mouseover: mouseOver,
		mouseout: mouseOut,
		mousedown: mouseDown,
		mouseup: mouseUp
	};


	return vm;
};

},{}],2:[function(require,module,exports){
/*jslint node: true */
"use strict";

module.exports = function buttonBehaviour(vm) {
	var previousState;

	function mouseOver() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		vm.state("hover");
	}

	function mouseOut() {
		var actState = vm.state();

		if (actState === "disabled") {
			return;
		}

		vm.state(previousState);
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

	vm.eventHandlers = {
		mouseover: mouseOver,
		mouseout: mouseOut,
		focus: focus,
		blur: blur
	};

	return vm;
};

},{}],3:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function createBaseVm(config) {
	var component = config.component;
	var state = ko.observable(config.state || "default");
	var variation = config.variation || "default";

	var style = config.style;

	var cssClassComputed = ko.computed(function() {
		return "knob-" + component + " state-" + state() + " variation-" + variation;
	});
	var styleComputed = ko.computed(function() {
		var stateVal = state();

		return style[variation][stateVal];
	});

	return {
		variation: variation,
		state: state,

		cssClass: cssClassComputed,
		style: styleComputed
	};
}

module.exports = createBaseVm;

},{}],4:[function(require,module,exports){
module.exports = {
	"default": {
		"default": {
			"backgroundColor": "#26a69a",
			"color": "#fff",
			"fill": "#fff"
		},
		"hover": {
			"backgroundColor": "#2bbbad",
			"color": "#fff",
			"fill": "#fff"
		},
		"active": {
			"color": "#1337aa",
			"fill": "#abcdef"
		},
		"disabled": {
			"backgroundColor": "#dddddd",
			"color": "#aaaaaa"
		},
		"success": {
			"backgroundColor": "#171717",
			"color": "#fff",
			"fill": "#fff"
		},
		"error": {
			"backgroundColor": "#171717",
			"color": "#fff",
			"fill": "#fff"
		}
	},
	"primary": {
		"default": {
			"backgroundColor": "#3AB54A"
		},
		"hover": {
			"backgroundColor": "#2bbbad",
			"color": "#fff",
			"fill": "#fff"
		},
		"disabled": {
			"backgroundColor": "#3AB54A"
		}
	}
};

},{}],5:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass, \n					style: style, \n					click: click, \n					event: eventHandlers,\n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
},{}],6:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");
var buttonBehaviour = require("../base/buttonBehaviour");

function createButton(config) {
	config.component = "button";

	var vm = base(config);

	buttonBehaviour(vm);

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;

},{"../base/buttonBehaviour":1,"../base/vm":3}],7:[function(require,module,exports){
/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");

registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), require("./button/style.js"));
registerComponent("knob-input", require("./input/vm"), require("./input/template.html"), require("./input/style.js"));
registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html")/*, require("./button/style.json")*/);
registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"));
registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));
//
},{"./button/style.js":4,"./button/template.html":5,"./button/vm":6,"./dropdown/template.html":8,"./dropdown/vm":9,"./input/style.js":10,"./input/template.html":11,"./input/vm":12,"./itemsPerPage/template.html":13,"./itemsPerPage/vm":14,"./knobRegisterComponent":15,"./pagedList/template.html":17,"./pagedList/vm":18,"./pagination/template.html":19,"./pagination/vm":20}],8:[function(require,module,exports){
module.exports = '<div class="knob-dropdown">\n	<!-- with params, the selected().label won\'t be recalculated, when selected is changed... -->\n	<div data-bind="component: {\n						name: \'knob-button\',\n						params: {label: selected().label,\n						icon: selected().icon,\n						rightIcon: rightIcon,\n						click: dropdownVisible.toggle}}">\n	</div>\n	<div class="knob-dropdown-menu" data-bind="foreach: options, visible: dropdownVisible">\n		<div data-bind="component: {\n							name: \'knob-button\',\n							params: {label: label, icon: icon, click: select}}, \n							visible: $data !== $parent.selected()">\n		</div>\n	</div>\n</div>\n';
},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
module.exports = {
	"default": {
		"default": {
			"backgroundColor": "#fff",
			"color": "#000",
			"fill": "#fff"
		},
		"hover": {
			"backgroundColor": "red",
			"color": "#fff",
			"fill": "#fff"
		},
		"active": {
			"color": "blue",
			"backgroundColor": "pink",
			"fill": "#abcdef"
		},
		"disabled": {
			"backgroundColor": "#dddddd",
			"color": "#aaaaaa"
		},
		"success": {
			"backgroundColor": "#171717",
			"color": "#fff",
			"fill": "#fff"
		},
		"error": {
			"backgroundColor": "#171717",
			"color": "#fff",
			"fill": "#fff"
		}
	},
	"primary": {
		"default": {
			"backgroundColor": "#3AB54A"
		},
		"hover": {
			"backgroundColor": "#2bbbad",
			"color": "#fff",
			"fill": "#fff"
		},
		"disabled": {
			"backgroundColor": "#3AB54A"
		}
	}
};

},{}],11:[function(require,module,exports){
module.exports = '<input data-bind="css: cssClass,\n					style: style,\n					attr: {type: type},\n					event: eventHandlers,\n					disable: state() === \'disabled\',\n					\n					value: value,\n					valueUpdate: \'afterkeydown\'" />';
},{}],12:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

var base = require("../base/vm");
var inputBehaviour = require("../base/inputBehaviour");

function createInput(config) {
	config.component = "input";
	config.type = config.type || "text";

	var vm = base(config);

	inputBehaviour(vm);

	vm.type = config.type;
	vm.value = config.value || ko.observable();

	return vm;
}

module.exports = createInput;

},{"../base/inputBehaviour":2,"../base/vm":3}],13:[function(require,module,exports){
module.exports = '<knob-dropdown params="\n	rightIcon: \'#icon-down\',\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function knobRegisterComponent(name, createVm, template, style) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params) {
				params.style = style;
				return createVm(params);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;

},{}],16:[function(require,module,exports){
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

		find[config.search] = searchVal;

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

},{}],17:[function(require,module,exports){
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-pagelist__input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\', \n								variation: \'default\', \n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count, \n										numOfPages: numOfPages, \n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-down\', selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<div class="knob-pagelist__result" data-bind="foreach: items">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $data } --><!-- /ko -->\n		</div>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],18:[function(require,module,exports){
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

},{"../list/vm":16}],19:[function(require,module,exports){
module.exports = '<div class="knob-pagination" data-bind="if: pageSelectors().length">\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-first\', state: first().state, click: first().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-prev\', state: prev().state, click: prev().selectPage}}"></span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label, state: state, click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-next\', state: next().state, click: next().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-last\', state: last().state, click: last().selectPage}}"></span>\n</div>';
},{}],20:[function(require,module,exports){
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

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9idXR0b25CZWhhdmlvdXIuanMiLCJzcmMvYmFzZS9pbnB1dEJlaGF2aW91ci5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2VkTGlzdC92bS5qcyIsInNyYy9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnaW5hdGlvbi92bS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1dHRvbkJlaGF2aW91cih2bSkge1xuXHR2YXIgcHJldmlvdXNTdGF0ZTtcblxuXHRmdW5jdGlvbiBtb3VzZU92ZXIoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGFjdFN0YXRlICE9PSBcImhvdmVyXCIpIHtcblx0XHRcdHByZXZpb3VzU3RhdGUgPSBhY3RTdGF0ZTtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VPdXQoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUocHJldmlvdXNTdGF0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzID0ge1xuXHRcdG1vdXNlb3ZlcjogbW91c2VPdmVyLFxuXHRcdG1vdXNlb3V0OiBtb3VzZU91dCxcblx0XHRtb3VzZWRvd246IG1vdXNlRG93bixcblx0XHRtb3VzZXVwOiBtb3VzZVVwXG5cdH07XG5cblxuXHRyZXR1cm4gdm07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnV0dG9uQmVoYXZpb3VyKHZtKSB7XG5cdHZhciBwcmV2aW91c1N0YXRlO1xuXG5cdGZ1bmN0aW9uIG1vdXNlT3ZlcigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYWN0U3RhdGUgIT09IFwiaG92ZXJcIikge1xuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShwcmV2aW91c1N0YXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvY3VzKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmx1cigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImRlZmF1bHRcIik7XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzID0ge1xuXHRcdG1vdXNlb3ZlcjogbW91c2VPdmVyLFxuXHRcdG1vdXNlb3V0OiBtb3VzZU91dCxcblx0XHRmb2N1czogZm9jdXMsXG5cdFx0Ymx1cjogYmx1clxuXHR9O1xuXG5cdHJldHVybiB2bTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VWbShjb25maWcpIHtcblx0dmFyIGNvbXBvbmVudCA9IGNvbmZpZy5jb21wb25lbnQ7XG5cdHZhciBzdGF0ZSA9IGtvLm9ic2VydmFibGUoY29uZmlnLnN0YXRlIHx8IFwiZGVmYXVsdFwiKTtcblx0dmFyIHZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblx0dmFyIHN0eWxlID0gY29uZmlnLnN0eWxlO1xuXG5cdHZhciBjc3NDbGFzc0NvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFwia25vYi1cIiArIGNvbXBvbmVudCArIFwiIHN0YXRlLVwiICsgc3RhdGUoKSArIFwiIHZhcmlhdGlvbi1cIiArIHZhcmlhdGlvbjtcblx0fSk7XG5cdHZhciBzdHlsZUNvbXB1dGVkID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN0YXRlVmFsID0gc3RhdGUoKTtcblxuXHRcdHJldHVybiBzdHlsZVt2YXJpYXRpb25dW3N0YXRlVmFsXTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YXJpYXRpb246IHZhcmlhdGlvbixcblx0XHRzdGF0ZTogc3RhdGUsXG5cblx0XHRjc3NDbGFzczogY3NzQ2xhc3NDb21wdXRlZCxcblx0XHRzdHlsZTogc3R5bGVDb21wdXRlZFxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VWbTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcImRlZmF1bHRcIjoge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMyNmE2OWFcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMmJiYmFkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcImNvbG9yXCI6IFwiIzEzMzdhYVwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2FiY2RlZlwiXG5cdFx0fSxcblx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiI2RkZGRkZFwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNhYWFhYWFcIlxuXHRcdH0sXG5cdFx0XCJzdWNjZXNzXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzE3MTcxN1wiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH0sXG5cdFx0XCJlcnJvclwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMxNzE3MTdcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9XG5cdH0sXG5cdFwicHJpbWFyeVwiOiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzNBQjU0QVwiXG5cdFx0fSxcblx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzJiYmJhZFwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH0sXG5cdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMzQUI1NEFcIlxuXHRcdH1cblx0fVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxidXR0b24gZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcywgXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZSwgXFxuXHRcdFx0XHRcdGNsaWNrOiBjbGljaywgXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJ1wiPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogbGVmdEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBsZWZ0SWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdDwvc3ZnPlxcblx0PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtYmluZD1cInRleHQ6IGxhYmVsXCI+PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogcmlnaHRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+XFxuXHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogcmlnaHRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuPC9idXR0b24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG52YXIgYnV0dG9uQmVoYXZpb3VyID0gcmVxdWlyZShcIi4uL2Jhc2UvYnV0dG9uQmVoYXZpb3VyXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oY29uZmlnKSB7XG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImJ1dHRvblwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHRidXR0b25CZWhhdmlvdXIodm0pO1xuXG5cdHZtLmxlZnRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxlZnRJY29uIHx8IGNvbmZpZy5pY29uKSk7XG5cdHZtLnJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5yaWdodEljb24pKTtcblx0dm0ubGFiZWwgPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGFiZWwpKTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG5cbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlLmpzXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbnB1dFwiLCByZXF1aXJlKFwiLi9pbnB1dC92bVwiKSwgcmVxdWlyZShcIi4vaW5wdXQvdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vaW5wdXQvc3R5bGUuanNcIikpO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpLyosIHJlcXVpcmUoXCIuL2J1dHRvbi9zdHlsZS5qc29uXCIpKi8pO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2luYXRpb25cIiwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi92bVwiKSwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pdGVtcy1wZXItcGFnZVwiLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2Uvdm1cIiksIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdlZC1saXN0XCIsIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWxcIikpO1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdHZhciByaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5yaWdodEljb24pO1xuXG5cdHZhciBvcHRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdG9wdGlvbnMucHVzaChjcmVhdGVPcHRpb24oe1xuXHRcdFx0bGFiZWw6IGNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsLFxuXHRcdFx0aWNvbjogY29uZmlnLml0ZW1zW2lkeF0uaWNvbixcblx0XHRcdHZhbHVlOiBjb25maWcuaXRlbXNbaWR4XS52YWx1ZVxuXHRcdH0pKTtcblx0fVxuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpWzBdKTtcblxuXG5cdHZhciBkcm9wZG93blZpc2libGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRkcm9wZG93blZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlRHJvcGRvd25WaXNpYmxlKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR2YXIgdmlzaWJsZSA9IGRyb3Bkb3duVmlzaWJsZSgpO1xuXG5cdFx0ZHJvcGRvd25WaXNpYmxlKCF2aXNpYmxlKTtcblxuXG5cdFx0aWYgKHZpc2libGUpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihjb25maWcpIHtcblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGtvLm9ic2VydmFibGUoY29uZmlnLmxhYmVsKSxcblx0XHRcdGljb246IGtvLm9ic2VydmFibGUoY29uZmlnLmljb24pLFxuXHRcdFx0dmFsdWU6IGNvbmZpZy52YWx1ZSxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cmlnaHRJY29uOiByaWdodEljb24sXG5cblx0XHRzZWxlY3RlZDogc2VsZWN0ZWQsXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcblxuXHRcdGRyb3Bkb3duVmlzaWJsZTogZHJvcGRvd25WaXNpYmxlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uRHJvcGRvd247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJkZWZhdWx0XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiIzAwMFwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmVkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImFjdGl2ZVwiOiB7XG5cdFx0XHRcImNvbG9yXCI6IFwiYmx1ZVwiLFxuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJwaW5rXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjYWJjZGVmXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZGRkZGRkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2FhYWFhYVwiXG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMTcxNzE3XCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzE3MTcxN1wiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH1cblx0fSxcblx0XCJwcmltYXJ5XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjM0FCNTRBXCJcblx0XHR9LFxuXHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMmJiYmFkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzNBQjU0QVwiXG5cdFx0fVxuXHR9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGlucHV0IGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZSxcXG5cdFx0XHRcdFx0YXR0cjoge3R5cGU6IHR5cGV9LFxcblx0XHRcdFx0XHRldmVudDogZXZlbnRIYW5kbGVycyxcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCcsXFxuXHRcdFx0XHRcdFxcblx0XHRcdFx0XHR2YWx1ZTogdmFsdWUsXFxuXHRcdFx0XHRcdHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIiAvPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuLi9iYXNlL3ZtXCIpO1xudmFyIGlucHV0QmVoYXZpb3VyID0gcmVxdWlyZShcIi4uL2Jhc2UvaW5wdXRCZWhhdmlvdXJcIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGNvbmZpZykge1xuXHRjb25maWcuY29tcG9uZW50ID0gXCJpbnB1dFwiO1xuXHRjb25maWcudHlwZSA9IGNvbmZpZy50eXBlIHx8IFwidGV4dFwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHRpbnB1dEJlaGF2aW91cih2bSk7XG5cblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlucHV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWRvd25cXCcsXFxuXHRzZWxlY3RlZDogaXRlbXNQZXJQYWdlLFxcblx0aXRlbXM6IGl0ZW1zUGVyUGFnZUxpc3RcIj5cXG48L2tub2ItZHJvcGRvd24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSXRlbXNQZXJQYWdlKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdHZhciBudW1PZkl0ZW1zID0gY29uZmlnLm51bU9mSXRlbXMgfHwga28ub2JzZXJ2YWJsZSgwKTtcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XG5cdFx0bGFiZWw6IDEwLFxuXHRcdHZhbHVlOiAxMFxuXHR9LCB7XG5cdFx0bGFiZWw6IDI1LFxuXHRcdHZhbHVlOiAyNVxuXHR9LCB7XG5cdFx0bGFiZWw6IDUwLFxuXHRcdHZhbHVlOiA1MFxuXHR9LCB7XG5cdFx0bGFiZWw6IDEwMCxcblx0XHR2YWx1ZTogMTAwXG5cdH1dO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZShpdGVtc1BlclBhZ2VMaXN0WzBdKTtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzIHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgbnVtT2ZJdGVtc1ZhbCA9IG51bU9mSXRlbXMoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRpZiAoIWl0ZW1zUGVyUGFnZVZhbCkge1xuXHRcdFx0cmV0dXJuIG51bU9mUGFnZXMoMCk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2UpIHtcblx0XHRcdGNvbmZpZy5pdGVtc1BlclBhZ2UoaXRlbXNQZXJQYWdlVmFsLnZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVtT2ZQYWdlcyhNYXRoLmNlaWwobnVtT2ZJdGVtc1ZhbCAvIGl0ZW1zUGVyUGFnZVZhbC52YWx1ZSkpO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdG51bU9mSXRlbXM6IG51bU9mSXRlbXMsXG5cdFx0aXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2UsXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcblxuXHRcdGl0ZW1zUGVyUGFnZUxpc3Q6IGl0ZW1zUGVyUGFnZUxpc3Rcblx0fTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGtub2JSZWdpc3RlckNvbXBvbmVudChuYW1lLCBjcmVhdGVWbSwgdGVtcGxhdGUsIHN0eWxlKSB7XG5cdGtvLmNvbXBvbmVudHMucmVnaXN0ZXIobmFtZSwge1xuXHRcdHZpZXdNb2RlbDoge1xuXHRcdFx0Y3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHRcdFx0cGFyYW1zLnN0eWxlID0gc3R5bGU7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVWbShwYXJhbXMpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtub2JSZWdpc3RlckNvbXBvbmVudDtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGlzdChjb25maWcpIHtcblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXG5cdHZhciBmaWVsZHMgPSBjb25maWcuZmllbGRzO1xuXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IDUwMFxuXHR9KTtcblxuXHQvL2NvbmZpZy5zb3J0ZXJzXG5cdC8vIC0gbGFiZWxcblx0Ly8gLSBwcm9wXG5cblx0dmFyIHNvcnRPcHRpb25zID0gW107XG5cblx0ZnVuY3Rpb24gY3JlYXRlUXVyZXlPYmoocHJvcCwgYXNjKSB7XG5cdFx0dmFyIG9iaiA9IHt9O1xuXG5cdFx0b2JqW3Byb3BdID0gYXNjO1xuXHRcdHJldHVybiBvYmo7XG5cdH1cblx0aWYgKGNvbmZpZy5zb3J0KSB7XG5cdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLnNvcnQubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdFx0dmFyIGFjdCA9IGNvbmZpZy5zb3J0W2lkeF07XG5cblx0XHRcdHNvcnRPcHRpb25zLnB1c2goe1xuXHRcdFx0XHRpY29uOiBcIiNpY29uLWEtelwiLFxuXHRcdFx0XHRsYWJlbDogYWN0LFxuXHRcdFx0XHR2YWx1ZTogY3JlYXRlUXVyZXlPYmooYWN0LCAxKVxuXHRcdFx0fSk7XG5cdFx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWNvbjogXCIjaWNvbi16LWFcIixcblx0XHRcdFx0bGFiZWw6IGFjdCxcblx0XHRcdFx0dmFsdWU6IGNyZWF0ZVF1cmV5T2JqKGFjdCwgLTEpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHR2YXIgc29ydCA9IGtvLm9ic2VydmFibGUoc29ydE9wdGlvbnNbMF0pO1xuXG5cdHZhciBza2lwID0ga28ub2JzZXJ2YWJsZSgwKTtcblx0dmFyIGxpbWl0ID0ga28ub2JzZXJ2YWJsZSgwKTtcblxuXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHR9KTtcblxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblxuXHR2YXIgbG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cblxuXG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlYXJjaFZhbCA9IHNlYXJjaCgpO1xuXHRcdHZhciBzb3J0VmFsID0gc29ydCgpLnZhbHVlO1xuXHRcdHZhciBza2lwVmFsID0gc2tpcCgpO1xuXHRcdHZhciBsaW1pdFZhbCA9IGxpbWl0KCk7XG5cblx0XHR2YXIgZmluZCA9IHt9O1xuXG5cdFx0ZmluZFtjb25maWcuc2VhcmNoXSA9IHNlYXJjaFZhbDtcblxuXHRcdHN0b3JlLmZpbmQgPSBmaW5kO1xuXHRcdHN0b3JlLnNvcnQgPSBzb3J0VmFsO1xuXHRcdHN0b3JlLnNraXAgPSBza2lwVmFsO1xuXHRcdHN0b3JlLmxpbWl0ID0gbGltaXRWYWw7XG5cdH0pLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IDBcblx0fSk7XG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRpZiAobG9hZGluZygpKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkxpc3QgaXMgYWxyZWFkeSBsb2FkaW5nLi4uXCIpOyAvL3RoaXMgbWlnaHQgYmUgcHJvYmxlbWF0aWMgaWYgdGhlcmUgYXJlIG5vIGdvb2QgdGltZW91dCBzZXR0aW5ncy5cblx0XHR9XG5cblx0XHRsb2FkaW5nKHRydWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWZ0ZXJMb2FkKGVycikge1xuXHRcdGxvYWRpbmcoZmFsc2UpO1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcihlcnIpO1xuXHRcdH1cblx0XHRlcnJvcihudWxsKTtcblxuXHRcdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXG5cdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0Y291bnQoc3RvcmUuY291bnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVhZE9ubHlDb21wdXRlZChvYnNlcnZhYmxlKSB7XG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JzZXJ2YWJsZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhyb3cgXCJUaGlzIGNvbXB1dGVkIHZhcmlhYmxlIHNob3VsZCBub3QgYmUgd3JpdHRlbi5cIjtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXG5cdFx0c2VhcmNoOiBzZWFyY2gsXG5cblx0XHRzb3J0OiBzb3J0LFxuXHRcdHNvcnRPcHRpb25zOiBzb3J0T3B0aW9ucyxcblxuXHRcdHNraXA6IHNraXAsXG5cdFx0bGltaXQ6IGxpbWl0LFxuXG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdGNvdW50OiByZWFkT25seUNvbXB1dGVkKGNvdW50KSxcblxuXHRcdGxvYWRpbmc6IHJlYWRPbmx5Q29tcHV0ZWQobG9hZGluZyksXG5cdFx0ZXJyb3I6IHJlYWRPbmx5Q29tcHV0ZWQoZXJyb3IpXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RcIj5cXG5cdDwhLS0ga28gaWY6IGVycm9yIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInRleHQ6IGVycm9yXCI+PC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cXG5cdDxkaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19iYXJcIj5cXG5cdFx0XHQ8aW5wdXQgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHNlYXJjaCwgdmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiLz5cXG5cdFx0XHQ8a25vYi1idXR0b24gY2xhc3M9XCJrbm9iLWJ1dHRvbi1zZWFyY2hcIiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBcXG5cdFx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLCBcXG5cdFx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tc2VhcmNoXFwnXCI+XFxuXHRcdFx0PC9rbm9iLWJ1dHRvbj5cXG5cdFx0XHQ8a25vYi1pdGVtcy1wZXItcGFnZSBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2l0ZW1zLXBlci1wYWdlXCIgcGFyYW1zPVwibnVtT2ZJdGVtczogY291bnQsIFxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPlxcblx0XHRcdDwva25vYi1pdGVtcy1wZXItcGFnZT5cXG5cdFx0XHQ8IS0tIGtvIGlmOiBzb3J0T3B0aW9ucy5sZW5ndGggPiAwIC0tPlxcblx0XHRcdFx0PGtub2ItZHJvcGRvd24gY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCIgcGFyYW1zPVwicmlnaHRJY29uOiBcXCcjaWNvbi1kb3duXFwnLCBzZWxlY3RlZDogc29ydCwgaXRlbXM6IHNvcnRPcHRpb25zXCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0XHRcdDwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX3Jlc3VsdFwiIGRhdGEtYmluZD1cImZvcmVhY2g6IGl0ZW1zXCI+XFxuXHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+XFxuXHQ8IS0tXFxuXHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mSXRlbXM6IHBhZ2luYXRpb24ubnVtT2ZJdGVtcywgaXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdC0tPlxcblx0PCEtLSBrbyBpZjogbnVtT2ZQYWdlcygpID4gMCAtLT5cXG5cdFx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLCBjdXJyZW50UGFnZTogY3VycmVudFBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdDwhLS0gL2tvIC0tPlxcblx0PCEtLSBrbyBpZjogJGRhdGEubG9hZE1vcmUgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogIWxvYWRpbmcoKSwgY2xpY2s6IGxvYWRNb3JlXCI+TG9hZCBtb3JlLi4uPC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcbnZhciBjcmVhdGVMaXN0ID0gcmVxdWlyZShcIi4uL2xpc3Qvdm1cIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnZWRMaXN0KGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChhZnRlckxvYWQpO1xuXG5cdHZhciBsaXN0ID0gY3JlYXRlTGlzdChjb25maWcpO1xuXHQvL3ZhciBwYWdpbmF0aW9uID0gY3JlYXRlUGFnaW5hdGlvbihjb25maWcucGFnaW5hdGlvbik7XG5cdC8vbGlzdC5wYWdpbmF0aW9uID0gcGFnaW5hdGlvbjtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoKTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoMTApO1xuXHR2YXIgY3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdGxpc3QubnVtT2ZQYWdlcyA9IG51bU9mUGFnZXM7XG5cdGxpc3QuaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlO1xuXHRsaXN0LmN1cnJlbnRQYWdlID0gY3VycmVudFBhZ2U7XG5cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGxpc3Quc2tpcChjdXJyZW50UGFnZVZhbCAqIGl0ZW1zUGVyUGFnZVZhbCk7XG5cdFx0bGlzdC5saW1pdChpdGVtc1BlclBhZ2VWYWwpO1xuXHR9KTtcblxuXHQvKlxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY291bnQgPSBsaXN0LmNvdW50KCk7XG5cdFx0bGlzdC5wYWdpbmF0aW9uLm51bU9mSXRlbXMoY291bnQpO1xuXHR9KTtcblx0Ki9cblxuXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZCgpIHtcblx0XHRsaXN0Lml0ZW1zKFtdKTtcblx0fVxuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLXBhZ2luYXRpb25cIiBkYXRhLWJpbmQ9XCJpZjogcGFnZVNlbGVjdG9ycygpLmxlbmd0aFwiPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLWZpcnN0XFwnLCBzdGF0ZTogZmlyc3QoKS5zdGF0ZSwgY2xpY2s6IGZpcnN0KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLXByZXZcXCcsIHN0YXRlOiBwcmV2KCkuc3RhdGUsIGNsaWNrOiBwcmV2KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFnZVNlbGVjdG9yc1wiPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IGxhYmVsLCBzdGF0ZTogc3RhdGUsIGNsaWNrOiBzZWxlY3RQYWdlXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1uZXh0XFwnLCBzdGF0ZTogbmV4dCgpLnN0YXRlLCBjbGljazogbmV4dCgpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1sYXN0XFwnLCBzdGF0ZTogbGFzdCgpLnN0YXRlLCBjbGljazogbGFzdCgpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cblx0dmFyIG51bU9mUGFnZXM7XG5cblx0aWYgKGtvLmlzT2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcykpIHtcblx0XHRudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXM7XG5cdH0gZWxzZSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMgfHwgMTApO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlIDwgMCkge1xuXHRcdFx0dmFsdWUgPSAwO1xuXHRcdH1cblxuXHRcdHZhciBwYWdlc051bSA9IG51bU9mUGFnZXMoKTtcblxuXHRcdGlmICh2YWx1ZSA+PSBwYWdlc051bSkge1xuXHRcdFx0dmFsdWUgPSBwYWdlc051bSAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0dmFyIGN1cnJlbnRQYWdlID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZSA9IGNvbmZpZy5jdXJyZW50UGFnZSB8fCBrby5vYnNlcnZhYmxlKDApO1xuXG5cdFx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRudW1PZlBhZ2VzKCk7XG5cdFx0XHRjdXJyZW50UGFnZSgwKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRQYWdlKCk7XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGN1cnJlbnRQYWdlKG5vcm1hbGl6ZSh2YWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KCkpO1xuXG5cdHZhciBjdXJyZW50UGFnZVJlYWxJZHg7XG5cdHZhciBwYWdlU2VsZWN0b3JzID0gKGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciBhZnRlckhlYWQgPSBjb25maWcuYWZ0ZXJIZWFkIHx8IDI7XG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xuXHRcdHZhciBiZWZvcmVDdXJyZW50ID0gY29uZmlnLmJlZm9yZUN1cnJlbnQgfHwgMjtcblx0XHR2YXIgYWZ0ZXJDdXJyZW50ID0gY29uZmlnLmFmdGVyQ3VycmVudCB8fCAyO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXG5cdFx0XHRcdHN0YXRlOiBcImRlZmF1bHRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3VycmVudFBhZ2UoaWR4KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihsYWJlbCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0XHRzdGF0ZTogXCJkaXNhYmxlZFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHt9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50cyA9IFtdO1xuXG5cdFx0XHR2YXIgbnVtT2ZQYWdlc1ZhbCA9IG51bU9mUGFnZXMoKTtcblx0XHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cblx0XHRcdHZhciBub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXG5cdFx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1PZlBhZ2VzVmFsOyBpZHggKz0gMSkge1xuXHRcdFx0XHRpZiAoaWR4IDw9IGFmdGVySGVhZCB8fCBpZHggPj0gbnVtT2ZQYWdlc1ZhbCAtIGJlZm9yZVRhaWwgLSAxIHx8IGlkeCA+PSBjdXJyZW50UGFnZVZhbCAtIGJlZm9yZUN1cnJlbnQgJiYgaWR4IDw9IGN1cnJlbnRQYWdlVmFsICsgYWZ0ZXJDdXJyZW50KSB7XG5cdFx0XHRcdFx0dmFyIHBhZ2VTZWxlY3RvcjtcblxuXHRcdFx0XHRcdGlmIChpZHggPT09IGN1cnJlbnRQYWdlVmFsKSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihpZHggKyAxKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlUmVhbElkeCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChwYWdlU2VsZWN0b3IpO1xuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFub25DbGlja2FibGVJbnNlcnRlZCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fSk7XG5cdH0oY29uZmlnKSk7XG5cblxuXHR2YXIgbmV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggKyAxO1xuXG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0aWYgKGlkeCA+PSBwYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHggPSBwYWdlcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlc1tpZHhdO1xuXHR9KTtcblxuXHR2YXIgcHJldiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggLSAxO1xuXG5cdFx0aWYgKGlkeCA8IDApIHtcblx0XHRcdGlkeCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVtpZHhdO1xuXHR9KTtcblxuXHR2YXIgZmlyc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpWzBdO1xuXHR9KTtcblxuXHR2YXIgbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblxuXHRcdHJldHVybiBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcblx0fSk7XG5cblxuXHRyZXR1cm4ge1xuXHRcdHBhZ2VTZWxlY3RvcnM6IHBhZ2VTZWxlY3RvcnMsXG5cblx0XHRmaXJzdDogZmlyc3QsXG5cdFx0bGFzdDogbGFzdCxcblxuXHRcdG5leHQ6IG5leHQsXG5cdFx0cHJldjogcHJldixcblxuXHRcdGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZSxcblxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXNcblx0fTtcbn07XG4iXX0=
