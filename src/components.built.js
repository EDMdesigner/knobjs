(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			"backgroundColor": "#eeeeee",
			"color": "#000000",
			"fill": "#000000"
		},
		"hover": {
			"backgroundColor": "#ff0000",
			"color": "#000000",
			"fill": "#00ff00"
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

		},
		"error": {

		}
	},
	"primary": {
		"default": {
			"backgroundColor": "#aaaaaa"
		},
		"disabled": {
			"backgroundColor": "#eeeeff"
		}
	}
};

},{}],3:[function(require,module,exports){
module.exports = '<button data-bind="css: cssClass, \n					style: style, \n					click: click, \n					event: {mouseover: mouseOver, mouseout: mouseOut, mousedown: mouseDown, mouseup: mouseUp}, \n					disable: state() === \'disabled\'">\n\n	<span class="icon-wrapper" data-bind="if: leftIcon">\n		<svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': leftIcon}" xlink:href=""></use></svg>\n	</span>\n\n	<span class="label" data-bind="text: label"></span>\n\n	<span class="icon-wrapper" data-bind="if: rightIcon">\n		<svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" data-bind="attr: {\'xlink:href\': rightIcon}" xlink:href=""></use></svg>\n	</span>\n\n</button>';
},{}],4:[function(require,module,exports){
/*jslint node: true */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS92bS5qcyIsInNyYy9idXR0b24vc3R5bGUuanMiLCJzcmMvYnV0dG9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvYnV0dG9uL3ZtLmpzIiwic3JjL2NvbXBvbmVudHMuanMiLCJzcmMvZHJvcGRvd24vdGVtcGxhdGUuaHRtbCIsInNyYy9kcm9wZG93bi92bS5qcyIsInNyYy9pdGVtc1BlclBhZ2UvdGVtcGxhdGUuaHRtbCIsInNyYy9pdGVtc1BlclBhZ2Uvdm0uanMiLCJzcmMva25vYlJlZ2lzdGVyQ29tcG9uZW50LmpzIiwic3JjL2xpc3Qvdm0uanMiLCJzcmMvcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnZWRMaXN0L3ZtLmpzIiwic3JjL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbCIsInNyYy9wYWdpbmF0aW9uL3ZtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VWbShjb25maWcpIHtcblx0dmFyIGNvbXBvbmVudCA9IGNvbmZpZy5jb21wb25lbnQ7XG5cdHZhciBzdGF0ZSA9IGtvLm9ic2VydmFibGUoY29uZmlnLnN0YXRlIHx8IFwiZGVmYXVsdFwiKTtcblx0dmFyIHZhcmlhdGlvbiA9IGNvbmZpZy52YXJpYXRpb24gfHwgXCJkZWZhdWx0XCI7XG5cblx0dmFyIHN0eWxlID0gY29uZmlnLnN0eWxlO1xuXHRcblx0dmFyIGNzc0NsYXNzQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gXCJrbm9iLVwiICsgY29tcG9uZW50ICsgXCIgc3RhdGUtXCIgKyBzdGF0ZSgpICsgXCIgdmFyaWF0aW9uLVwiICsgdmFyaWF0aW9uO1xuXHR9KTtcblx0dmFyIHN0eWxlQ29tcHV0ZWQgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3RhdGVWYWwgPSBzdGF0ZSgpO1xuXHRcdHJldHVybiBzdHlsZVt2YXJpYXRpb25dW3N0YXRlVmFsXTtcblx0fSk7XG5cblx0dmFyIHByZXZpb3VzU3RhdGU7XG5cdGZ1bmN0aW9uIG1vdXNlT3ZlcigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSBzdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYWN0U3RhdGUgIT09IFwiaG92ZXJcIikge1xuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xuXHRcdH1cblxuXHRcdHN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSBzdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzdGF0ZShwcmV2aW91c1N0YXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSBzdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0c3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dmFyaWF0aW9uOiB2YXJpYXRpb24sXG5cdFx0c3RhdGU6IHN0YXRlLFx0XG5cblx0XHRjc3NDbGFzczogY3NzQ2xhc3NDb21wdXRlZCxcblx0XHRzdHlsZTogc3R5bGVDb21wdXRlZCxcblxuXHRcdG1vdXNlT3ZlcjogbW91c2VPdmVyLFxuXHRcdG1vdXNlT3V0OiBtb3VzZU91dCxcblx0XHRtb3VzZURvd246IG1vdXNlRG93bixcblx0XHRtb3VzZVVwOiBtb3VzZVVwXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZVZtO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiZGVmYXVsdFwiOiB7XG5cdFx0XCJkZWZhdWx0XCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiI2VlZWVlZVwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiMwMDAwMDBcIixcblx0XHRcdFwiZmlsbFwiOiBcIiMwMDAwMDBcIlxuXHRcdH0sXG5cdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNmZjAwMDBcIixcblx0XHRcdFwiY29sb3JcIjogXCIjMDAwMDAwXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjMDBmZjAwXCJcblx0XHR9LFxuXHRcdFwiYWN0aXZlXCI6IHtcblx0XHRcdFwiY29sb3JcIjogXCIjMTMzN2FhXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjYWJjZGVmXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZGRkZGRkXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2FhYWFhYVwiXG5cdFx0fSxcblx0XHRcInN1Y2Nlc3NcIjoge1xuXG5cdFx0fSxcblx0XHRcImVycm9yXCI6IHtcblxuXHRcdH1cblx0fSxcblx0XCJwcmltYXJ5XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjYWFhYWFhXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZWVlZWZmXCJcblx0XHR9XG5cdH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8YnV0dG9uIGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsIFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsIFxcblx0XHRcdFx0XHRjbGljazogY2xpY2ssIFxcblx0XHRcdFx0XHRldmVudDoge21vdXNlb3ZlcjogbW91c2VPdmVyLCBtb3VzZW91dDogbW91c2VPdXQsIG1vdXNlZG93bjogbW91c2VEb3duLCBtb3VzZXVwOiBtb3VzZVVwfSwgXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPjx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT48L3N2Zz5cXG5cdDwvc3Bhbj5cXG5cXG5cdDxzcGFuIGNsYXNzPVwibGFiZWxcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiBsYWJlbFwiPjwvc3Bhbj5cXG5cXG5cdDxzcGFuIGNsYXNzPVwiaWNvbi13cmFwcGVyXCIgZGF0YS1iaW5kPVwiaWY6IHJpZ2h0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPjx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IHJpZ2h0SWNvbn1cIiB4bGluazpocmVmPVwiXCI+PC91c2U+PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuPC9idXR0b24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihjb25maWcpIHtcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiYnV0dG9uXCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXG5cdHZtLmxlZnRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxlZnRJY29uIHx8IGNvbmZpZy5pY29uKSk7XG5cdHZtLnJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5yaWdodEljb24pKTtcblx0dm0ubGFiZWwgPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGFiZWwpKTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG5cbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlLmpzXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1kcm9wZG93blwiLCByZXF1aXJlKFwiLi9kcm9wZG93bi92bVwiKSwgcmVxdWlyZShcIi4vZHJvcGRvd24vdGVtcGxhdGUuaHRtbFwiKS8qLCByZXF1aXJlKFwiLi9idXR0b24vc3R5bGUuanNvblwiKSovKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdpbmF0aW9uXCIsIHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2luYXRpb24vdGVtcGxhdGUuaHRtbFwiKSk7XG5yZWdpc3RlckNvbXBvbmVudChcImtub2ItaXRlbXMtcGVyLXBhZ2VcIiwgcmVxdWlyZShcIi4vaXRlbXNQZXJQYWdlL3ZtXCIpLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2UvdGVtcGxhdGUuaHRtbFwiKSk7XG5yZWdpc3RlckNvbXBvbmVudChcImtub2ItcGFnZWQtbGlzdFwiLCByZXF1aXJlKFwiLi9wYWdlZExpc3Qvdm1cIiksIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sXCIpKTtcblxuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2xhYmVsOiBzZWxlY3RlZCgpLmxhYmVsLCBpY29uOiBzZWxlY3RlZCgpLmljb24sIHJpZ2h0SWNvbjogcmlnaHRJY29uLCBjbGljazogZHJvcGRvd25WaXNpYmxlLnRvZ2dsZX19XCI+PC9kaXY+XFxuXHQ8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93bi1tZW51XCIgZGF0YS1iaW5kPVwiZm9yZWFjaDogb3B0aW9ucywgdmlzaWJsZTogZHJvcGRvd25WaXNpYmxlXCI+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2xhYmVsOiBsYWJlbCwgaWNvbjogaWNvbiwgY2xpY2s6IHNlbGVjdH19LCB2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Ecm9wZG93biAoY29uZmlnKSB7XG5cdHZhciByaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5yaWdodEljb24pO1xuXG5cdHZhciBvcHRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLml0ZW1zLmxlbmd0aDsgaWR4ICs9IDEpIHtcblx0XHRvcHRpb25zLnB1c2goY3JlYXRlT3B0aW9uKHtcblx0XHRcdGxhYmVsOiBjb25maWcuaXRlbXNbaWR4XS5sYWJlbCxcblx0XHRcdGljb246IGNvbmZpZy5pdGVtc1tpZHhdLmljb24sXG5cdFx0XHR2YWx1ZTogY29uZmlnLml0ZW1zW2lkeF0udmFsdWVcblx0XHR9KSk7XG5cdH1cblxuXHR2YXIgc2VsZWN0ZWQgPSBjb25maWcuc2VsZWN0ZWQgfHwga28ub2JzZXJ2YWJsZSgpO1xuXHRzZWxlY3RlZChvcHRpb25zKClbMF0pO1xuXG5cblx0dmFyIGRyb3Bkb3duVmlzaWJsZSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXHRkcm9wZG93blZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlRHJvcGRvd25WaXNpYmxlKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR2YXIgdmlzaWJsZSA9IGRyb3Bkb3duVmlzaWJsZSgpO1xuXHRcdGRyb3Bkb3duVmlzaWJsZSghdmlzaWJsZSk7XG5cblxuXHRcdGlmICh2aXNpYmxlKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZURyb3Bkb3duVmlzaWJsZSwgZmFsc2UpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBjcmVhdGVPcHRpb24oY29uZmlnKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGxhYmVsOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5sYWJlbCksXG5cdFx0XHRpY29uOiBrby5vYnNlcnZhYmxlKGNvbmZpZy5pY29uKSxcblx0XHRcdHZhbHVlOiBjb25maWcudmFsdWUsXG5cdFx0XHRzZWxlY3Q6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0c2VsZWN0ZWQob2JqKTtcblx0XHRcdFx0ZHJvcGRvd25WaXNpYmxlLnRvZ2dsZSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRyaWdodEljb246IHJpZ2h0SWNvbixcblxuXHRcdHNlbGVjdGVkOiBzZWxlY3RlZCxcblx0XHRvcHRpb25zOiBvcHRpb25zLFxuXG5cdFx0ZHJvcGRvd25WaXNpYmxlOiBkcm9wZG93blZpc2libGVcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCdXR0b25Ecm9wZG93bjtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxrbm9iLWRyb3Bkb3duIHBhcmFtcz1cIlxcblx0cmlnaHRJY29uOiBcXCcjaWNvbi1kb3duXFwnLFxcblx0c2VsZWN0ZWQ6IGl0ZW1zUGVyUGFnZSxcXG5cdGl0ZW1zOiBpdGVtc1BlclBhZ2VMaXN0XCI+XFxuPC9rbm9iLWRyb3Bkb3duPic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1zUGVyUGFnZShjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHR2YXIgbnVtT2ZJdGVtcyA9IGNvbmZpZy5udW1PZkl0ZW1zIHx8IGtvLm9ic2VydmFibGUoMCk7XG5cblx0dmFyIGl0ZW1zUGVyUGFnZUxpc3QgPSBjb25maWcuaXRlbXNQZXJQYWdlTGlzdCB8fCBbe2xhYmVsOiAxMCwgdmFsdWU6IDEwfSwge2xhYmVsOiAyNSwgdmFsdWU6IDI1fSwge2xhYmVsOiA1MCwgdmFsdWU6IDUwfSwge2xhYmVsOiAxMDAsIHZhbHVlOiAxMDB9XTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoaXRlbXNQZXJQYWdlTGlzdFswXSk7XG5cblx0dmFyIG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcyB8fCBrby5vYnNlcnZhYmxlKCk7XG5cdGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBudW1PZkl0ZW1zVmFsID0gbnVtT2ZJdGVtcygpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblxuXHRcdGlmICghaXRlbXNQZXJQYWdlVmFsKSB7XG5cdFx0XHRyZXR1cm4gbnVtT2ZQYWdlcygwKTtcblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLml0ZW1zUGVyUGFnZSkge1xuXHRcdFx0Y29uZmlnLml0ZW1zUGVyUGFnZShpdGVtc1BlclBhZ2VWYWwudmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudW1PZlBhZ2VzKE1hdGguY2VpbChudW1PZkl0ZW1zVmFsIC8gaXRlbXNQZXJQYWdlVmFsLnZhbHVlKSk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0bnVtT2ZJdGVtczogbnVtT2ZJdGVtcyxcblx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLFxuXG5cdFx0aXRlbXNQZXJQYWdlTGlzdDogaXRlbXNQZXJQYWdlTGlzdFxuXHR9O1xufTtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuZnVuY3Rpb24ga25vYlJlZ2lzdGVyQ29tcG9uZW50KG5hbWUsIGNyZWF0ZVZtLCB0ZW1wbGF0ZSwgc3R5bGUpIHtcblx0a28uY29tcG9uZW50cy5yZWdpc3RlcihuYW1lLCB7XG5cdFx0dmlld01vZGVsOiB7XG5cdFx0XHRjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcywgY29tcG9uZW50SW5mbykge1xuXHRcdFx0XHRwYXJhbXMuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZVZtKHBhcmFtcyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga25vYlJlZ2lzdGVyQ29tcG9uZW50OyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGlzdChjb25maWcpIHtcblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXG5cdHZhciBmaWVsZHMgPSBjb25maWcuZmllbGRzO1xuXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7dGhyb3R0bGU6IDUwMH0pO1xuXG5cdC8vY29uZmlnLnNvcnRlcnNcblx0Ly8gLSBsYWJlbFxuXHQvLyAtIHByb3BcblxuXHR2YXIgc29ydE9wdGlvbnMgPSBbXTtcblx0ZnVuY3Rpb24gY3JlYXRlUXVyZXlPYmoocHJvcCwgYXNjKSB7XG5cdFx0dmFyIG9iaiA9IHt9O1xuXHRcdG9ialtwcm9wXSA9IGFzYztcblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cdGlmIChjb25maWcuc29ydCkge1xuXHRcdGZvcih2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLnNvcnQubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdFx0dmFyIGFjdCA9IGNvbmZpZy5zb3J0W2lkeF07XG5cdFx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWNvbjogXCIjaWNvbi1hLXpcIixcblx0XHRcdFx0bGFiZWw6IGFjdCxcblx0XHRcdFx0dmFsdWU6IGNyZWF0ZVF1cmV5T2JqKGFjdCwgMSlcblx0XHRcdH0pO1xuXHRcdFx0c29ydE9wdGlvbnMucHVzaCh7XG5cdFx0XHRcdGljb246IFwiI2ljb24tei1hXCIsXG5cdFx0XHRcdGxhYmVsOiBhY3QsXG5cdFx0XHRcdHZhbHVlOiBjcmVhdGVRdXJleU9iaihhY3QsIC0xKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIHNvcnQgPSBrby5vYnNlcnZhYmxlKHNvcnRPcHRpb25zWzBdKTtcblxuXHR2YXIgc2tpcCA9IGtvLm9ic2VydmFibGUoMCk7XG5cdHZhciBsaW1pdCA9IGtvLm9ic2VydmFibGUoMCk7XG5cblxuXHR2YXIgaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuXHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdH0pO1xuXG5cdHZhciBjb3VudCA9IGtvLm9ic2VydmFibGUoMCk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXG5cdHZhciBsb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seVxuXHR2YXIgZXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTsgLy9zaG91bGQgYmUgcmVhZC1vbmx5P1xuXG5cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VhcmNoVmFsID0gc2VhcmNoKCk7XG5cdFx0dmFyIHNvcnRWYWwgPSBzb3J0KCkudmFsdWU7XG5cdFx0dmFyIHNraXBWYWwgPSBza2lwKCk7XG5cdFx0dmFyIGxpbWl0VmFsID0gbGltaXQoKTtcblxuXHRcdHZhciBmaW5kID0ge307XG5cblx0XHRmaW5kW2NvbmZpZy5zZWFyY2hdID0gc2VhcmNoVmFsO1xuXG5cdFx0c3RvcmUuZmluZCA9IGZpbmQ7XG5cdFx0c3RvcmUuc29ydCA9IHNvcnRWYWw7XG5cdFx0c3RvcmUuc2tpcCA9IHNraXBWYWw7XG5cdFx0c3RvcmUubGltaXQgPSBsaW1pdFZhbDtcblx0fSkuZXh0ZW5kKHt0aHJvdHRsZTogMH0pO1xuXG5cdGZ1bmN0aW9uIGJlZm9yZUxvYWQoKSB7XG5cdFx0aWYgKGxvYWRpbmcoKSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJMaXN0IGlzIGFscmVhZHkgbG9hZGluZy4uLlwiKTsgLy90aGlzIG1pZ2h0IGJlIHByb2JsZW1hdGljIGlmIHRoZXJlIGFyZSBubyBnb29kIHRpbWVvdXQgc2V0dGluZ3MuXG5cdFx0fVxuXG5cdFx0bG9hZGluZyh0cnVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFmdGVyTG9hZChlcnIpIHtcblx0XHRsb2FkaW5nKGZhbHNlKTtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoZXJyKTtcblx0XHR9XG5cdFx0ZXJyb3IobnVsbCk7XG5cblx0XHRzdG9yZS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgLy9zdG9yZSA9PT0gdGhpc1xuXHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdGNvdW50KHN0b3JlLmNvdW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRPbmx5Q29tcHV0ZWQob2JzZXJ2YWJsZSkge1xuXHRcdHJldHVybiBrby5jb21wdXRlZCh7XG5cdFx0XHRyZWFkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG9ic2VydmFibGUoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRocm93IFwiVGhpcyBjb21wdXRlZCB2YXJpYWJsZSBzaG91bGQgbm90IGJlIHdyaXR0ZW4uXCI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChiZWZvcmVMb2FkKTtcblx0c3RvcmUubG9hZC5hZnRlci5hZGQoYWZ0ZXJMb2FkKTtcblxuXHRyZXR1cm4ge1xuXHRcdGZpZWxkczogZmllbGRzLCAvL3Nob3VsZCBmaWx0ZXIgdG8gdGhlIGZpZWxkcy4gKHNlbGVjdClcblxuXHRcdHNlYXJjaDogc2VhcmNoLFxuXG5cdFx0c29ydDogc29ydCxcblx0XHRzb3J0T3B0aW9uczogc29ydE9wdGlvbnMsXG5cblx0XHRza2lwOiBza2lwLFxuXHRcdGxpbWl0OiBsaW1pdCxcblxuXHRcdGl0ZW1zOiBpdGVtcyxcblx0XHRjb3VudDogcmVhZE9ubHlDb21wdXRlZChjb3VudCksXG5cblx0XHRsb2FkaW5nOiByZWFkT25seUNvbXB1dGVkKGxvYWRpbmcpLFxuXHRcdGVycm9yOiByZWFkT25seUNvbXB1dGVkKGVycm9yKVxuXHR9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXY+XFxuXHQ8IS0tIGtvIGlmOiBlcnJvciAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OiBlcnJvclwiPjwvZGl2Plxcblx0PCEtLSAva28gLS0+XFxuXHQ8ZGl2Plxcblx0XHQ8ZGl2Plxcblx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBzZWFyY2gsIHZhbHVlVXBkYXRlOiBcXCdhZnRlcmtleWRvd25cXCdcIi8+PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBcXCdcXCcsIHZhcmlhdGlvbjogXFwnZGVmYXVsdFxcJywgaWNvbjogXFwnI2ljb24tc2VhcmNoXFwnXCI+PC9rbm9iLWJ1dHRvbj5cXG5cdFx0XHQ8IS0tIGtvIGlmOiBzb3J0T3B0aW9ucy5sZW5ndGggPiAwIC0tPlxcblx0XHRcdFx0PGtub2ItZHJvcGRvd24gcGFyYW1zPVwicmlnaHRJY29uOiBcXCcjaWNvbi1kb3duXFwnLCBzZWxlY3RlZDogc29ydCwgaXRlbXM6IHNvcnRPcHRpb25zXCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0XHRcdDwhLS0gL2tvIC0tPlxcblx0XHRcdDxrbm9iLWl0ZW1zLXBlci1wYWdlIHBhcmFtcz1cIm51bU9mSXRlbXM6IGNvdW50LCBudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLCBpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPjwva25vYi1pdGVtcy1wZXItcGFnZT5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwiZm9yZWFjaDogaXRlbXNcIj5cXG5cdFx0XHQ8IS0tIGtvIHRlbXBsYXRlOiB7IG5vZGVzOiAkY29tcG9uZW50VGVtcGxhdGVOb2RlcywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogbG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj5cXG5cXG5cdDwhLS1cXG5cdDxrbm9iLXBhZ2luYXRpb24gcGFyYW1zPVwibnVtT2ZJdGVtczogcGFnaW5hdGlvbi5udW1PZkl0ZW1zLCBpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0LS0+XFxuXFxuXFxuXHQ8IS0tIGtvIGlmOiBudW1PZlBhZ2VzKCkgPiAwIC0tPlxcblx0XHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mUGFnZXM6IG51bU9mUGFnZXMsIGN1cnJlbnRQYWdlOiBjdXJyZW50UGFnZVwiPjwva25vYi1wYWdpbmF0aW9uPlxcblx0PCEtLSAva28gLS0+XFxuXFxuXHQ8IS0tIGtvIGlmOiAkZGF0YS5sb2FkTW9yZSAtLT5cXG5cdFx0PGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhbG9hZGluZygpLCBjbGljazogbG9hZE1vcmVcIj5Mb2FkIG1vcmUuLi48L2Rpdj5cXG5cdDwhLS0gL2tvIC0tPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xudmFyIGNyZWF0ZUxpc3QgPSByZXF1aXJlKFwiLi4vbGlzdC92bVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVQYWdlZExpc3QoY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgc3RvcmUgPSBjb25maWcuc3RvcmU7XG5cdHN0b3JlLmxvYWQuYmVmb3JlLmFkZChhZnRlckxvYWQpO1xuXG5cdHZhciBsaXN0ID0gY3JlYXRlTGlzdChjb25maWcpO1xuXHQvL3ZhciBwYWdpbmF0aW9uID0gY3JlYXRlUGFnaW5hdGlvbihjb25maWcucGFnaW5hdGlvbik7XG5cdC8vbGlzdC5wYWdpbmF0aW9uID0gcGFnaW5hdGlvbjtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGtvLm9ic2VydmFibGUoKTtcblx0dmFyIGl0ZW1zUGVyUGFnZSA9IGtvLm9ic2VydmFibGUoMTApO1xuXHR2YXIgY3VycmVudFBhZ2UgPSBrby5vYnNlcnZhYmxlKDApO1xuXG5cdGxpc3QubnVtT2ZQYWdlcyA9IG51bU9mUGFnZXM7XG5cdGxpc3QuaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlO1xuXHRsaXN0LmN1cnJlbnRQYWdlID0gY3VycmVudFBhZ2U7XG5cblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXHRcdHZhciBpdGVtc1BlclBhZ2VWYWwgPSBpdGVtc1BlclBhZ2UoKTtcblx0XHRsaXN0LnNraXAoY3VycmVudFBhZ2VWYWwgKiBpdGVtc1BlclBhZ2VWYWwpO1xuXHRcdGxpc3QubGltaXQoaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0Lypcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvdW50ID0gbGlzdC5jb3VudCgpO1xuXHRcdGxpc3QucGFnaW5hdGlvbi5udW1PZkl0ZW1zKGNvdW50KTtcblx0fSk7XG5cdCovXG5cblx0XG5cdGZ1bmN0aW9uIGFmdGVyTG9hZCgpIHtcblx0XHRsaXN0Lml0ZW1zKFtdKTtcblx0fVxuXG5cdHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgZGF0YS1iaW5kPVwiaWY6IHBhZ2VTZWxlY3RvcnMoKS5sZW5ndGhcIj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1maXJzdFxcJywgc3RhdGU6IGZpcnN0KCkuc3RhdGUsIGNsaWNrOiBmaXJzdCgpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImNvbXBvbmVudDoge25hbWU6IFxcJ2tub2ItYnV0dG9uXFwnLCBwYXJhbXM6IHtpY29uOiBcXCcjaWNvbi1wcmV2XFwnLCBzdGF0ZTogcHJldigpLnN0YXRlLCBjbGljazogcHJldigpLnNlbGVjdFBhZ2V9fVwiPjwvc3Bhbj5cXG5cdDxzcGFuIGRhdGEtYmluZD1cImZvcmVhY2g6IHBhZ2VTZWxlY3RvcnNcIj5cXG5cdFx0PGtub2ItYnV0dG9uIHBhcmFtcz1cImxhYmVsOiBsYWJlbCwgc3RhdGU6IHN0YXRlLCBjbGljazogc2VsZWN0UGFnZVwiPjwva25vYi1idXR0b24+XFxuXHQ8L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tbmV4dFxcJywgc3RhdGU6IG5leHQoKS5zdGF0ZSwgY2xpY2s6IG5leHQoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tbGFzdFxcJywgc3RhdGU6IGxhc3QoKS5zdGF0ZSwgY2xpY2s6IGxhc3QoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuPC9kaXY+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvbihjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRcblx0dmFyIG51bU9mUGFnZXM7XG5cdGlmIChrby5pc09ic2VydmFibGUoY29uZmlnLm51bU9mUGFnZXMpKSB7XG5cdFx0bnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzO1xuXHR9IGVsc2Uge1xuXHRcdG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzIHx8IDEwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA8IDApIHtcblx0XHRcdHZhbHVlID0gMDtcblx0XHR9XG5cblx0XHR2YXIgcGFnZXNOdW0gPSBudW1PZlBhZ2VzKCk7XG5cdFx0aWYgKHZhbHVlID49IHBhZ2VzTnVtKSB7XG5cdFx0XHR2YWx1ZSA9IHBhZ2VzTnVtIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHR2YXIgY3VycmVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlID0gY29uZmlnLmN1cnJlbnRQYWdlIHx8IGtvLm9ic2VydmFibGUoMCk7XG5cblx0XHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdG51bU9mUGFnZXMoKTtcblx0XHRcdGN1cnJlbnRQYWdlKDApO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFBhZ2UoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0Y3VycmVudFBhZ2Uobm9ybWFsaXplKHZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0oKSk7XG5cblxuXHRcblxuXHR2YXIgY3VycmVudFBhZ2VSZWFsSWR4O1xuXHR2YXIgcGFnZVNlbGVjdG9ycyA9IChmdW5jdGlvbihjb25maWcpIHtcblx0XHR2YXIgYWZ0ZXJIZWFkID0gY29uZmlnLmFmdGVySGVhZCB8fCAyO1xuXHRcdHZhciBiZWZvcmVUYWlsID0gY29uZmlnLmJlZm9yZVRhaWwgfHwgMjtcblx0XHR2YXIgYmVmb3JlQ3VycmVudCA9IGNvbmZpZy5iZWZvcmVDdXJyZW50IHx8IDI7XG5cdFx0dmFyIGFmdGVyQ3VycmVudCA9IGNvbmZpZy5hZnRlckN1cnJlbnQgfHwgMjtcblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZVBhZ2VTZWxlY3RvcihpZHgsIGlzQ3VycmVudFBhZ2UpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBpZHggKyAxLFxuXHRcdFx0XHRzdGF0ZTogXCJkZWZhdWx0XCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN1cnJlbnRQYWdlKGlkeCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlTm9uQ2xpY2thYmxlU2VsZWN0b3IobGFiZWwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxhYmVsOiBsYWJlbCxcblx0XHRcdFx0c3RhdGU6IFwiZGlzYWJsZWRcIixcblx0XHRcdFx0c2VsZWN0UGFnZTogZnVuY3Rpb24oKSB7fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSBbXTtcblxuXHRcdFx0dmFyIG51bU9mUGFnZXNWYWwgPSBudW1PZlBhZ2VzKCk7XG5cdFx0XHR2YXIgY3VycmVudFBhZ2VWYWwgPSBjdXJyZW50UGFnZSgpO1xuXG5cdFx0XHR2YXIgbm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bU9mUGFnZXNWYWw7IGlkeCArPSAxKSB7XG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtMSB8fCAoaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpKSB7XG5cdFx0XHRcdFx0dmFyIHBhZ2VTZWxlY3RvcjtcblxuXHRcdFx0XHRcdGlmIChpZHggPT09IGN1cnJlbnRQYWdlVmFsKSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihpZHggKyAxKTtcblx0XHRcdFx0XHRcdGN1cnJlbnRQYWdlUmVhbElkeCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGFnZVNlbGVjdG9yID0gY3JlYXRlUGFnZVNlbGVjdG9yKGlkeCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChwYWdlU2VsZWN0b3IpO1xuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFub25DbGlja2FibGVJbnNlcnRlZCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudHMucHVzaChjcmVhdGVOb25DbGlja2FibGVTZWxlY3RvcihcIi4uLlwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vbkNsaWNrYWJsZUluc2VydGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fSk7XG5cdH0oY29uZmlnKSk7XG5cblxuXHR2YXIgbmV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggKyAxO1xuXG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0aWYgKGlkeCA+PSBwYWdlcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHggPSBwYWdlcy5sZW5ndGggLSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlc1tpZHhdO1xuXHR9KTtcblxuXHR2YXIgcHJldiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZHggPSBjdXJyZW50UGFnZVJlYWxJZHggLSAxO1xuXG5cdFx0aWYgKGlkeCA8IDApIHtcblx0XHRcdGlkeCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VTZWxlY3RvcnMoKVtpZHhdO1xuXHR9KTtcblxuXHR2YXIgZmlyc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpWzBdO1xuXHR9KTtcblxuXHR2YXIgbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYWdlcyA9IHBhZ2VTZWxlY3RvcnMoKTtcblx0XHRyZXR1cm4gcGFnZXNbcGFnZXMubGVuZ3RoIC0gMV07XG5cdH0pO1xuXG5cblx0cmV0dXJuIHtcblx0XHRwYWdlU2VsZWN0b3JzOiBwYWdlU2VsZWN0b3JzLFxuXG5cdFx0Zmlyc3Q6IGZpcnN0LFxuXHRcdGxhc3Q6IGxhc3QsXG5cblx0XHRuZXh0OiBuZXh0LFxuXHRcdHByZXY6IHByZXYsXG5cblx0XHRjdXJyZW50UGFnZTogY3VycmVudFBhZ2UsXG5cblx0XHRudW1PZlBhZ2VzOiBudW1PZlBhZ2VzXG5cdH07XG59O1xuIl19
