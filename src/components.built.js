(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

	var previousState;
	function mouseOver() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		if (actState !== "hover") {
			previousState = actState;
		}

		state("hover");
	}

	function mouseOut() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		state(previousState);
	}

	function mouseDown() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		state("active");
	}

	function mouseUp() {
		var actState = state();

		if (actState === "disabled") {
			return;
		}

		state("hover");
	}

	return {
		variation: variation,
		state: state,	

		cssClass: cssClassComputed,
		style: styleComputed,

		mouseOver: mouseOver,
		mouseOut: mouseOut,
		mouseDown: mouseDown,
		mouseUp: mouseUp
	};
}

module.exports = createBaseVm;

},{}],2:[function(require,module,exports){
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
		"disabled": {
			"backgroundColor": "#3AB54A"
		}
	}
};

},{}],3:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass, \n					style: style, \n					click: click, \n					event: {mouseover: mouseOver, mouseout: mouseOut, mousedown: mouseDown, mouseup: mouseUp}, \n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use></svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use></svg>\n	</span>\n\n</button>';
},{}],4:[function(require,module,exports){
"use strict";

var ko = (window.ko);

var base = require("../base/vm");

function createButton(config) {
	config.component = "button";

	var vm = base(config);

	vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
	vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
	vm.label = ko.observable(ko.unwrap(config.label));
	vm.click = config.click || function() {};

	return vm;
}

module.exports = createButton;

},{"../base/vm":1}],5:[function(require,module,exports){
/*jslint node: true */
"use strict";

//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");

registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), require("./button/style.js"));
registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html")/*, require("./button/style.json")*/);
registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"));
registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));

//
},{"./button/style.js":2,"./button/template.html":3,"./button/vm":4,"./dropdown/template.html":6,"./dropdown/vm":7,"./itemsPerPage/template.html":8,"./itemsPerPage/vm":9,"./knobRegisterComponent":10,"./pagedList/template.html":12,"./pagedList/vm":13,"./pagination/template.html":14,"./pagination/vm":15}],6:[function(require,module,exports){
module.exports = '<div class="knob-dropdown">\n	<!-- with params, the selected().label won\'t be recalculated, when selected is changed... -->\n	<div data-bind="component: {name: \'knob-button\', params: {label: selected().label, icon: selected().icon, rightIcon: rightIcon, click: dropdownVisible.toggle}}"></div>\n	<div class="knob-dropdown-menu" data-bind="foreach: options, visible: dropdownVisible">\n		<div data-bind="component: {name: \'knob-button\', params: {label: label, icon: icon, click: select}}, visible: $data !== $parent.selected()"></div>\n	</div>\n</div>\n';
},{}],7:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);


function createButtonDropdown (config) {
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
			select: function(item) {
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

},{}],8:[function(require,module,exports){
module.exports = '<knob-dropdown params="\n	rightIcon: \'#icon-down\',\n	selected: itemsPerPage,\n	items: itemsPerPageList">\n</knob-dropdown>';
},{}],9:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

module.exports = function createItemsPerPage(config) {
	config = config || {};
	var numOfItems = config.numOfItems || ko.observable(0);

	var itemsPerPageList = config.itemsPerPageList || [{label: 10, value: 10}, {label: 25, value: 25}, {label: 50, value: 50}, {label: 100, value: 100}];
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

},{}],10:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);

function knobRegisterComponent(name, createVm, template, style) {
	ko.components.register(name, {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				params.style = style;
				return createVm(params);
			}
		},
		template: template
	});
}

