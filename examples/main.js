/*jslint node: true */
"use strict";

var superdata = require("superdata");

var knob = require("knob-js");
var ko = window.ko;

var defaultColor = ko.observable("e2e2e2");
var primaryColor = ko.observable("a0e1ff");
var infoColor = ko.observable("25aaf2");
var warningColor = ko.observable("f5a500");
var successColor = ko.observable("54c059");
var errorColor = ko.observable("ee483b");

var colors = ko.computed(function() {
	return {
		default: defaultColor(), 
		primary: primaryColor(),
		secondary: "#f4f4f4",

		info: infoColor(),
		success: successColor(),
		warning: warningColor(),
		error: errorColor(),

		white: "#fff",
		black: "#000",

		lightGray: "#f5f7f8",
		mediumGray: "#f0f2f4",
		darkGray: "#e5e9ec",

		border: "#d2cdc6" //only for the chamaileon style
	};
});

knob.init({
	theme: "background", //background, border, border-fill, chamaileon
	// for default and theme4
	colors: colors,
	// for chamaileon theme
	color1: {
		primary: "#44c0fc",
		secondary: "#f4f4f4",

		info: {
			background: "#25aaf2"
		},
		success: {
			background: "#54c059"
		},
		warning: {
			background: "#f5a500"
		},
		error: {
			background: "#ee483b"
		},

		white: "#fff",

		lightGray: "#f5f7f8",
		mediumGray: "#f0f2f4",
		darkGray: "#e5e9ec",
		border: "#d2cdc6",

		black: "#000",
		transparent: "transparent"
	},
		icons: {
			search: "#icon-search"
		},
		labels: {
			noResults: "No results"
		}
});


var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;


var proxy = createProxy({
	idProperty: "id",
	idType: "number",
	route: "/user"
});

var model = createModel({
	fields: {
		id: {
			type: "number"
		},
		email: {
			type: "string"
		},
		name: {
			type: "string"
		},
		title: {
			type: "string"
		}
	},
	"idField": "id",
	proxy: proxy
});

var store = createStore({
	model: model
});

//*
//seed
//atom
var seed = true;

function handleResponse() {
	//console.log(err, result);
}

if (seed) {
	var names = ["Bob", "Rob", "Olga", "Helga"];
	var titles = ["CEO", "CTO", "Developer"];

	for (var idx = 0; idx < 100; idx += 1) {
		var actName = names[idx % 4];

		store.add({
			id: idx,
			email: actName.toLowerCase() + "_" + idx + "@supercorp.com",
			name: actName,
			title: titles[idx % 3]
		}, handleResponse);
	}
}

window.store = store;

var buttons = [];

for (var idx = 0; idx < 5; idx += 1) {
	buttons.push("button" + idx);
}

function alertClose() {
	window.alert("Alert closed");
}

var up = true;
var dropdown1 = {
	items: ko.observableArray([]),
	selected: ko.observable(),
	index: ko.observable(2),
	value: ko.observable(7),
	changeItems: function() {
		var items =  [];
		for (var i = 1; i < 11; i += 1) {
			var val = up ? i : 11 - i;
			items.push({
				label: "item " + i + " - value: " + val.toString(),
				value: val
			});
		}
		up = !up;
		dropdown1.items(items);
	}
};
dropdown1.changeItems();

var dropdown2 = {
	items: [
		{label: "zero", value: 0},
		{label: "one", value: 1},
		{label: "two", value: 2},
		{label: "three", value: 3},
		{label: "four", value: 4},
		{label: "five", value: 5}
	],
	index: ko.observable(3),
	selected: ko.observable(),
	value: ko.observable()
};

var infiniteList = {
	loadMoreHandler: {
		loadMore: function() {}
	}
};
ko.applyBindings({
	store: store,
	numOfPages: ko.observable(),
	numOfItems: ko.observable(1000),
	itemsPerPage: ko.observable(10),
	buttons: buttons,
	modalVisible: ko.observable(false),
	confirmVisible: ko.observable(false),
	confirmVisibleInfo: ko.observable(false),
	confirmVisibleWarning: ko.observable(false),
	confirmVisibleSuccess: ko.observable(false),
	confirmVisibleError: ko.observable(false),
	confirmCallback: function(ok) {
		if (ok) {
			window.alert("Ok");
		} else {
			window.alert("Not ok");
		}
	},
	alertVisible: ko.observable(false),
	alertVisibleInfo: ko.observable(false),
	alertVisibleWarning: ko.observable(false),
	alertVisibleError: ko.observable(false),
	alertVisibleSuccess: ko.observable(false),
	warningVisible: ko.observable(false),
	infoVisible: ko.observable(false),
	successVisible: ko.observable(false),
	errorVisible: ko.observable(false),	
	alertCallback: alertClose,
	notificationVisible: ko.observable(false),
	checkboxValue: ko.observable(false),
	disabledCheckBoxValue: ko.observable(true),
	dropdown1: dropdown1,
	dropdown2: dropdown2,
	pagedListSelected: ko.observable(),
	toggleValue: ko.observable(false),
	numericMin: ko.observable(-10),
	numericMax: ko.observable(10),
	numericStep: ko.observable(1),
	numericPrecision: ko.observable(1),
	numericTestVal: ko.observable(6),
	infiniteList: infiniteList,
	dropdownSearchbox: ko.observable(),
	defaultColor: defaultColor,
	primaryColor: primaryColor,
	infoColor: infoColor,
	warningColor: warningColor,
	successColor: successColor,
	errorColor: errorColor
});
