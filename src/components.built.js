(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

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

	vm.eventHandlers = ko.computed(function() {
		return {
			mouseOver: mouseOver,
			mouseOut: mouseOut,
			mouseDown: mouseDown,
			mouseUp: mouseUp
		};
	});
};

},{}],2:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

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

	var obj = {
		mouseOver: mouseOver,
		mouseOut: mouseOut,
		mouseDown: mouseDown,
		mouseUp: mouseUp
	};

	obj;

	vm.eventHandlers = ko.computed(function() {
		return {
		};
	});
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
module.exports = '<button data-bind="css: cssClass, \n					style: style, \n					click: click, \n					event: eventHandlers, \n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon">\n			<use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use>\n		</svg>\n	</span>\n</button>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9idXR0b25CZWhhdmlvdXIuanMiLCJzcmMvYmFzZS9pbnB1dEJlaGF2aW91ci5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2VkTGlzdC92bS5qcyIsInNyYy9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnaW5hdGlvbi92bS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1dHRvbkJlaGF2aW91cih2bSkge1xuXHR2YXIgcHJldmlvdXNTdGF0ZTtcblxuXHRmdW5jdGlvbiBtb3VzZU92ZXIoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGFjdFN0YXRlICE9PSBcImhvdmVyXCIpIHtcblx0XHRcdHByZXZpb3VzU3RhdGUgPSBhY3RTdGF0ZTtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VPdXQoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUocHJldmlvdXNTdGF0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHR2bS5ldmVudEhhbmRsZXJzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1vdXNlT3ZlcjogbW91c2VPdmVyLFxuXHRcdFx0bW91c2VPdXQ6IG1vdXNlT3V0LFxuXHRcdFx0bW91c2VEb3duOiBtb3VzZURvd24sXG5cdFx0XHRtb3VzZVVwOiBtb3VzZVVwXG5cdFx0fTtcblx0fSk7XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1dHRvbkJlaGF2aW91cih2bSkge1xuXHR2YXIgcHJldmlvdXNTdGF0ZTtcblxuXHRmdW5jdGlvbiBtb3VzZU92ZXIoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGFjdFN0YXRlICE9PSBcImhvdmVyXCIpIHtcblx0XHRcdHByZXZpb3VzU3RhdGUgPSBhY3RTdGF0ZTtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VPdXQoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUocHJldmlvdXNTdGF0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZURvd24oKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJhY3RpdmVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZVVwKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHZtLnN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHR2YXIgb2JqID0ge1xuXHRcdG1vdXNlT3ZlcjogbW91c2VPdmVyLFxuXHRcdG1vdXNlT3V0OiBtb3VzZU91dCxcblx0XHRtb3VzZURvd246IG1vdXNlRG93bixcblx0XHRtb3VzZVVwOiBtb3VzZVVwXG5cdH07XG5cblx0b2JqO1xuXG5cdHZtLmV2ZW50SGFuZGxlcnMgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdH07XG5cdH0pO1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24gY3JlYXRlQmFzZVZtKGNvbmZpZykge1xuXHR2YXIgY29tcG9uZW50ID0gY29uZmlnLmNvbXBvbmVudDtcblx0dmFyIHN0YXRlID0ga28ub2JzZXJ2YWJsZShjb25maWcuc3RhdGUgfHwgXCJkZWZhdWx0XCIpO1xuXHR2YXIgdmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXHR2YXIgc3R5bGUgPSBjb25maWcuc3R5bGU7XG5cblx0dmFyIGNzc0NsYXNzQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gXCJrbm9iLVwiICsgY29tcG9uZW50ICsgXCIgc3RhdGUtXCIgKyBzdGF0ZSgpICsgXCIgdmFyaWF0aW9uLVwiICsgdmFyaWF0aW9uO1xuXHR9KTtcblx0dmFyIHN0eWxlQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3RhdGVWYWwgPSBzdGF0ZSgpO1xuXG5cdFx0cmV0dXJuIHN0eWxlW3ZhcmlhdGlvbl1bc3RhdGVWYWxdO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhcmlhdGlvbjogdmFyaWF0aW9uLFxuXHRcdHN0YXRlOiBzdGF0ZSxcblxuXHRcdGNzc0NsYXNzOiBjc3NDbGFzc0NvbXB1dGVkLFxuXHRcdHN0eWxlOiBzdHlsZUNvbXB1dGVkXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZVZtO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiZGVmYXVsdFwiOiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzI2YTY5YVwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH0sXG5cdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMyYmJiYWRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFwiY29sb3JcIjogXCIjMTMzN2FhXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjYWJjZGVmXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZGRkZGRkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2FhYWFhYVwiXG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMTcxNzE3XCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzE3MTcxN1wiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH1cblx0fSxcblx0XCJwcmltYXJ5XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjM0FCNTRBXCJcblx0XHR9LFxuXHRcdFwiaG92ZXJcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMmJiYmFkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImRpc2FibGVkXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzNBQjU0QVwiXG5cdFx0fVxuXHR9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGJ1dHRvbiBkYXRhLWJpbmQ9XCJjc3M6IGNzc0NsYXNzLCBcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLCBcXG5cdFx0XHRcdFx0Y2xpY2s6IGNsaWNrLCBcXG5cdFx0XHRcdFx0ZXZlbnQ6IGV2ZW50SGFuZGxlcnMsIFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJ1wiPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogbGVmdEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiBsZWZ0SWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+XFxuXHRcdDwvc3ZnPlxcblx0PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtYmluZD1cInRleHQ6IGxhYmVsXCI+PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogcmlnaHRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+XFxuXHRcdFx0PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogcmlnaHRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuPC9idXR0b24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG52YXIgYnV0dG9uQmVoYXZpb3VyID0gcmVxdWlyZShcIi4uL2Jhc2UvYnV0dG9uQmVoYXZpb3VyXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b24oY29uZmlnKSB7XG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImJ1dHRvblwiO1xuXG5cdHZhciB2bSA9IGJhc2UoY29uZmlnKTtcblxuXHRidXR0b25CZWhhdmlvdXIodm0pO1xuXG5cdHZtLmxlZnRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxlZnRJY29uIHx8IGNvbmZpZy5pY29uKSk7XG5cdHZtLnJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5yaWdodEljb24pKTtcblx0dm0ubGFiZWwgPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGFiZWwpKTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG5cbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlLmpzXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbnB1dFwiLCByZXF1aXJlKFwiLi9pbnB1dC92bVwiKSwgcmVxdWlyZShcIi4vaW5wdXQvdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vaW5wdXQvc3R5bGUuanNcIikpO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpLyosIHJlcXVpcmUoXCIuL2J1dHRvbi9zdHlsZS5qc29uXCIpKi8pO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2luYXRpb25cIiwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi92bVwiKSwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pdGVtcy1wZXItcGFnZVwiLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2Uvdm1cIiksIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdlZC1saXN0XCIsIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWxcIikpO1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdHZhciByaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5yaWdodEljb24pO1xuXG5cdHZhciBvcHRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdG9wdGlvbnMucHVzaChjcmVhdGVPcHRpb24oe1xuXHRcdFx0bGFiZWw6IGNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsLFxuXHRcdFx0aWNvbjogY29uZmlnLml0ZW1zW2lkeF0uaWNvbixcblx0XHRcdHZhbHVlOiBjb25maWcuaXRlbXNbaWR4XS52YWx1ZVxuXHRcdH0pKTtcblx0fVxuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpWzBdKTtcblxuXG5cdHZhciBkcm9wZG93blZpc2libGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRkcm9wZG93blZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlRHJvcGRvd25WaXNpYmxlKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR2YXIgdmlzaWJsZSA9IGRyb3Bkb3duVmlzaWJsZSgpO1xuXG5cdFx0ZHJvcGRvd25WaXNpYmxlKCF2aXNpYmxlKTtcblxuXG5cdFx0aWYgKHZpc2libGUpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihjb25maWcpIHtcblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGtvLm9ic2VydmFibGUoY29uZmlnLmxhYmVsKSxcblx0XHRcdGljb246IGtvLm9ic2VydmFibGUoY29uZmlnLmljb24pLFxuXHRcdFx0dmFsdWU6IGNvbmZpZy52YWx1ZSxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cmlnaHRJY29uOiByaWdodEljb24sXG5cblx0XHRzZWxlY3RlZDogc2VsZWN0ZWQsXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcblxuXHRcdGRyb3Bkb3duVmlzaWJsZTogZHJvcGRvd25WaXNpYmxlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uRHJvcGRvd247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJkZWZhdWx0XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiIzAwMFwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzJiYmJhZFwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH0sXG5cdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XCJjb2xvclwiOiBcIiMxMzM3YWFcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNhYmNkZWZcIlxuXHRcdH0sXG5cdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNkZGRkZGRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjYWFhYWFhXCJcblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMxNzE3MTdcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMTcxNzE3XCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fVxuXHR9LFxuXHRcInByaW1hcnlcIjoge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMzQUI1NEFcIlxuXHRcdH0sXG5cdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMyYmJiYWRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjM0FCNTRBXCJcblx0XHR9XG5cdH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8aW5wdXQgZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRhdHRyOiB7dHlwZTogdHlwZX0sXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJyxcXG5cdFx0XHRcdFx0XFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG52YXIgaW5wdXRCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi4vYmFzZS9pbnB1dEJlaGF2aW91clwiKTtcblxuZnVuY3Rpb24gY3JlYXRlSW5wdXQoY29uZmlnKSB7XG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImlucHV0XCI7XG5cdGNvbmZpZy50eXBlID0gY29uZmlnLnR5cGUgfHwgXCJ0ZXh0XCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdGlucHV0QmVoYXZpb3VyKHZtKTtcblxuXHR2bS50eXBlID0gY29uZmlnLnR5cGU7XG5cdHZtLnZhbHVlID0gY29uZmlnLnZhbHVlIHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlSW5wdXQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8a25vYi1kcm9wZG93biBwYXJhbXM9XCJcXG5cdHJpZ2h0SWNvbjogXFwnI2ljb24tZG93blxcJyxcXG5cdHNlbGVjdGVkOiBpdGVtc1BlclBhZ2UsXFxuXHRpdGVtczogaXRlbXNQZXJQYWdlTGlzdFwiPlxcbjwva25vYi1kcm9wZG93bj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVJdGVtc1BlclBhZ2UoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblx0dmFyIG51bU9mSXRlbXMgPSBjb25maWcubnVtT2ZJdGVtcyB8fCBrby5vYnNlcnZhYmxlKDApO1xuXG5cdHZhciBpdGVtc1BlclBhZ2VMaXN0ID0gY29uZmlnLml0ZW1zUGVyUGFnZUxpc3QgfHwgW3tcblx0XHRsYWJlbDogMTAsXG5cdFx0dmFsdWU6IDEwXG5cdH0sIHtcblx0XHRsYWJlbDogMjUsXG5cdFx0dmFsdWU6IDI1XG5cdH0sIHtcblx0XHRsYWJlbDogNTAsXG5cdFx0dmFsdWU6IDUwXG5cdH0sIHtcblx0XHRsYWJlbDogMTAwLFxuXHRcdHZhbHVlOiAxMDBcblx0fV07XG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKGl0ZW1zUGVyUGFnZUxpc3RbMF0pO1xuXG5cdHZhciBudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXMgfHwga28ub2JzZXJ2YWJsZSgpO1xuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBudW1PZkl0ZW1zVmFsID0gbnVtT2ZJdGVtcygpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGlmICghaXRlbXNQZXJQYWdlVmFsKSB7XG5cdFx0XHRyZXR1cm4gbnVtT2ZQYWdlcygwKTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZSkge1xuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxuXG5cdFx0aXRlbXNQZXJQYWdlTGlzdDogaXRlbXNQZXJQYWdlTGlzdFxuXHR9O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24ga25vYlJlZ2lzdGVyQ29tcG9uZW50KG5hbWUsIGNyZWF0ZVZtLCB0ZW1wbGF0ZSwgc3R5bGUpIHtcblx0a28uY29tcG9uZW50cy5yZWdpc3RlcihuYW1lLCB7XG5cdFx0dmlld01vZGVsOiB7XG5cdFx0XHRjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcykge1xuXHRcdFx0XHRwYXJhbXMuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVZtKHBhcmFtcyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga25vYlJlZ2lzdGVyQ29tcG9uZW50O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMaXN0KGNvbmZpZykge1xuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cblx0dmFyIGZpZWxkcyA9IGNvbmZpZy5maWVsZHM7XG5cblx0dmFyIHNlYXJjaCA9IGtvLm9ic2VydmFibGUoXCJcIikuZXh0ZW5kKHtcblx0XHR0aHJvdHRsZTogNTAwXG5cdH0pO1xuXG5cdC8vY29uZmlnLnNvcnRlcnNcblx0Ly8gLSBsYWJlbFxuXHQvLyAtIHByb3BcblxuXHR2YXIgc29ydE9wdGlvbnMgPSBbXTtcblxuXHRmdW5jdGlvbiBjcmVhdGVRdXJleU9iaihwcm9wLCBhc2MpIHtcblx0XHR2YXIgb2JqID0ge307XG5cblx0XHRvYmpbcHJvcF0gPSBhc2M7XG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXHRpZiAoY29uZmlnLnNvcnQpIHtcblx0XHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuc29ydC5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0XHR2YXIgYWN0ID0gY29uZmlnLnNvcnRbaWR4XTtcblxuXHRcdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRcdGljb246IFwiI2ljb24tYS16XCIsXG5cdFx0XHRcdGxhYmVsOiBhY3QsXG5cdFx0XHRcdHZhbHVlOiBjcmVhdGVRdXJleU9iaihhY3QsIDEpXG5cdFx0XHR9KTtcblx0XHRcdHNvcnRPcHRpb25zLnB1c2goe1xuXHRcdFx0XHRpY29uOiBcIiNpY29uLXotYVwiLFxuXHRcdFx0XHRsYWJlbDogYWN0LFxuXHRcdFx0XHR2YWx1ZTogY3JlYXRlUXVyZXlPYmooYWN0LCAtMSlcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBzb3J0ID0ga28ub2JzZXJ2YWJsZShzb3J0T3B0aW9uc1swXSk7XG5cblx0dmFyIHNraXAgPSBrby5vYnNlcnZhYmxlKDApO1xuXHR2YXIgbGltaXQgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cblx0dmFyIGl0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdH0pO1xuXG5cdHZhciBjb3VudCA9IGtvLm9ic2VydmFibGUoMCk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXG5cdHZhciBsb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXHR2YXIgZXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5P1xuXG5cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VhcmNoVmFsID0gc2VhcmNoKCk7XG5cdFx0dmFyIHNvcnRWYWwgPSBzb3J0KCkudmFsdWU7XG5cdFx0dmFyIHNraXBWYWwgPSBza2lwKCk7XG5cdFx0dmFyIGxpbWl0VmFsID0gbGltaXQoKTtcblxuXHRcdHZhciBmaW5kID0ge307XG5cblx0XHRmaW5kW2NvbmZpZy5zZWFyY2hdID0gc2VhcmNoVmFsO1xuXG5cdFx0c3RvcmUuZmluZCA9IGZpbmQ7XG5cdFx0c3RvcmUuc29ydCA9IHNvcnRWYWw7XG5cdFx0c3RvcmUuc2tpcCA9IHNraXBWYWw7XG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdFZhbDtcblx0fSkuZXh0ZW5kKHtcblx0XHR0aHJvdHRsZTogMFxuXHR9KTtcblxuXHRmdW5jdGlvbiBiZWZvcmVMb2FkKCkge1xuXHRcdGlmIChsb2FkaW5nKCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTGlzdCBpcyBhbHJlYWR5IGxvYWRpbmcuLi5cIik7IC8vdGhpcyBtaWdodCBiZSBwcm9ibGVtYXRpYyBpZiB0aGVyZSBhcmUgbm8gZ29vZCB0aW1lb3V0IHNldHRpbmdzLlxuXHRcdH1cblxuXHRcdGxvYWRpbmcodHJ1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoZXJyKSB7XG5cdFx0bG9hZGluZyhmYWxzZSk7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKGVycik7XG5cdFx0fVxuXHRcdGVycm9yKG51bGwpO1xuXG5cdFx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdFx0fSk7XG5cblx0XHRjb3VudChzdG9yZS5jb3VudCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWFkT25seUNvbXB1dGVkKG9ic2VydmFibGUpIHtcblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvYnNlcnZhYmxlKCk7XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aHJvdyBcIlRoaXMgY29tcHV0ZWQgdmFyaWFibGUgc2hvdWxkIG5vdCBiZSB3cml0dGVuLlwiO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYmVmb3JlTG9hZCk7XG5cdHN0b3JlLmxvYWQuYWZ0ZXIuYWRkKGFmdGVyTG9hZCk7XG5cblx0cmV0dXJuIHtcblx0XHRmaWVsZHM6IGZpZWxkcywgLy9zaG91bGQgZmlsdGVyIHRvIHRoZSBmaWVsZHMuIChzZWxlY3QpXG5cblx0XHRzZWFyY2g6IHNlYXJjaCxcblxuXHRcdHNvcnQ6IHNvcnQsXG5cdFx0c29ydE9wdGlvbnM6IHNvcnRPcHRpb25zLFxuXG5cdFx0c2tpcDogc2tpcCxcblx0XHRsaW1pdDogbGltaXQsXG5cblx0XHRpdGVtczogaXRlbXMsXG5cdFx0Y291bnQ6IHJlYWRPbmx5Q29tcHV0ZWQoY291bnQpLFxuXG5cdFx0bG9hZGluZzogcmVhZE9ubHlDb21wdXRlZChsb2FkaW5nKSxcblx0XHRlcnJvcjogcmVhZE9ubHlDb21wdXRlZChlcnJvcilcblx0fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdFwiPlxcblx0PCEtLSBrbyBpZjogZXJyb3IgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidGV4dDogZXJyb3JcIj48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcblxcblx0PGRpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2JhclwiPlxcblx0XHRcdDxpbnB1dCBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2lucHV0XCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogc2VhcmNoLCB2YWx1ZVVwZGF0ZTogXFwnYWZ0ZXJrZXlkb3duXFwnXCIvPlxcblx0XHRcdDxrbm9iLWJ1dHRvbiBjbGFzcz1cImtub2ItYnV0dG9uLXNlYXJjaFwiIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIFxcblx0XHRcdFx0XHRcdFx0XHR2YXJpYXRpb246IFxcJ2RlZmF1bHRcXCcsIFxcblx0XHRcdFx0XHRcdFx0XHRpY29uOiBcXCcjaWNvbi1zZWFyY2hcXCdcIj5cXG5cdFx0XHQ8L2tub2ItYnV0dG9uPlxcblx0XHRcdDxrbm9iLWl0ZW1zLXBlci1wYWdlIGNsYXNzPVwia25vYi1wYWdlbGlzdF9faXRlbXMtcGVyLXBhZ2VcIiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBjb3VudCwgXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLCBcXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+XFxuXHRcdFx0PC9rbm9iLWl0ZW1zLXBlci1wYWdlPlxcblx0XHRcdDwhLS0ga28gaWY6IHNvcnRPcHRpb25zLmxlbmd0aCA+IDAgLS0+XFxuXHRcdFx0XHQ8a25vYi1kcm9wZG93biBjbGFzcz1cImtub2ItZHJvcGRvd25cIiBwYXJhbXM9XCJyaWdodEljb246IFxcJyNpY29uLWRvd25cXCcsIHNlbGVjdGVkOiBzb3J0LCBpdGVtczogc29ydE9wdGlvbnNcIj48L2tub2ItZHJvcGRvd24+XFxuXHRcdFx0PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwia25vYi1wYWdlbGlzdF9fcmVzdWx0XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogbG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj5cXG5cdDwhLS1cXG5cdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZJdGVtczogcGFnaW5hdGlvbi5udW1PZkl0ZW1zLCBpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0LS0+XFxuXHQ8IS0tIGtvIGlmOiBudW1PZlBhZ2VzKCkgPiAwIC0tPlxcblx0XHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mUGFnZXM6IG51bU9mUGFnZXMsIGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0PCEtLSAva28gLS0+XFxuXHQ8IS0tIGtvIGlmOiAkZGF0YS5sb2FkTW9yZSAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhbG9hZGluZygpLCBjbGljazogbG9hZE1vcmVcIj5Mb2FkIG1vcmUuLi48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xudmFyIGNyZWF0ZUxpc3QgPSByZXF1aXJlKFwiLi4vbGlzdC92bVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdlZExpc3QoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGFmdGVyTG9hZCk7XG5cblx0dmFyIGxpc3QgPSBjcmVhdGVMaXN0KGNvbmZpZyk7XG5cdC8vdmFyIHBhZ2luYXRpb24gPSBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZy5wYWdpbmF0aW9uKTtcblx0Ly9saXN0LnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuXG5cdHZhciBudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZSgpO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZSgxMCk7XG5cdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0bGlzdC5udW1PZlBhZ2VzID0gbnVtT2ZQYWdlcztcblx0bGlzdC5pdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2U7XG5cdGxpc3QuY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZTtcblxuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cdFx0dmFyIGl0ZW1zUGVyUGFnZVZhbCA9IGl0ZW1zUGVyUGFnZSgpO1xuXG5cdFx0bGlzdC5za2lwKGN1cnJlbnRQYWdlVmFsICogaXRlbXNQZXJQYWdlVmFsKTtcblx0XHRsaXN0LmxpbWl0KGl0ZW1zUGVyUGFnZVZhbCk7XG5cdH0pO1xuXG5cdC8qXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb3VudCA9IGxpc3QuY291bnQoKTtcblx0XHRsaXN0LnBhZ2luYXRpb24ubnVtT2ZJdGVtcyhjb3VudCk7XG5cdH0pO1xuXHQqL1xuXG5cblx0ZnVuY3Rpb24gYWZ0ZXJMb2FkKCkge1xuXHRcdGxpc3QuaXRlbXMoW10pO1xuXHR9XG5cblx0cmV0dXJuIGxpc3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcGFnaW5hdGlvblwiIGRhdGEtYmluZD1cImlmOiBwYWdlU2VsZWN0b3JzKCkubGVuZ3RoXCI+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tZmlyc3RcXCcsIHN0YXRlOiBmaXJzdCgpLnN0YXRlLCBjbGljazogZmlyc3QoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tcHJldlxcJywgc3RhdGU6IHByZXYoKS5zdGF0ZSwgY2xpY2s6IHByZXYoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBwYWdlU2VsZWN0b3JzXCI+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogbGFiZWwsIHN0YXRlOiBzdGF0ZSwgY2xpY2s6IHNlbGVjdFBhZ2VcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLW5leHRcXCcsIHN0YXRlOiBuZXh0KCkuc3RhdGUsIGNsaWNrOiBuZXh0KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLWxhc3RcXCcsIHN0YXRlOiBsYXN0KCkuc3RhdGUsIGNsaWNrOiBsYXN0KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgbnVtT2ZQYWdlcztcblxuXHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzKSkge1xuXHRcdG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcztcblx0fSBlbHNlIHtcblx0XHRudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcyB8fCAxMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPCAwKSB7XG5cdFx0XHR2YWx1ZSA9IDA7XG5cdFx0fVxuXG5cdFx0dmFyIHBhZ2VzTnVtID0gbnVtT2ZQYWdlcygpO1xuXG5cdFx0aWYgKHZhbHVlID49IHBhZ2VzTnVtKSB7XG5cdFx0XHR2YWx1ZSA9IHBhZ2VzTnVtIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHR2YXIgY3VycmVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlID0gY29uZmlnLmN1cnJlbnRQYWdlIHx8IGtvLm9ic2VydmFibGUoMCk7XG5cblx0XHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdG51bU9mUGFnZXMoKTtcblx0XHRcdGN1cnJlbnRQYWdlKDApO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFBhZ2UoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0Y3VycmVudFBhZ2Uobm9ybWFsaXplKHZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0oKSk7XG5cblx0dmFyIGN1cnJlbnRQYWdlUmVhbElkeDtcblx0dmFyIHBhZ2VTZWxlY3RvcnMgPSAoZnVuY3Rpb24oY29uZmlnKSB7XG5cdFx0dmFyIGFmdGVySGVhZCA9IGNvbmZpZy5hZnRlckhlYWQgfHwgMjtcblx0XHR2YXIgYmVmb3JlVGFpbCA9IGNvbmZpZy5iZWZvcmVUYWlsIHx8IDI7XG5cdFx0dmFyIGJlZm9yZUN1cnJlbnQgPSBjb25maWcuYmVmb3JlQ3VycmVudCB8fCAyO1xuXHRcdHZhciBhZnRlckN1cnJlbnQgPSBjb25maWcuYWZ0ZXJDdXJyZW50IHx8IDI7XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogaWR4ICsgMSxcblx0XHRcdFx0c3RhdGU6IFwiZGVmYXVsdFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdXJyZW50UGFnZShpZHgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGxhYmVsKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRcdHN0YXRlOiBcImRpc2FibGVkXCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge31cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gW107XG5cblx0XHRcdHZhciBudW1PZlBhZ2VzVmFsID0gbnVtT2ZQYWdlcygpO1xuXHRcdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblxuXHRcdFx0dmFyIG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bU9mUGFnZXNWYWw7IGlkeCArPSAxKSB7XG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtIDEgfHwgaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpIHtcblx0XHRcdFx0XHR2YXIgcGFnZVNlbGVjdG9yO1xuXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gY3VycmVudFBhZ2VWYWwpIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGlkeCArIDEpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFBhZ2VSZWFsSWR4ID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKHBhZ2VTZWxlY3Rvcik7XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW5vbkNsaWNrYWJsZUluc2VydGVkKSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKFwiLi4uXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtZW50cztcblx0XHR9KTtcblx0fShjb25maWcpKTtcblxuXG5cdHZhciBuZXh0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCArIDE7XG5cblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRpZiAoaWR4ID49IHBhZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VzW2lkeF07XG5cdH0pO1xuXG5cdHZhciBwcmV2ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCAtIDE7XG5cblx0XHRpZiAoaWR4IDwgMCkge1xuXHRcdFx0aWR4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpW2lkeF07XG5cdH0pO1xuXG5cdHZhciBmaXJzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbMF07XG5cdH0pO1xuXG5cdHZhciBsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0cmV0dXJuIHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdO1xuXHR9KTtcblxuXG5cdHJldHVybiB7XG5cdFx0cGFnZVNlbGVjdG9yczogcGFnZVNlbGVjdG9ycyxcblxuXHRcdGZpcnN0OiBmaXJzdCxcblx0XHRsYXN0OiBsYXN0LFxuXG5cdFx0bmV4dDogbmV4dCxcblx0XHRwcmV2OiBwcmV2LFxuXG5cdFx0Y3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlLFxuXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlc1xuXHR9O1xufTtcbiJdfQ==
