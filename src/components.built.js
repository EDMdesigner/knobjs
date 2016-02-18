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
module.exports = '<div class="knob-pagelist">\n	<!-- ko if: error -->\n		<div data-bind="text: error"></div>\n	<!-- /ko -->\n\n	<div>\n		<div class="knob-pagelist__bar">\n			<input class="knob-pagelist__input" type="text" data-bind="value: search, valueUpdate: \'afterkeydown\'"/>\n			<knob-button class="knob-button-search" params="label: \'\', \n								variation: \'default\', \n								icon: \'#icon-search\'">\n			</knob-button>\n			<knob-items-per-page class="knob-pagelist__items-per-page" params="numOfItems: count, \n										numOfPages: numOfPages, \n										itemsPerPage: itemsPerPage">\n			</knob-items-per-page>\n			<!-- ko if: sortOptions.length > 0 -->\n				<knob-dropdown class="knob-dropdown" params="rightIcon: \'#icon-down\', selected: sort, items: sortOptions"></knob-dropdown>\n			<!-- /ko -->\n		</div>\n		<div class="knob-pagelist__result" data-bind="foreach: items">\n			<!-- ko template: { nodes: $componentTemplateNodes, data: $data } --><!-- /ko -->\n		</div>\n	</div>\n\n	<div data-bind="visible: loading">Loading...</div>\n	<!--\n	<knob-pagination params="numOfItems: pagination.numOfItems, itemsPerPage: itemsPerPage"></knob-pagination>\n	-->\n	<!-- ko if: numOfPages() > 0 -->\n		<knob-pagination params="numOfPages: numOfPages, currentPage: currentPage"></knob-pagination>\n	<!-- /ko -->\n	<!-- ko if: $data.loadMore -->\n		<div data-bind="visible: !loading(), click: loadMore">Load more...</div>\n	<!-- /ko -->\n</div>k';
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
module.exports = '<div data-bind="if: pageSelectors().length">\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-first\', state: first().state, click: first().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-prev\', state: prev().state, click: prev().selectPage}}"></span>\n	<span data-bind="foreach: pageSelectors">\n		<knob-button params="label: label, state: state, click: selectPage"></knob-button>\n	</span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-next\', state: next().state, click: next().selectPage}}"></span>\n	<span data-bind="component: {name: \'knob-button\', params: {icon: \'#icon-last\', state: last().state, click: last().selectPage}}"></span>\n</div>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFzZS9idXR0b25CZWhhdmlvdXIuanMiLCJzcmMvYmFzZS9pbnB1dEJlaGF2aW91ci5qcyIsInNyYy9iYXNlL3ZtLmpzIiwic3JjL2J1dHRvbi9zdHlsZS5qcyIsInNyYy9idXR0b24vdGVtcGxhdGUuaHRtbCIsInNyYy9idXR0b24vdm0uanMiLCJzcmMvY29tcG9uZW50cy5qcyIsInNyYy9kcm9wZG93bi90ZW1wbGF0ZS5odG1sIiwic3JjL2Ryb3Bkb3duL3ZtLmpzIiwic3JjL2lucHV0L3N0eWxlLmpzIiwic3JjL2lucHV0L3RlbXBsYXRlLmh0bWwiLCJzcmMvaW5wdXQvdm0uanMiLCJzcmMvaXRlbXNQZXJQYWdlL3RlbXBsYXRlLmh0bWwiLCJzcmMvaXRlbXNQZXJQYWdlL3ZtLmpzIiwic3JjL2tub2JSZWdpc3RlckNvbXBvbmVudC5qcyIsInNyYy9saXN0L3ZtLmpzIiwic3JjL3BhZ2VkTGlzdC90ZW1wbGF0ZS5odG1sIiwic3JjL3BhZ2VkTGlzdC92bS5qcyIsInNyYy9wYWdpbmF0aW9uL3RlbXBsYXRlLmh0bWwiLCJzcmMvcGFnaW5hdGlvbi92bS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnV0dG9uQmVoYXZpb3VyKHZtKSB7XG5cdHZhciBwcmV2aW91c1N0YXRlO1xuXG5cdGZ1bmN0aW9uIG1vdXNlT3ZlcigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYWN0U3RhdGUgIT09IFwiaG92ZXJcIikge1xuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShwcmV2aW91c1N0YXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdHZtLmV2ZW50SGFuZGxlcnMgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bW91c2VPdmVyOiBtb3VzZU92ZXIsXG5cdFx0XHRtb3VzZU91dDogbW91c2VPdXQsXG5cdFx0XHRtb3VzZURvd246IG1vdXNlRG93bixcblx0XHRcdG1vdXNlVXA6IG1vdXNlVXBcblx0XHR9O1xuXHR9KTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnV0dG9uQmVoYXZpb3VyKHZtKSB7XG5cdHZhciBwcmV2aW91c1N0YXRlO1xuXG5cdGZ1bmN0aW9uIG1vdXNlT3ZlcigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoYWN0U3RhdGUgIT09IFwiaG92ZXJcIikge1xuXHRcdFx0cHJldmlvdXNTdGF0ZSA9IGFjdFN0YXRlO1xuXHRcdH1cblxuXHRcdHZtLnN0YXRlKFwiaG92ZXJcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU91dCgpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShwcmV2aW91c1N0YXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bigpIHtcblx0XHR2YXIgYWN0U3RhdGUgPSB2bS5zdGF0ZSgpO1xuXG5cdFx0aWYgKGFjdFN0YXRlID09PSBcImRpc2FibGVkXCIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2bS5zdGF0ZShcImFjdGl2ZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cdFx0dmFyIGFjdFN0YXRlID0gdm0uc3RhdGUoKTtcblxuXHRcdGlmIChhY3RTdGF0ZSA9PT0gXCJkaXNhYmxlZFwiKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dm0uc3RhdGUoXCJob3ZlclwiKTtcblx0fVxuXG5cdHZhciBvYmogPSB7XG5cdFx0bW91c2VPdmVyOiBtb3VzZU92ZXIsXG5cdFx0bW91c2VPdXQ6IG1vdXNlT3V0LFxuXHRcdG1vdXNlRG93bjogbW91c2VEb3duLFxuXHRcdG1vdXNlVXA6IG1vdXNlVXBcblx0fTtcblxuXHRvYmo7XG5cblx0dm0uZXZlbnRIYW5kbGVycyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0fTtcblx0fSk7XG59O1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5mdW5jdGlvbiBjcmVhdGVCYXNlVm0oY29uZmlnKSB7XG5cdHZhciBjb21wb25lbnQgPSBjb25maWcuY29tcG9uZW50O1xuXHR2YXIgc3RhdGUgPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5zdGF0ZSB8fCBcImRlZmF1bHRcIik7XG5cdHZhciB2YXJpYXRpb24gPSBjb25maWcudmFyaWF0aW9uIHx8IFwiZGVmYXVsdFwiO1xuXG5cdHZhciBzdHlsZSA9IGNvbmZpZy5zdHlsZTtcblxuXHR2YXIgY3NzQ2xhc3NDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBcImtub2ItXCIgKyBjb21wb25lbnQgKyBcIiBzdGF0ZS1cIiArIHN0YXRlKCkgKyBcIiB2YXJpYXRpb24tXCIgKyB2YXJpYXRpb247XG5cdH0pO1xuXHR2YXIgc3R5bGVDb21wdXRlZCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdGF0ZVZhbCA9IHN0YXRlKCk7XG5cblx0XHRyZXR1cm4gc3R5bGVbdmFyaWF0aW9uXVtzdGF0ZVZhbF07XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0dmFyaWF0aW9uOiB2YXJpYXRpb24sXG5cdFx0c3RhdGU6IHN0YXRlLFxuXG5cdFx0Y3NzQ2xhc3M6IGNzc0NsYXNzQ29tcHV0ZWQsXG5cdFx0c3R5bGU6IHN0eWxlQ29tcHV0ZWRcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlVm07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJkZWZhdWx0XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMjZhNjlhXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzJiYmJhZFwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH0sXG5cdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XCJjb2xvclwiOiBcIiMxMzM3YWFcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNhYmNkZWZcIlxuXHRcdH0sXG5cdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNkZGRkZGRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjYWFhYWFhXCJcblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMxNzE3MTdcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMTcxNzE3XCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fVxuXHR9LFxuXHRcInByaW1hcnlcIjoge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMzQUI1NEFcIlxuXHRcdH0sXG5cdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMyYmJiYWRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjM0FCNTRBXCJcblx0XHR9XG5cdH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8YnV0dG9uIGRhdGEtYmluZD1cImNzczogY3NzQ2xhc3MsIFxcblx0XHRcdFx0XHRzdHlsZTogc3R5bGUsIFxcblx0XHRcdFx0XHRjbGljazogY2xpY2ssIFxcblx0XHRcdFx0XHRldmVudDogZXZlbnRIYW5kbGVycywgXFxuXHRcdFx0XHRcdGRpc2FibGU6IHN0YXRlKCkgPT09IFxcJ2Rpc2FibGVkXFwnXCI+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiBsZWZ0SWNvblwiPlxcblx0XHQ8c3ZnIGNsYXNzPVwiaWNvblwiPlxcblx0XHRcdDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ3hsaW5rOmhyZWZcXCc6IGxlZnRJY29ufVwiIHhsaW5rOmhyZWY9XCJcIj48L3VzZT5cXG5cdFx0PC9zdmc+XFxuXHQ8L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImxhYmVsXCIgZGF0YS1iaW5kPVwidGV4dDogbGFiZWxcIj48L3NwYW4+XFxuXFxuXHQ8c3BhbiBjbGFzcz1cImljb24td3JhcHBlclwiIGRhdGEtYmluZD1cImlmOiByaWdodEljb25cIj5cXG5cdFx0PHN2ZyBjbGFzcz1cImljb25cIj5cXG5cdFx0XHQ8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCd4bGluazpocmVmXFwnOiByaWdodEljb259XCIgeGxpbms6aHJlZj1cIlwiPjwvdXNlPlxcblx0XHQ8L3N2Zz5cXG5cdDwvc3Bhbj5cXG48L2J1dHRvbj4nOyIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi4vYmFzZS92bVwiKTtcbnZhciBidXR0b25CZWhhdmlvdXIgPSByZXF1aXJlKFwiLi4vYmFzZS9idXR0b25CZWhhdmlvdXJcIik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihjb25maWcpIHtcblx0Y29uZmlnLmNvbXBvbmVudCA9IFwiYnV0dG9uXCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXHRidXR0b25CZWhhdmlvdXIodm0pO1xuXG5cdHZtLmxlZnRJY29uID0ga28ub2JzZXJ2YWJsZShrby51bndyYXAoY29uZmlnLmxlZnRJY29uIHx8IGNvbmZpZy5pY29uKSk7XG5cdHZtLnJpZ2h0SWNvbiA9IGtvLm9ic2VydmFibGUoa28udW53cmFwKGNvbmZpZy5yaWdodEljb24pKTtcblx0dm0ubGFiZWwgPSBrby5vYnNlcnZhYmxlKGtvLnVud3JhcChjb25maWcubGFiZWwpKTtcblx0dm0uY2xpY2sgPSBjb25maWcuY2xpY2sgfHwgZnVuY3Rpb24oKSB7fTtcblxuXHRyZXR1cm4gdm07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uO1xuIiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKi9cblxuLy9USElTIEZJTEUgU0hPVUxEIEJFIEdFTkVSQVRFRFxuXG52YXIgcmVnaXN0ZXJDb21wb25lbnQgPSByZXF1aXJlKFwiLi9rbm9iUmVnaXN0ZXJDb21wb25lbnRcIik7XG5cbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1idXR0b25cIiwgcmVxdWlyZShcIi4vYnV0dG9uL3ZtXCIpLCByZXF1aXJlKFwiLi9idXR0b24vdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vYnV0dG9uL3N0eWxlLmpzXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pbnB1dFwiLCByZXF1aXJlKFwiLi9pbnB1dC92bVwiKSwgcmVxdWlyZShcIi4vaW5wdXQvdGVtcGxhdGUuaHRtbFwiKSwgcmVxdWlyZShcIi4vaW5wdXQvc3R5bGUuanNcIikpO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLWRyb3Bkb3duXCIsIHJlcXVpcmUoXCIuL2Ryb3Bkb3duL3ZtXCIpLCByZXF1aXJlKFwiLi9kcm9wZG93bi90ZW1wbGF0ZS5odG1sXCIpLyosIHJlcXVpcmUoXCIuL2J1dHRvbi9zdHlsZS5qc29uXCIpKi8pO1xucmVnaXN0ZXJDb21wb25lbnQoXCJrbm9iLXBhZ2luYXRpb25cIiwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi92bVwiKSwgcmVxdWlyZShcIi4vcGFnaW5hdGlvbi90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1pdGVtcy1wZXItcGFnZVwiLCByZXF1aXJlKFwiLi9pdGVtc1BlclBhZ2Uvdm1cIiksIHJlcXVpcmUoXCIuL2l0ZW1zUGVyUGFnZS90ZW1wbGF0ZS5odG1sXCIpKTtcbnJlZ2lzdGVyQ29tcG9uZW50KFwia25vYi1wYWdlZC1saXN0XCIsIHJlcXVpcmUoXCIuL3BhZ2VkTGlzdC92bVwiKSwgcmVxdWlyZShcIi4vcGFnZWRMaXN0L3RlbXBsYXRlLmh0bWxcIikpO1xuLy8iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwia25vYi1kcm9wZG93blwiPlxcblx0PCEtLSB3aXRoIHBhcmFtcywgdGhlIHNlbGVjdGVkKCkubGFiZWwgd29uXFwndCBiZSByZWNhbGN1bGF0ZWQsIHdoZW4gc2VsZWN0ZWQgaXMgY2hhbmdlZC4uLiAtLT5cXG5cdDxkaXYgZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7XFxuXHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0cGFyYW1zOiB7bGFiZWw6IHNlbGVjdGVkKCkubGFiZWwsXFxuXHRcdFx0XHRcdFx0aWNvbjogc2VsZWN0ZWQoKS5pY29uLFxcblx0XHRcdFx0XHRcdHJpZ2h0SWNvbjogcmlnaHRJY29uLFxcblx0XHRcdFx0XHRcdGNsaWNrOiBkcm9wZG93blZpc2libGUudG9nZ2xlfX1cIj5cXG5cdDwvZGl2Plxcblx0PGRpdiBjbGFzcz1cImtub2ItZHJvcGRvd24tbWVudVwiIGRhdGEtYmluZD1cImZvcmVhY2g6IG9wdGlvbnMsIHZpc2libGU6IGRyb3Bkb3duVmlzaWJsZVwiPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cImNvbXBvbmVudDoge1xcblx0XHRcdFx0XHRcdFx0bmFtZTogXFwna25vYi1idXR0b25cXCcsXFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IHtsYWJlbDogbGFiZWwsIGljb246IGljb24sIGNsaWNrOiBzZWxlY3R9fSwgXFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiAkZGF0YSAhPT0gJHBhcmVudC5zZWxlY3RlZCgpXCI+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cblxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uRHJvcGRvd24oY29uZmlnKSB7XG5cdHZhciByaWdodEljb24gPSBrby5vYnNlcnZhYmxlKGNvbmZpZy5yaWdodEljb24pO1xuXG5cdHZhciBvcHRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuXHRmb3IgKHZhciBpZHggPSAwOyBpZHggPCBjb25maWcuaXRlbXMubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdG9wdGlvbnMucHVzaChjcmVhdGVPcHRpb24oe1xuXHRcdFx0bGFiZWw6IGNvbmZpZy5pdGVtc1tpZHhdLmxhYmVsLFxuXHRcdFx0aWNvbjogY29uZmlnLml0ZW1zW2lkeF0uaWNvbixcblx0XHRcdHZhbHVlOiBjb25maWcuaXRlbXNbaWR4XS52YWx1ZVxuXHRcdH0pKTtcblx0fVxuXG5cdHZhciBzZWxlY3RlZCA9IGNvbmZpZy5zZWxlY3RlZCB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0c2VsZWN0ZWQob3B0aW9ucygpWzBdKTtcblxuXG5cdHZhciBkcm9wZG93blZpc2libGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuXHRkcm9wZG93blZpc2libGUudG9nZ2xlID0gZnVuY3Rpb24gdG9nZ2xlRHJvcGRvd25WaXNpYmxlKGl0ZW0sIGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR2YXIgdmlzaWJsZSA9IGRyb3Bkb3duVmlzaWJsZSgpO1xuXG5cdFx0ZHJvcGRvd25WaXNpYmxlKCF2aXNpYmxlKTtcblxuXG5cdFx0aWYgKHZpc2libGUpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlRHJvcGRvd25WaXNpYmxlLCBmYWxzZSk7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihjb25maWcpIHtcblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0bGFiZWw6IGtvLm9ic2VydmFibGUoY29uZmlnLmxhYmVsKSxcblx0XHRcdGljb246IGtvLm9ic2VydmFibGUoY29uZmlnLmljb24pLFxuXHRcdFx0dmFsdWU6IGNvbmZpZy52YWx1ZSxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGVjdGVkKG9iaik7XG5cdFx0XHRcdGRyb3Bkb3duVmlzaWJsZS50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cmlnaHRJY29uOiByaWdodEljb24sXG5cblx0XHRzZWxlY3RlZDogc2VsZWN0ZWQsXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcblxuXHRcdGRyb3Bkb3duVmlzaWJsZTogZHJvcGRvd25WaXNpYmxlXG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQnV0dG9uRHJvcGRvd247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJkZWZhdWx0XCI6IHtcblx0XHRcImRlZmF1bHRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiIzAwMFwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fSxcblx0XHRcImhvdmVyXCI6IHtcblx0XHRcdFwiYmFja2dyb3VuZENvbG9yXCI6IFwiIzJiYmJhZFwiLFxuXHRcdFx0XCJjb2xvclwiOiBcIiNmZmZcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNmZmZcIlxuXHRcdH0sXG5cdFx0XCJhY3RpdmVcIjoge1xuXHRcdFx0XCJjb2xvclwiOiBcIiMxMzM3YWFcIixcblx0XHRcdFwiZmlsbFwiOiBcIiNhYmNkZWZcIlxuXHRcdH0sXG5cdFx0XCJkaXNhYmxlZFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiNkZGRkZGRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjYWFhYWFhXCJcblx0XHR9LFxuXHRcdFwic3VjY2Vzc1wiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMxNzE3MTdcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiZXJyb3JcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMTcxNzE3XCIsXG5cdFx0XHRcImNvbG9yXCI6IFwiI2ZmZlwiLFxuXHRcdFx0XCJmaWxsXCI6IFwiI2ZmZlwiXG5cdFx0fVxuXHR9LFxuXHRcInByaW1hcnlcIjoge1xuXHRcdFwiZGVmYXVsdFwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMzQUI1NEFcIlxuXHRcdH0sXG5cdFx0XCJob3ZlclwiOiB7XG5cdFx0XHRcImJhY2tncm91bmRDb2xvclwiOiBcIiMyYmJiYWRcIixcblx0XHRcdFwiY29sb3JcIjogXCIjZmZmXCIsXG5cdFx0XHRcImZpbGxcIjogXCIjZmZmXCJcblx0XHR9LFxuXHRcdFwiZGlzYWJsZWRcIjoge1xuXHRcdFx0XCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjM0FCNTRBXCJcblx0XHR9XG5cdH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8aW5wdXQgZGF0YS1iaW5kPVwiY3NzOiBjc3NDbGFzcyxcXG5cdFx0XHRcdFx0c3R5bGU6IHN0eWxlLFxcblx0XHRcdFx0XHRhdHRyOiB7dHlwZTogdHlwZX0sXFxuXHRcdFx0XHRcdGV2ZW50OiBldmVudEhhbmRsZXJzLFxcblx0XHRcdFx0XHRkaXNhYmxlOiBzdGF0ZSgpID09PSBcXCdkaXNhYmxlZFxcJyxcXG5cdFx0XHRcdFx0XFxuXHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSxcXG5cdFx0XHRcdFx0dmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiIC8+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbnZhciBiYXNlID0gcmVxdWlyZShcIi4uL2Jhc2Uvdm1cIik7XG52YXIgaW5wdXRCZWhhdmlvdXIgPSByZXF1aXJlKFwiLi4vYmFzZS9pbnB1dEJlaGF2aW91clwiKTtcblxuZnVuY3Rpb24gY3JlYXRlSW5wdXQoY29uZmlnKSB7XG5cdGNvbmZpZy5jb21wb25lbnQgPSBcImlucHV0XCI7XG5cdGNvbmZpZy50eXBlID0gY29uZmlnLnR5cGUgfHwgXCJ0ZXh0XCI7XG5cblx0dmFyIHZtID0gYmFzZShjb25maWcpO1xuXHRpbnB1dEJlaGF2aW91cih2bSk7XG5cblx0dm0udHlwZSA9IGNvbmZpZy50eXBlO1xuXHR2bS52YWx1ZSA9IGNvbmZpZy52YWx1ZSB8fCBrby5vYnNlcnZhYmxlKCk7XG5cblx0cmV0dXJuIHZtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUlucHV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGtub2ItZHJvcGRvd24gcGFyYW1zPVwiXFxuXHRyaWdodEljb246IFxcJyNpY29uLWRvd25cXCcsXFxuXHRzZWxlY3RlZDogaXRlbXNQZXJQYWdlLFxcblx0aXRlbXM6IGl0ZW1zUGVyUGFnZUxpc3RcIj5cXG48L2tub2ItZHJvcGRvd24+JzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlSXRlbXNQZXJQYWdlKGNvbmZpZykge1xuXHRjb25maWcgPSBjb25maWcgfHwge307XG5cdHZhciBudW1PZkl0ZW1zID0gY29uZmlnLm51bU9mSXRlbXMgfHwga28ub2JzZXJ2YWJsZSgwKTtcblxuXHR2YXIgaXRlbXNQZXJQYWdlTGlzdCA9IGNvbmZpZy5pdGVtc1BlclBhZ2VMaXN0IHx8IFt7XG5cdFx0bGFiZWw6IDEwLFxuXHRcdHZhbHVlOiAxMFxuXHR9LCB7XG5cdFx0bGFiZWw6IDI1LFxuXHRcdHZhbHVlOiAyNVxuXHR9LCB7XG5cdFx0bGFiZWw6IDUwLFxuXHRcdHZhbHVlOiA1MFxuXHR9LCB7XG5cdFx0bGFiZWw6IDEwMCxcblx0XHR2YWx1ZTogMTAwXG5cdH1dO1xuXHR2YXIgaXRlbXNQZXJQYWdlID0ga28ub2JzZXJ2YWJsZShpdGVtc1BlclBhZ2VMaXN0WzBdKTtcblxuXHR2YXIgbnVtT2ZQYWdlcyA9IGNvbmZpZy5udW1PZlBhZ2VzIHx8IGtvLm9ic2VydmFibGUoKTtcblxuXHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHR2YXIgbnVtT2ZJdGVtc1ZhbCA9IG51bU9mSXRlbXMoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRpZiAoIWl0ZW1zUGVyUGFnZVZhbCkge1xuXHRcdFx0cmV0dXJuIG51bU9mUGFnZXMoMCk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZy5pdGVtc1BlclBhZ2UpIHtcblx0XHRcdGNvbmZpZy5pdGVtc1BlclBhZ2UoaXRlbXNQZXJQYWdlVmFsLnZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVtT2ZQYWdlcyhNYXRoLmNlaWwobnVtT2ZJdGVtc1ZhbCAvIGl0ZW1zUGVyUGFnZVZhbC52YWx1ZSkpO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdG51bU9mSXRlbXM6IG51bU9mSXRlbXMsXG5cdFx0aXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2UsXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcyxcblxuXHRcdGl0ZW1zUGVyUGFnZUxpc3Q6IGl0ZW1zUGVyUGFnZUxpc3Rcblx0fTtcbn07XG4iLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG5cbmZ1bmN0aW9uIGtub2JSZWdpc3RlckNvbXBvbmVudChuYW1lLCBjcmVhdGVWbSwgdGVtcGxhdGUsIHN0eWxlKSB7XG5cdGtvLmNvbXBvbmVudHMucmVnaXN0ZXIobmFtZSwge1xuXHRcdHZpZXdNb2RlbDoge1xuXHRcdFx0Y3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHRcdFx0cGFyYW1zLnN0eWxlID0gc3R5bGU7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVWbShwYXJhbXMpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtub2JSZWdpc3RlckNvbXBvbmVudDtcbiIsIi8qanNsaW50IG5vZGU6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIga28gPSAod2luZG93LmtvKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGlzdChjb25maWcpIHtcblx0dmFyIHN0b3JlID0gY29uZmlnLnN0b3JlO1xuXG5cdHZhciBmaWVsZHMgPSBjb25maWcuZmllbGRzO1xuXG5cdHZhciBzZWFyY2ggPSBrby5vYnNlcnZhYmxlKFwiXCIpLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IDUwMFxuXHR9KTtcblxuXHQvL2NvbmZpZy5zb3J0ZXJzXG5cdC8vIC0gbGFiZWxcblx0Ly8gLSBwcm9wXG5cblx0dmFyIHNvcnRPcHRpb25zID0gW107XG5cblx0ZnVuY3Rpb24gY3JlYXRlUXVyZXlPYmoocHJvcCwgYXNjKSB7XG5cdFx0dmFyIG9iaiA9IHt9O1xuXG5cdFx0b2JqW3Byb3BdID0gYXNjO1xuXHRcdHJldHVybiBvYmo7XG5cdH1cblx0aWYgKGNvbmZpZy5zb3J0KSB7XG5cdFx0Zm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgY29uZmlnLnNvcnQubGVuZ3RoOyBpZHggKz0gMSkge1xuXHRcdFx0dmFyIGFjdCA9IGNvbmZpZy5zb3J0W2lkeF07XG5cblx0XHRcdHNvcnRPcHRpb25zLnB1c2goe1xuXHRcdFx0XHRpY29uOiBcIiNpY29uLWEtelwiLFxuXHRcdFx0XHRsYWJlbDogYWN0LFxuXHRcdFx0XHR2YWx1ZTogY3JlYXRlUXVyZXlPYmooYWN0LCAxKVxuXHRcdFx0fSk7XG5cdFx0XHRzb3J0T3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWNvbjogXCIjaWNvbi16LWFcIixcblx0XHRcdFx0bGFiZWw6IGFjdCxcblx0XHRcdFx0dmFsdWU6IGNyZWF0ZVF1cmV5T2JqKGFjdCwgLTEpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHR2YXIgc29ydCA9IGtvLm9ic2VydmFibGUoc29ydE9wdGlvbnNbMF0pO1xuXG5cdHZhciBza2lwID0ga28ub2JzZXJ2YWJsZSgwKTtcblx0dmFyIGxpbWl0ID0ga28ub2JzZXJ2YWJsZSgwKTtcblxuXG5cdHZhciBpdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cblx0c3RvcmUuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IC8vc3RvcmUgPT09IHRoaXNcblx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHR9KTtcblxuXHR2YXIgY291bnQgPSBrby5vYnNlcnZhYmxlKDApOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblxuXHR2YXIgbG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpOyAvL3Nob3VsZCBiZSByZWFkLW9ubHlcblx0dmFyIGVycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7IC8vc2hvdWxkIGJlIHJlYWQtb25seT9cblxuXG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlYXJjaFZhbCA9IHNlYXJjaCgpO1xuXHRcdHZhciBzb3J0VmFsID0gc29ydCgpLnZhbHVlO1xuXHRcdHZhciBza2lwVmFsID0gc2tpcCgpO1xuXHRcdHZhciBsaW1pdFZhbCA9IGxpbWl0KCk7XG5cblx0XHR2YXIgZmluZCA9IHt9O1xuXG5cdFx0ZmluZFtjb25maWcuc2VhcmNoXSA9IHNlYXJjaFZhbDtcblxuXHRcdHN0b3JlLmZpbmQgPSBmaW5kO1xuXHRcdHN0b3JlLnNvcnQgPSBzb3J0VmFsO1xuXHRcdHN0b3JlLnNraXAgPSBza2lwVmFsO1xuXHRcdHN0b3JlLmxpbWl0ID0gbGltaXRWYWw7XG5cdH0pLmV4dGVuZCh7XG5cdFx0dGhyb3R0bGU6IDBcblx0fSk7XG5cblx0ZnVuY3Rpb24gYmVmb3JlTG9hZCgpIHtcblx0XHRpZiAobG9hZGluZygpKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkxpc3QgaXMgYWxyZWFkeSBsb2FkaW5nLi4uXCIpOyAvL3RoaXMgbWlnaHQgYmUgcHJvYmxlbWF0aWMgaWYgdGhlcmUgYXJlIG5vIGdvb2QgdGltZW91dCBzZXR0aW5ncy5cblx0XHR9XG5cblx0XHRsb2FkaW5nKHRydWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWZ0ZXJMb2FkKGVycikge1xuXHRcdGxvYWRpbmcoZmFsc2UpO1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcihlcnIpO1xuXHRcdH1cblx0XHRlcnJvcihudWxsKTtcblxuXHRcdHN0b3JlLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyAvL3N0b3JlID09PSB0aGlzXG5cdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0Y291bnQoc3RvcmUuY291bnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVhZE9ubHlDb21wdXRlZChvYnNlcnZhYmxlKSB7XG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gb2JzZXJ2YWJsZSgpO1xuXHRcdFx0fSxcblx0XHRcdHdyaXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhyb3cgXCJUaGlzIGNvbXB1dGVkIHZhcmlhYmxlIHNob3VsZCBub3QgYmUgd3JpdHRlbi5cIjtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cblx0c3RvcmUubG9hZC5iZWZvcmUuYWRkKGJlZm9yZUxvYWQpO1xuXHRzdG9yZS5sb2FkLmFmdGVyLmFkZChhZnRlckxvYWQpO1xuXG5cdHJldHVybiB7XG5cdFx0ZmllbGRzOiBmaWVsZHMsIC8vc2hvdWxkIGZpbHRlciB0byB0aGUgZmllbGRzLiAoc2VsZWN0KVxuXG5cdFx0c2VhcmNoOiBzZWFyY2gsXG5cblx0XHRzb3J0OiBzb3J0LFxuXHRcdHNvcnRPcHRpb25zOiBzb3J0T3B0aW9ucyxcblxuXHRcdHNraXA6IHNraXAsXG5cdFx0bGltaXQ6IGxpbWl0LFxuXG5cdFx0aXRlbXM6IGl0ZW1zLFxuXHRcdGNvdW50OiByZWFkT25seUNvbXB1dGVkKGNvdW50KSxcblxuXHRcdGxvYWRpbmc6IHJlYWRPbmx5Q29tcHV0ZWQobG9hZGluZyksXG5cdFx0ZXJyb3I6IHJlYWRPbmx5Q29tcHV0ZWQoZXJyb3IpXG5cdH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RcIj5cXG5cdDwhLS0ga28gaWY6IGVycm9yIC0tPlxcblx0XHQ8ZGl2IGRhdGEtYmluZD1cInRleHQ6IGVycm9yXCI+PC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG5cXG5cdDxkaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19iYXJcIj5cXG5cdFx0XHQ8aW5wdXQgY2xhc3M9XCJrbm9iLXBhZ2VsaXN0X19pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHNlYXJjaCwgdmFsdWVVcGRhdGU6IFxcJ2FmdGVya2V5ZG93blxcJ1wiLz5cXG5cdFx0XHQ8a25vYi1idXR0b24gY2xhc3M9XCJrbm9iLWJ1dHRvbi1zZWFyY2hcIiBwYXJhbXM9XCJsYWJlbDogXFwnXFwnLCBcXG5cdFx0XHRcdFx0XHRcdFx0dmFyaWF0aW9uOiBcXCdkZWZhdWx0XFwnLCBcXG5cdFx0XHRcdFx0XHRcdFx0aWNvbjogXFwnI2ljb24tc2VhcmNoXFwnXCI+XFxuXHRcdFx0PC9rbm9iLWJ1dHRvbj5cXG5cdFx0XHQ8a25vYi1pdGVtcy1wZXItcGFnZSBjbGFzcz1cImtub2ItcGFnZWxpc3RfX2l0ZW1zLXBlci1wYWdlXCIgcGFyYW1zPVwibnVtT2ZJdGVtczogY291bnQsIFxcblx0XHRcdFx0XHRcdFx0XHRcdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlcywgXFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZVwiPlxcblx0XHRcdDwva25vYi1pdGVtcy1wZXItcGFnZT5cXG5cdFx0XHQ8IS0tIGtvIGlmOiBzb3J0T3B0aW9ucy5sZW5ndGggPiAwIC0tPlxcblx0XHRcdFx0PGtub2ItZHJvcGRvd24gY2xhc3M9XCJrbm9iLWRyb3Bkb3duXCIgcGFyYW1zPVwicmlnaHRJY29uOiBcXCcjaWNvbi1kb3duXFwnLCBzZWxlY3RlZDogc29ydCwgaXRlbXM6IHNvcnRPcHRpb25zXCI+PC9rbm9iLWRyb3Bkb3duPlxcblx0XHRcdDwhLS0gL2tvIC0tPlxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImtub2ItcGFnZWxpc3RfX3Jlc3VsdFwiIGRhdGEtYmluZD1cImZvcmVhY2g6IGl0ZW1zXCI+XFxuXHRcdFx0PCEtLSBrbyB0ZW1wbGF0ZTogeyBub2RlczogJGNvbXBvbmVudFRlbXBsYXRlTm9kZXMsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+XFxuXHQ8IS0tXFxuXHQ8a25vYi1wYWdpbmF0aW9uIHBhcmFtcz1cIm51bU9mSXRlbXM6IHBhZ2luYXRpb24ubnVtT2ZJdGVtcywgaXRlbXNQZXJQYWdlOiBpdGVtc1BlclBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdC0tPlxcblx0PCEtLSBrbyBpZjogbnVtT2ZQYWdlcygpID4gMCAtLT5cXG5cdFx0PGtub2ItcGFnaW5hdGlvbiBwYXJhbXM9XCJudW1PZlBhZ2VzOiBudW1PZlBhZ2VzLCBjdXJyZW50UGFnZTogY3VycmVudFBhZ2VcIj48L2tub2ItcGFnaW5hdGlvbj5cXG5cdDwhLS0gL2tvIC0tPlxcblx0PCEtLSBrbyBpZjogJGRhdGEubG9hZE1vcmUgLS0+XFxuXHRcdDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogIWxvYWRpbmcoKSwgY2xpY2s6IGxvYWRNb3JlXCI+TG9hZCBtb3JlLi4uPC9kaXY+XFxuXHQ8IS0tIC9rbyAtLT5cXG48L2Rpdj5rJzsiLCIvKmpzbGludCBub2RlOiB0cnVlICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGtvID0gKHdpbmRvdy5rbyk7XG52YXIgY3JlYXRlTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0L3ZtXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2VkTGlzdChjb25maWcpIHtcblx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG5cdHZhciBzdG9yZSA9IGNvbmZpZy5zdG9yZTtcblxuXHRzdG9yZS5sb2FkLmJlZm9yZS5hZGQoYWZ0ZXJMb2FkKTtcblxuXHR2YXIgbGlzdCA9IGNyZWF0ZUxpc3QoY29uZmlnKTtcblx0Ly92YXIgcGFnaW5hdGlvbiA9IGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnLnBhZ2luYXRpb24pO1xuXHQvL2xpc3QucGFnaW5hdGlvbiA9IHBhZ2luYXRpb247XG5cblx0dmFyIG51bU9mUGFnZXMgPSBrby5vYnNlcnZhYmxlKCk7XG5cdHZhciBpdGVtc1BlclBhZ2UgPSBrby5vYnNlcnZhYmxlKDEwKTtcblx0dmFyIGN1cnJlbnRQYWdlID0ga28ub2JzZXJ2YWJsZSgwKTtcblxuXHRsaXN0Lm51bU9mUGFnZXMgPSBudW1PZlBhZ2VzO1xuXHRsaXN0Lml0ZW1zUGVyUGFnZSA9IGl0ZW1zUGVyUGFnZTtcblx0bGlzdC5jdXJyZW50UGFnZSA9IGN1cnJlbnRQYWdlO1xuXG5cblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblx0XHR2YXIgaXRlbXNQZXJQYWdlVmFsID0gaXRlbXNQZXJQYWdlKCk7XG5cblx0XHRsaXN0LnNraXAoY3VycmVudFBhZ2VWYWwgKiBpdGVtc1BlclBhZ2VWYWwpO1xuXHRcdGxpc3QubGltaXQoaXRlbXNQZXJQYWdlVmFsKTtcblx0fSk7XG5cblx0Lypcblx0a28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvdW50ID0gbGlzdC5jb3VudCgpO1xuXHRcdGxpc3QucGFnaW5hdGlvbi5udW1PZkl0ZW1zKGNvdW50KTtcblx0fSk7XG5cdCovXG5cblxuXHRmdW5jdGlvbiBhZnRlckxvYWQoKSB7XG5cdFx0bGlzdC5pdGVtcyhbXSk7XG5cdH1cblxuXHRyZXR1cm4gbGlzdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGRhdGEtYmluZD1cImlmOiBwYWdlU2VsZWN0b3JzKCkubGVuZ3RoXCI+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tZmlyc3RcXCcsIHN0YXRlOiBmaXJzdCgpLnN0YXRlLCBjbGljazogZmlyc3QoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJjb21wb25lbnQ6IHtuYW1lOiBcXCdrbm9iLWJ1dHRvblxcJywgcGFyYW1zOiB7aWNvbjogXFwnI2ljb24tcHJldlxcJywgc3RhdGU6IHByZXYoKS5zdGF0ZSwgY2xpY2s6IHByZXYoKS5zZWxlY3RQYWdlfX1cIj48L3NwYW4+XFxuXHQ8c3BhbiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBwYWdlU2VsZWN0b3JzXCI+XFxuXHRcdDxrbm9iLWJ1dHRvbiBwYXJhbXM9XCJsYWJlbDogbGFiZWwsIHN0YXRlOiBzdGF0ZSwgY2xpY2s6IHNlbGVjdFBhZ2VcIj48L2tub2ItYnV0dG9uPlxcblx0PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLW5leHRcXCcsIHN0YXRlOiBuZXh0KCkuc3RhdGUsIGNsaWNrOiBuZXh0KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcblx0PHNwYW4gZGF0YS1iaW5kPVwiY29tcG9uZW50OiB7bmFtZTogXFwna25vYi1idXR0b25cXCcsIHBhcmFtczoge2ljb246IFxcJyNpY29uLWxhc3RcXCcsIHN0YXRlOiBsYXN0KCkuc3RhdGUsIGNsaWNrOiBsYXN0KCkuc2VsZWN0UGFnZX19XCI+PC9zcGFuPlxcbjwvZGl2Pic7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrbyA9ICh3aW5kb3cua28pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVBhZ2luYXRpb24oY29uZmlnKSB7XG5cdGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuXHR2YXIgbnVtT2ZQYWdlcztcblxuXHRpZiAoa28uaXNPYnNlcnZhYmxlKGNvbmZpZy5udW1PZlBhZ2VzKSkge1xuXHRcdG51bU9mUGFnZXMgPSBjb25maWcubnVtT2ZQYWdlcztcblx0fSBlbHNlIHtcblx0XHRudW1PZlBhZ2VzID0ga28ub2JzZXJ2YWJsZShjb25maWcubnVtT2ZQYWdlcyB8fCAxMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemUodmFsdWUpIHtcblx0XHRpZiAodmFsdWUgPCAwKSB7XG5cdFx0XHR2YWx1ZSA9IDA7XG5cdFx0fVxuXG5cdFx0dmFyIHBhZ2VzTnVtID0gbnVtT2ZQYWdlcygpO1xuXG5cdFx0aWYgKHZhbHVlID49IHBhZ2VzTnVtKSB7XG5cdFx0XHR2YWx1ZSA9IHBhZ2VzTnVtIC0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblxuXHR2YXIgY3VycmVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGN1cnJlbnRQYWdlID0gY29uZmlnLmN1cnJlbnRQYWdlIHx8IGtvLm9ic2VydmFibGUoMCk7XG5cblx0XHRrby5jb21wdXRlZChmdW5jdGlvbigpIHtcblx0XHRcdG51bU9mUGFnZXMoKTtcblx0XHRcdGN1cnJlbnRQYWdlKDApO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKHtcblx0XHRcdHJlYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFBhZ2UoKTtcblx0XHRcdH0sXG5cdFx0XHR3cml0ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0Y3VycmVudFBhZ2Uobm9ybWFsaXplKHZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0oKSk7XG5cblx0dmFyIGN1cnJlbnRQYWdlUmVhbElkeDtcblx0dmFyIHBhZ2VTZWxlY3RvcnMgPSAoZnVuY3Rpb24oY29uZmlnKSB7XG5cdFx0dmFyIGFmdGVySGVhZCA9IGNvbmZpZy5hZnRlckhlYWQgfHwgMjtcblx0XHR2YXIgYmVmb3JlVGFpbCA9IGNvbmZpZy5iZWZvcmVUYWlsIHx8IDI7XG5cdFx0dmFyIGJlZm9yZUN1cnJlbnQgPSBjb25maWcuYmVmb3JlQ3VycmVudCB8fCAyO1xuXHRcdHZhciBhZnRlckN1cnJlbnQgPSBjb25maWcuYWZ0ZXJDdXJyZW50IHx8IDI7XG5cblx0XHRmdW5jdGlvbiBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogaWR4ICsgMSxcblx0XHRcdFx0c3RhdGU6IFwiZGVmYXVsdFwiLFxuXHRcdFx0XHRzZWxlY3RQYWdlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdXJyZW50UGFnZShpZHgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGxhYmVsKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogbGFiZWwsXG5cdFx0XHRcdHN0YXRlOiBcImRpc2FibGVkXCIsXG5cdFx0XHRcdHNlbGVjdFBhZ2U6IGZ1bmN0aW9uKCkge31cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gW107XG5cblx0XHRcdHZhciBudW1PZlBhZ2VzVmFsID0gbnVtT2ZQYWdlcygpO1xuXHRcdFx0dmFyIGN1cnJlbnRQYWdlVmFsID0gY3VycmVudFBhZ2UoKTtcblxuXHRcdFx0dmFyIG5vbkNsaWNrYWJsZUluc2VydGVkID0gZmFsc2U7XG5cblx0XHRcdGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bU9mUGFnZXNWYWw7IGlkeCArPSAxKSB7XG5cdFx0XHRcdGlmIChpZHggPD0gYWZ0ZXJIZWFkIHx8IGlkeCA+PSBudW1PZlBhZ2VzVmFsIC0gYmVmb3JlVGFpbCAtIDEgfHwgaWR4ID49IGN1cnJlbnRQYWdlVmFsIC0gYmVmb3JlQ3VycmVudCAmJiBpZHggPD0gY3VycmVudFBhZ2VWYWwgKyBhZnRlckN1cnJlbnQpIHtcblx0XHRcdFx0XHR2YXIgcGFnZVNlbGVjdG9yO1xuXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gY3VycmVudFBhZ2VWYWwpIHtcblx0XHRcdFx0XHRcdHBhZ2VTZWxlY3RvciA9IGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKGlkeCArIDEpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFBhZ2VSZWFsSWR4ID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwYWdlU2VsZWN0b3IgPSBjcmVhdGVQYWdlU2VsZWN0b3IoaWR4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKHBhZ2VTZWxlY3Rvcik7XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIW5vbkNsaWNrYWJsZUluc2VydGVkKSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50cy5wdXNoKGNyZWF0ZU5vbkNsaWNrYWJsZVNlbGVjdG9yKFwiLi4uXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9uQ2xpY2thYmxlSW5zZXJ0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtZW50cztcblx0XHR9KTtcblx0fShjb25maWcpKTtcblxuXG5cdHZhciBuZXh0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCArIDE7XG5cblx0XHR2YXIgcGFnZXMgPSBwYWdlU2VsZWN0b3JzKCk7XG5cblx0XHRpZiAoaWR4ID49IHBhZ2VzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhZ2VzW2lkeF07XG5cdH0pO1xuXG5cdHZhciBwcmV2ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGlkeCA9IGN1cnJlbnRQYWdlUmVhbElkeCAtIDE7XG5cblx0XHRpZiAoaWR4IDwgMCkge1xuXHRcdFx0aWR4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZVNlbGVjdG9ycygpW2lkeF07XG5cdH0pO1xuXG5cdHZhciBmaXJzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBwYWdlU2VsZWN0b3JzKClbMF07XG5cdH0pO1xuXG5cdHZhciBsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhZ2VzID0gcGFnZVNlbGVjdG9ycygpO1xuXG5cdFx0cmV0dXJuIHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdO1xuXHR9KTtcblxuXG5cdHJldHVybiB7XG5cdFx0cGFnZVNlbGVjdG9yczogcGFnZVNlbGVjdG9ycyxcblxuXHRcdGZpcnN0OiBmaXJzdCxcblx0XHRsYXN0OiBsYXN0LFxuXG5cdFx0bmV4dDogbmV4dCxcblx0XHRwcmV2OiBwcmV2LFxuXG5cdFx0Y3VycmVudFBhZ2U6IGN1cnJlbnRQYWdlLFxuXG5cdFx0bnVtT2ZQYWdlczogbnVtT2ZQYWdlc1xuXHR9O1xufTtcbiJdfQ==
