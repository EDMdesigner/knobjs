/*jslint node: true */
"use strict";

var superdata = require("superdata");

var initKnob = require("../src/components").init;

initKnob({
	primaryColor: "#2199e8",
	secondaryColor: "#777",

	highlightColor: "yellow",
	successColor: "#3adb76",
	alertColor: "#e74c3c",
	warningColor: "#ec5840",

	white: "#fff",

	lightGray: "#e6e6e6",
	mediumGray: "#cacaca",
	darkGray: "#8a8a8a",

	black: "#000",
	transparent: "transparent"
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
ko.applyBindings({
	store: store,
	numOfPages: ko.observable(),
	numOfItems: ko.observable(1000),
	buttons: buttons,
	modalVisible: ko.observable(false),
	xxx: "my test"
});