module.exports = knobRegisterComponent;
},{}],11:[function(require,module,exports){
/*jslint node: true */
"use strict";

var ko = (window.ko);



module.exports = function createList(config) {
	var store = config.store;

	var fields = config.fields;

	var search = ko.observable("").extend({throttle: 500});

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
		for(var idx = 0; idx < config.sort.length; idx += 1) {
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
	}).extend({throttle: 0});

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

},{}],12:[function(require,module,exports){
module.exports = '<div>\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n	<div>\n		<div>\n			<input type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/><knob-button params="label: \'\', variation: \'default\', icon: \'#icon-search\'"></knob-button>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown params="rightIcon: \'#icon-down\', selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n			<knob-items-per-page params="numOfItems: count, numOfPages: numOfPages, itemsPerPage: itemsPerPage"></knob-items-per-page>\n		</div>\n		<div data-bind="foreach: items">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $data } --><!-- /ko -->\n		</div>\n	</div>\n	<div data-bind="visible: loading">Loading...</div>\n\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n\n\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>';
},{}],13:[function(require,module,exports){
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

},{"../list/vm":11}],14:[function(require,module,exports){
module.exports = '<div data-bind="if: pageSelectors().length">\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-first\', state: first().state, click: first().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-prev\', state: prev().state, click: prev().selectPage}}"></span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label, state: state, click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-next\', state: next().state, click: next().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-last\', state: last().state, click: last().selectPage}}"></span>\n</div>';
},{}],15:[function(require,module,exports){
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

		function createPageSelector(idx, isCurrentPage) {
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
				if (idx <= afterHead || idx >= numOfPagesVal - beforeTail -1 || (idx >= currentPageVal - beforeCurrent && idx <= currentPageVal + afterCurrent)) {
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

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS92bS5qcyIsInNyYy9idXR0b24vc3R5bGUuanMiLCJzcmMvYnV0dG9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvYnV0dG9uL3ZtLmpzIiwic3JjL2NvbXBvbmVudHMuanMiLCJzcmMvZHJvcGRvd24vdGVtcGxhdGUuaHRtbCIsInNyYy9kcm9wZG93bi92bS5qcyIsInNyYy9pdGVtc1BlclBhZ2UvdGVtcGxhdGUuaHRtbCIsInNyYy9pdGVtc1BlclBhZ2Uvdm0uanMiLCJzcmMva25vYlJlZ2lzdGVyQ29tcG9uZW50LmpzIiwic3JjL2xpc3Qvdm0uanMiLCJzcmMvcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnZWRMaXN0L3ZtLmpzIiwic3JjL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbCIsInNyYy9wYWdpbmF0aW9uL3ZtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24gY3JlYXRlQmFzZVZtKGNvbmZpZykge1xuXHR2YXIgY29tcG9uZW50ID0gY29uZmlnLmNvbXBvbmVudDtcblx0dmFyIHN0YXRlID0ga28ub2JzZXJ2YWJsZShjb25maWcuc3RhdGUgfHwgXCJkZWZhdWx0XCIpO1xuXHR2YXIgdmFyaWF0aW9uID0gY29uZmlnLnZhcmlhdGlvbiB8fCBcImRlZmF1bHRcIjtcblxuXHR2YXIgc3R5bGUgPSBjb25maWcuc3R5bGU7XG5cdFxuXHR2YXIgY3NzQ2xhc3NDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBcImtub2ItXCIgKyBjb21wb25lbnQgKyBcIiBzdGF0ZS1cIiArIHN0YXRlKCkgKyBcIiB2YXJpYXRpb24tXCIgKyB2YXJpYXRpb247XG5cdH0pO1xuXHR2YXIgc3R5bGVDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdGF0ZVZhbCA9IHN0YXRlKCk7XG5cdFx0cmV0dXJuIHN0eWxlW3ZhcmlhdGlvbl1bc3RhdGVWYWxdO1xuXHR9KTtcblxuXHR2YXIgcHJldmlvdXNTdGF0ZTtcblx0ZnVuY3Rpb24gbW91c2VPdmVyKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChhY3RTdGF0ZSAhPT0gXCJob3ZlclwiKSB7XG5cdFx0XHRwcmV2aW91c1N0YXRlID0gYWN0U3RhdGU7XG5cdFx0fVxuXG5cdFx0c3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlT3V0KCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHN0YXRlKHByZXZpb3VzU3RhdGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VEb3duKCkge1xuXHRcdHZhciBhY3RTdGF0ZSA9IHN0YXRlKCk7XG5cblx0XHRpZiAoYWN0U3RhdGUgPT09IFwiZGlzYWJsZWRcIikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHN0YXRlKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VVcCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSBzdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzdGF0ZShcImhvdmVyXCIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR2YXJpYXRpb246IHZhcmlhdGlvbixcblx0XHRzdGF0ZTogc3RhdGUsXHRcblxuXHRcdGNzc0NsYXNzOiBjc3NDbGFzc0NvbXB1dGVkLFxuXHRcdHN0eWxlOiBzdHlsZUNvbXB1dGVkLFxuXG5cdFx0bW91c2VPdmVyOiBtb3VzZU92ZXIsXG5cdFx0bW91c2VPdXQ6IG1vdXNlT3V0LFxuXHRcdG1vdXNlRG93bjogbW91c2VEb3duLFxuXHRcdG1vdXNlVXA6IG1vdXNlVXBcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlVm07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJkZWZhdWx0XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZWVlZWVlXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiIzAwMDAwMFwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiIzAwMDAwMFwiXG5cdFx0fSxcblx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiI2ZmMDAwMFwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiMwMDAwMDBcIixcblx0XHRcdFwiZmlsbFwiOiBcIiMwMGZmMDBcIlxuXHRcdH0sXG5cdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XCJjb2xvclwiOiBcIiMxMzM3YWFcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNhYmNkZWZcIlxuXHRcdH0sXG5cdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNkZGRkZGRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjYWFhYWFhXCJcblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXG5cdFx0fVxuXHR9LFxuXHRcInByaW1hcnlcIjoge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNhYWFhYWFcIlxuXHRcdH0sXG5cdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNlZWVlZmZcIlxuXHRcdH1cblx0fVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxidXR0b24gZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcywgXFxuXHRcdFx0XHRcdHN0eWxlOiBzdHlsZSwgXFxuXHRcdFx0XHRcdGNsaWNrOiBjbGljaywgXFxuXHRcdFx0XHRcdGV2ZW50OiB7bW91c2VvdmVyOiBtb3VzZU92ZXIsIG1vdXNlb3V0OiBtb3VzZU91dCwgbW91c2Vkb3duOiBtb3VzZURvd24sIG1vdXNldXA6IG1vdXNlVXB9LCBcXG5cdFx0XHRcdFx0ZGlzYWJsZTogc3RhdGUoKSA9PT0gXFwnZGlzYWJsZWRcXCdcIj5cXG5cXG5cdDxzcGFuIGNsYXNzPVwiaWNvbi13cmFwcGVyXCIgZGF0YS1iaW5kPVwiaWY6IGxlZnRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogbGVmdEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPjwvc3ZnPlxcblx0PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtYmluZD1cInRleHQ6IGxhYmVsXCI+PC9zcGFuPlxcblxcblx0PHNwYW4gY2xhc3M9XCJpY29uLXdyYXBwZXJcIiBkYXRhLWJpbmQ9XCJpZjogcmlnaHRJY29uXCI+XFxuXHRcdDxzdmcgY2xhc3M9XCJpY29uXCI+PHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwneGxpbms6aHJlZlxcJzogcmlnaHRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT48L3N2Zz5cXG5cdDwvc3Bhbj5cXG5cXG48L2J1dHRvbj4nOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uKGNvbmZpZykge1xuXHRjb25maWcuY29tcG9uZW50ID0gXCJidXR0b25cIjtcblxuXHR2YXIgdm0gPSBiYXNlKGNvbmZpZyk7XG5cblx0dm0ubGVmdEljb24gPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGVmdEljb24gfHwgY29uZmlnLmljb24pKTtcblx0dm0ucmlnaHRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLnJpZ2h0SWNvbikpO1xuXHR2bS5sYWJlbCA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5sYWJlbCkpO1xuXHR2bS5jbGljayA9IGNvbmZpZy5jbGljayB8fCBmdW5jdGlvbigpIHt9O1xuXG5cdHJldHVybiB2bTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b247XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxuLy8qL1xuXG4vL1RISVMgRklMRSBTSE9VTEQgQkUgR0VORVJBVEVEXG5cbnZhciByZWdpc3RlckNvbXBvbmVudCA9IHJlcXVpcmUoXCIuL2tub2JSZWdpc3RlckNvbXBvbmVudFwiKTtcblxucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWJ1dHRvblwiLCByZXF1aXJlKFwiLi9idXR0b24vdm1cIiksIHJlcXVpcmUoXCIuL2J1dHRvbi90ZW1wbGF0ZS5odG1sXCIpLCByZXF1aXJlKFwiLi9idXR0b24vc3R5bGUuanNcIikpO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpLyosIHJlcXVpcmUoXCIuL2J1dHRvbi9zdHlsZS5qc29uXCIpKi8pO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2luYXRpb25cIiwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi92bVwiKSwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pdGVtcy1wZXItcGFnZVwiLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2Uvdm1cIiksIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdlZC1saXN0XCIsIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWxcIikpO1xuXG4vLyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCI+XFxuXHQ8IS0tIHdpdGggcGFyYW1zLCB0aGUgc2VsZWN0ZWQoKS5sYWJlbCB3b25cXCd0IGJlIHJlY2FsY3VsYXRlZCwgd2hlbiBzZWxlY3RlZCBpcyBjaGFuZ2VkLi4uIC0tPlxcblx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsIGljb246IHNlbGVjdGVkKCkuaWNvbiwgcmlnaHRJY29uOiByaWdodEljb24sIGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj48L2Rpdj5cXG5cdDxkaXYgY2xhc3M9XCJrbm9iLWRyb3Bkb3duLW1lbnVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBvcHRpb25zLCB2aXNpYmxlOiBkcm9wZG93blZpc2libGVcIj5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7bGFiZWw6IGxhYmVsLCBpY29uOiBpY29uLCBjbGljazogc2VsZWN0fX0sIHZpc2libGU6ICRkYXRhICE9PSAkcGFyZW50LnNlbGVjdGVkKClcIj48L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbkRyb3Bkb3duIChjb25maWcpIHtcblx0dmFyIHJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoY29uZmlnLnJpZ2h0SWNvbik7XG5cblx0dmFyIG9wdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdG9wdGlvbnMucHVzaChjcmVhdGVPcHRpb24oe1xuXHRcdFx0bGFiZWw6IGNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsLFxuXHRcdFx0aWNvbjogY29uZmlnLml0ZW1zW2lkeF0uaWNvbixcblx0XHRcdHZhbHVlOiBjb25maWcuaXRlbXNbaWR4XS52YWx1ZVxuXHRcdH0pKTtcblx0fVxuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdHNlbGVjdGVkKG9wdGlvbnMoKVswXSk7XG5cblxuXHR2YXIgZHJvcGRvd25WaXNpYmxlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGVEcm9wZG93blZpc2libGUoaXRlbSwgZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHZhciB2aXNpYmxlID0gZHJvcGRvd25WaXNpYmxlKCk7XG5cdFx0ZHJvcGRvd25WaXNpYmxlKCF2aXNpYmxlKTtcblxuXG5cdFx0aWYgKHZpc2libGUpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihjb25maWcpIHtcblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGtvLm9ic2VydmFibGUoY29uZmlnLmxhYmVsKSxcblx0XHRcdGljb246IGtvLm9ic2VydmFibGUoY29uZmlnLmljb24pLFxuXHRcdFx0dmFsdWU6IGNvbmZpZy52YWx1ZSxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRzZWxlY3RlZChvYmopO1xuXHRcdFx0XHRkcm9wZG93blZpc2libGUudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxuXG5cdFx0c2VsZWN0ZWQ6IHNlbGVjdGVkLFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cblx0XHRkcm9wZG93blZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJ1dHRvbkRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWRvd25cXCcsXFxuXHRzZWxlY3RlZDogaXRlbXNQZXJQYWdlLFxcblx0aXRlbXM6IGl0ZW1zUGVyUGFnZUxpc3RcIj5cXG48L2tub2ItZHJvcGRvd24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSXRlbXNQZXJQYWdlKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdHZhciBudW1PZkl0ZW1zID0gY29uZmlnLm51bU9mSXRlbXMgfHwga28ub2JzZXJ2YWJsZSgwKTtcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7bGFiZWw6IDEwLCB2YWx1ZTogMTB9LCB7bGFiZWw6IDI1LCB2YWx1ZTogMjV9LCB7bGFiZWw6IDUwLCB2YWx1ZTogNTB9LCB7bGFiZWw6IDEwMCwgdmFsdWU6IDEwMH1dO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZShpdGVtc1BlclBhZ2VMaXN0WzBdKTtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzIHx8IGtvLm9ic2VydmFibGUoKTtcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG51bU9mSXRlbXNWYWwgPSBudW1PZkl0ZW1zKCk7XG5cdFx0dmFyIGl0ZW1zUGVyUGFnZVZhbCA9IGl0ZW1zUGVyUGFnZSgpO1xuXG5cdFx0aWYgKCFpdGVtc1BlclBhZ2VWYWwpIHtcblx0XHRcdHJldHVybiBudW1PZlBhZ2VzKDApO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWcuaXRlbXNQZXJQYWdlKSB7XG5cdFx0XHRjb25maWcuaXRlbXNQZXJQYWdlKGl0ZW1zUGVyUGFnZVZhbC52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bU9mUGFnZXMoTWF0aC5jZWlsKG51bU9mSXRlbXNWYWwgLyBpdGVtc1BlclBhZ2VWYWwudmFsdWUpKTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRudW1PZkl0ZW1zOiBudW1PZkl0ZW1zLFxuXHRcdGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlLFxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXMsXG5cblx0XHRpdGVtc1BlclBhZ2VMaXN0OiBpdGVtc1BlclBhZ2VMaXN0XG5cdH07XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5mdW5jdGlvbiBrbm9iUmVnaXN0ZXJDb21wb25lbnQobmFtZSwgY3JlYXRlVm0sIHRlbXBsYXRlLCBzdHlsZSkge1xuXHRrby5jb21wb25lbnRzLnJlZ2lzdGVyKG5hbWUsIHtcblx0XHR2aWV3TW9kZWw6IHtcblx0XHRcdGNyZWF0ZVZpZXdNb2RlbDogZnVuY3Rpb24ocGFyYW1zLCBjb21wb25lbnRJbmZvKSB7XG5cdFx0XHRcdHBhcmFtcy5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0XHRyZXR1cm4gY3JlYXRlVm0ocGFyYW1zKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrbm9iUmVnaXN0ZXJDb21wb25lbnQ7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMaXN0KGNvbmZpZykge1xuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cblx0dmFyIGZpZWxkcyA9IGNvbmZpZy5maWVsZHM7XG5cblx0dmFyIHNlYXJjaCA9IGtvLm9ic2VydmFibGUoXCJcIikuZXh0ZW5kKHt0aHJvdHRsZTogNTAwfSk7XG5cblx0Ly9jb25maWcuc29ydGVyc1xuXHQvLyAtIGxhYmVsXG5cdC8vIC0gcHJvcFxuXG5cdHZhciBzb3J0T3B0aW9ucyA9IFtdO1xuXHRmdW5jdGlvbiBjcmVhdGVRdXJleU9iaihwcm9wLCBhc2MpIHtcblx0XHR2YXIgb2JqID0ge307XG5cdFx0b2JqW3Byb3BdID0gYXNjO1xuXHRcdHJldHVybiBvYmo7XG5cdH1cblx0aWYgKGNvbmZpZy5zb3J0KSB7XG5cdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuc29ydC5sZW5ndGg7IGlkeCArPSAxKSB7XG5cdFx0XHR2YXIgYWN0ID0gY29uZmlnLnNvcnRbaWR4XTtcblx0XHRcdHNvcnRPcHRpb25zLnB1c2goe1xuXHRcdFx0XHRpY29uOiBcIiNpY29uLWEtelwiLFxuXHRcdFx0XHRsYWJlbDogYWN0LFxuXHRcdFx0XHR2YWx1ZTogY3JlYXRlUXVyZXlPYmooYWN0LCAxKVxuXHRcdFx0fSk7XG5cdFx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWNvbjogXCIjaWNvbi16LWFcIixcblx0XHRcdFx0bGFiZWw6IGFjdCxcblx0XHRcdFx0dmFsdWU6IGNyZWF0ZVF1cmV5T2JqKGFjdCwgLTEpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHR2YXIgc29ydCA9IGtvLm9ic2VydmFibGUoc29ydE9wdGlvbnNbMF0pO1xuXG5cdHZhciBza2lwID0ga28ub2JzZXJ2YWJsZSgwKTtcblx0dmFyIGxpbWl0ID0ga28ub2JzZXJ2YWJsZSgwKTtcblxuXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXG5cdFx0aXRlbXMucHVzaChpdGVtKTtcblx0fSk7XG5cblx0dmFyIGNvdW50ID0ga28ub2JzZXJ2YWJsZSgwKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5XG5cblx0dmFyIGxvYWRpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5XG5cdHZhciBlcnJvciA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHk/XG5cblxuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWFyY2hWYWwgPSBzZWFyY2goKTtcblx0XHR2YXIgc29ydFZhbCA9IHNvcnQoKS52YWx1ZTtcblx0XHR2YXIgc2tpcFZhbCA9IHNraXAoKTtcblx0XHR2YXIgbGltaXRWYWwgPSBsaW1pdCgpO1xuXG5cdFx0dmFyIGZpbmQgPSB7fTtcblxuXHRcdGZpbmRbY29uZmlnLnNlYXJjaF0gPSBzZWFyY2hWYWw7XG5cblx0XHRzdG9yZS5maW5kID0gZmluZDtcblx0XHRzdG9yZS5zb3J0ID0gc29ydFZhbDtcblx0XHRzdG9yZS5za2lwID0gc2tpcFZhbDtcblx0XHRzdG9yZS5saW1pdCA9IGxpbWl0VmFsO1xuXHR9KS5leHRlbmQoe3Rocm90dGxlOiAwfSk7XG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRpZiAobG9hZGluZygpKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkxpc3QgaXMgYWxyZWFkeSBsb2FkaW5nLi4uXCIpOyAvL3RoaXMgbWlnaHQgYmUgcHJvYmxlbWF0aWMgaWYgdGhlcmUgYXJlIG5vIGdvb2QgdGltZW91dCBzZXR0aW5ncy5cblx0XHR9XG5cblx0XHRsb2FkaW5nKHRydWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWZ0ZXJMb2FkKGVycikge1xuXHRcdGxvYWRpbmcoZmFsc2UpO1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcihlcnIpO1xuXHRcdH1cblx0XHRlcnJvcihudWxsKTtcblxuXHRcdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXG5cdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0Y291bnQoc3RvcmUuY291bnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVhZE9ubHlDb21wdXRlZChvYnNlcnZhYmxlKSB7XG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JzZXJ2YWJsZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhyb3cgXCJUaGlzIGNvbXB1dGVkIHZhcmlhYmxlIHNob3VsZCBub3QgYmUgd3JpdHRlbi5cIjtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXG5cdFx0c2VhcmNoOiBzZWFyY2gsXG5cblx0XHRzb3J0OiBzb3J0LFxuXHRcdHNvcnRPcHRpb25zOiBzb3J0T3B0aW9ucyxcblxuXHRcdHNraXA6IHNraXAsXG5cdFx0bGltaXQ6IGxpbWl0LFxuXG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdGNvdW50OiByZWFkT25seUNvbXB1dGVkKGNvdW50KSxcblxuXHRcdGxvYWRpbmc6IHJlYWRPbmx5Q29tcHV0ZWQobG9hZGluZyksXG5cdFx0ZXJyb3I6IHJlYWRPbmx5Q29tcHV0ZWQoZXJyb3IpXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdj5cXG5cdDwhLS0ga28gaWY6IGVycm9yIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInRleHQ6IGVycm9yXCI+PC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cdDxkaXY+XFxuXHRcdDxkaXY+XFxuXHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHNlYXJjaCwgdmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiLz48a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IFxcJ1xcJywgdmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLCBpY29uOiBcXCcjaWNvbi1zZWFyY2hcXCdcIj48L2tub2ItYnV0dG9uPlxcblx0XHRcdDwhLS0ga28gaWY6IHNvcnRPcHRpb25zLmxlbmd0aCA+IDAgLS0+XFxuXHRcdFx0XHQ8a25vYi1kcm9wZG93biBwYXJhbXM9XCJyaWdodEljb246IFxcJyNpY29uLWRvd25cXCcsIHNlbGVjdGVkOiBzb3J0LCBpdGVtczogc29ydE9wdGlvbnNcIj48L2tub2ItZHJvcGRvd24+XFxuXHRcdFx0PCEtLSAva28gLS0+XFxuXHRcdFx0PGtub2ItaXRlbXMtcGVyLXBhZ2UgcGFyYW1zPVwibnVtT2ZJdGVtczogY291bnQsIG51bU9mUGFnZXM6IG51bU9mUGFnZXMsIGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+PC9rbm9iLWl0ZW1zLXBlci1wYWdlPlxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBpdGVtc1wiPlxcblx0XHRcdDwhLS0ga28gdGVtcGxhdGU6IHsgbm9kZXM6ICRjb21wb25lbnRUZW1wbGF0ZU5vZGVzLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2Plxcblxcblx0PCEtLVxcblx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZkl0ZW1zOiBwYWdpbmF0aW9uLm51bU9mSXRlbXMsIGl0ZW1zUGVyUGFnZTogaXRlbXNQZXJQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQtLT5cXG5cXG5cXG5cdDwhLS0ga28gaWY6IG51bU9mUGFnZXMoKSA+IDAgLS0+XFxuXHRcdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgY3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlXCI+PC9rbm9iLXBhZ2luYXRpb24+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cXG5cdDwhLS0ga28gaWY6ICRkYXRhLmxvYWRNb3JlIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICFsb2FkaW5nKCksIGNsaWNrOiBsb2FkTW9yZVwiPkxvYWQgbW9yZS4uLjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGFmdGVyTG9hZCk7XG5cblx0dmFyIGxpc3QgPSBjcmVhdGVMaXN0KGNvbmZpZyk7XG5cdC8vdmFyIHBhZ2luYXRpb24gPSBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZy5wYWdpbmF0aW9uKTtcblx0Ly9saXN0LnBhZ2luYXRpb24gPSBwYWdpbmF0aW9uO1xuXG5cdHZhciBudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZSgpO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZSgxMCk7XG5cdHZhciBjdXJyZW50UGFnZSA9IGtvLm9ic2VydmFibGUoMCk7XG5cblx0bGlzdC5udW1PZlBhZ2VzID0gbnVtT2ZQYWdlcztcblx0bGlzdC5pdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2U7XG5cdGxpc3QuY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZTtcblxuXG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cdFx0dmFyIGl0ZW1zUGVyUGFnZVZhbCA9IGl0ZW1zUGVyUGFnZSgpO1xuXHRcdGxpc3Quc2tpcChjdXJyZW50UGFnZVZhbCAqIGl0ZW1zUGVyUGFnZVZhbCk7XG5cdFx0bGlzdC5saW1pdChpdGVtc1BlclBhZ2VWYWwpO1xuXHR9KTtcblxuXHQvKlxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY291bnQgPSBsaXN0LmNvdW50KCk7XG5cdFx0bGlzdC5wYWdpbmF0aW9uLm51bU9mSXRlbXMoY291bnQpO1xuXHR9KTtcblx0Ki9cblxuXHRcblx0ZnVuY3Rpb24gYWZ0ZXJMb2FkKCkge1xuXHRcdGxpc3QuaXRlbXMoW10pO1xuXHR9XG5cblx0cmV0dXJuIGxpc3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBkYXRhLWJpbmQ9XCJpZjogcGFnZVNlbGVjdG9ycygpLmxlbmd0aFwiPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLWZpcnN0XFwnLCBzdGF0ZTogZmlyc3QoKS5zdGF0ZSwgY2xpY2s6IGZpcnN0KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLXByZXZcXCcsIHN0YXRlOiBwcmV2KCkuc3RhdGUsIGNsaWNrOiBwcmV2KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiZm9yZWFjaDogcGFnZVNlbGVjdG9yc1wiPlxcblx0XHQ8a25vYi1idXR0b24gcGFyYW1zPVwibGFiZWw6IGxhYmVsLCBzdGF0ZTogc3RhdGUsIGNsaWNrOiBzZWxlY3RQYWdlXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdDwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1uZXh0XFwnLCBzdGF0ZTogbmV4dCgpLnN0YXRlLCBjbGljazogbmV4dCgpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1sYXN0XFwnLCBzdGF0ZTogbGFzdCgpLnN0YXRlLCBjbGljazogbGFzdCgpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG48L2Rpdj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdFxuXHR2YXIgbnVtT2ZQYWdlcztcblx0aWYgKGtvLmlzT2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcykpIHtcblx0XHRudW1PZlBhZ2VzID0gY29uZmlnLm51bU9mUGFnZXM7XG5cdH0gZWxzZSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMgfHwgMTApO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlIDwgMCkge1xuXHRcdFx0dmFsdWUgPSAwO1xuXHRcdH1cblxuXHRcdHZhciBwYWdlc051bSA9IG51bU9mUGFnZXMoKTtcblx0XHRpZiAodmFsdWUgPj0gcGFnZXNOdW0pIHtcblx0XHRcdHZhbHVlID0gcGFnZXNOdW0gLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdHZhciBjdXJyZW50UGFnZSA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2UgPSBjb25maWcuY3VycmVudFBhZ2UgfHwga28ub2JzZXJ2YWJsZSgwKTtcblxuXHRcdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0bnVtT2ZQYWdlcygpO1xuXHRcdFx0Y3VycmVudFBhZ2UoMCk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoe1xuXHRcdFx0cmVhZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50UGFnZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRjdXJyZW50UGFnZShub3JtYWxpemUodmFsdWUpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSgpKTtcblxuXG5cdFxuXG5cdHZhciBjdXJyZW50UGFnZVJlYWxJZHg7XG5cdHZhciBwYWdlU2VsZWN0b3JzID0gKGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciBhZnRlckhlYWQgPSBjb25maWcuYWZ0ZXJIZWFkIHx8IDI7XG5cdFx0dmFyIGJlZm9yZVRhaWwgPSBjb25maWcuYmVmb3JlVGFpbCB8fCAyO1xuXHRcdHZhciBiZWZvcmVDdXJyZW50ID0gY29uZmlnLmJlZm9yZUN1cnJlbnQgfHwgMjtcblx0XHR2YXIgYWZ0ZXJDdXJyZW50ID0gY29uZmlnLmFmdGVyQ3VycmVudCB8fCAyO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCwgaXNDdXJyZW50UGFnZSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGlkeCArIDEsXG5cdFx0XHRcdHN0YXRlOiBcImRlZmF1bHRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3VycmVudFBhZ2UoaWR4KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihsYWJlbCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGxhYmVsLFxuXHRcdFx0XHRzdGF0ZTogXCJkaXNhYmxlZFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHt9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBlbGVtZW50cyA9IFtdO1xuXG5cdFx0XHR2YXIgbnVtT2ZQYWdlc1ZhbCA9IG51bU9mUGFnZXMoKTtcblx0XHRcdHZhciBjdXJyZW50UGFnZVZhbCA9IGN1cnJlbnRQYWdlKCk7XG5cblx0XHRcdHZhciBub25DbGlja2FibGVJbnNlcnRlZCA9IGZhbHNlO1xuXHRcdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbnVtT2ZQYWdlc1ZhbDsgaWR4ICs9IDEpIHtcblx0XHRcdFx0aWYgKGlkeCA8PSBhZnRlckhlYWQgfHwgaWR4ID49IG51bU9mUGFnZXNWYWwgLSBiZWZvcmVUYWlsIC0xIHx8IChpZHggPj0gY3VycmVudFBhZ2VWYWwgLSBiZWZvcmVDdXJyZW50ICYmIGlkeCA8PSBjdXJyZW50UGFnZVZhbCArIGFmdGVyQ3VycmVudCkpIHtcblx0XHRcdFx0XHR2YXIgcGFnZVNlbGVjdG9yO1xuXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gY3VycmVudFBhZ2VWYWwpIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGlkeCArIDEpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFBhZ2VSZWFsSWR4ID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKHBhZ2VTZWxlY3Rvcik7XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW5vbkNsaWNrYWJsZUluc2VydGVkKSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKFwiLi4uXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtZW50cztcblx0XHR9KTtcblx0fShjb25maWcpKTtcblxuXG5cdHZhciBuZXh0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCArIDE7XG5cblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRpZiAoaWR4ID49IHBhZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VzW2lkeF07XG5cdH0pO1xuXG5cdHZhciBwcmV2ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCAtIDE7XG5cblx0XHRpZiAoaWR4IDwgMCkge1xuXHRcdFx0aWR4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpW2lkeF07XG5cdH0pO1xuXG5cdHZhciBmaXJzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbMF07XG5cdH0pO1xuXG5cdHZhciBsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXHRcdHJldHVybiBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcblx0fSk7XG5cblxuXHRyZXR1cm4ge1xuXHRcdHBhZ2VTZWxlY3RvcnM6IHBhZ2VTZWxlY3RvcnMsXG5cblx0XHRmaXJzdDogZmlyc3QsXG5cdFx0bGFzdDogbGFzdCxcblxuXHRcdG5leHQ6IG5leHQsXG5cdFx0cHJldjogcHJldixcblxuXHRcdGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZSxcblxuXHRcdG51bU9mUGFnZXM6IG51bU9mUGFnZXNcblx0fTtcbn07XG4iXX0=
