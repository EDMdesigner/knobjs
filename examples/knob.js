/*jslint node: true */
"use strict";

var superdata = require("superdata");

var initKnob = require("../src/components").init;

initKnob({
	theme: "background", //background, border, border-fill, chamaileon
	// for default and theme4
	colors: {
		primary: "#44c0fc",
		secondary: "#f4f4f4",

		info: "#25aaf2",
		success: "#54c059",
		warning: "#f5a500",
		error: "#ee483b",

		white: "#fff",
		black: "#000",

		lightGray: "#f5f7f8",
		mediumGray: "#f0f2f4",
		darkGray: "#e5e9ec",

		border: "#d2cdc6" //only for the chamaileon style
	},
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

var ko = window.ko;

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

var dropdownItems = ko.observableArray([]);
var dropdownSelected = ko.observable();
var dropdownSelectedIdx = ko.observable(2);
var dropdownSelectedValue = ko.observable(7);

var up = true;
var changeDropdownItems = function() {
	var items =  [];
	for (var i = 1; i < 11; i += 1) {
		var val = up ? i : 11 - i;
		items.push({
			label: "item " + i + " - value: " + val.toString(),
			value: val
		});
	}
	up = !up;
	dropdownItems(items);
};
changeDropdownItems();

ko.applyBindings({
	store: store,
	numOfPages: ko.observable(),
	numOfItems: ko.observable(1000),
	itemsPerPage: ko.observable(10),
	buttons: buttons,
	modalVisible: ko.observable(false),
	confirmVisible: ko.observable(false),
	confirmCallback: function(ok) {
		if (ok) {
			window.alert("Ok");
		} else {
			window.alert("Not ok");
		}
	},
	alertVisible: ko.observable(false),
	alertCallback: alertClose,
	notificationVisible: ko.observable(false),
	checkboxValue: ko.observable(false),
	disabledCheckBoxValue: ko.observable(true),
	dropdownItems: dropdownItems,
	changeDropdownItems: changeDropdownItems,
	dropdownSelected: dropdownSelected,
	dropdownSelectedIdx: dropdownSelectedIdx,
	dropdownSelectedValue: dropdownSelectedValue,
	toggleValue: ko.observable(false),
	numericMin: ko.observable(-10),
	numericMax: ko.observable(10),
	numericStep: ko.observable(1),
	numericPrecision: ko.observable(1),
	numericTestVal: ko.observable(6)
});
