/*jslint node: true */
"use strict";

var superdata = require("superdata");

var initKnob = require("../src/components").init;

initKnob({
	theme: "chamaileon",
	//for default and theme 4
	colorSet: {
		primaryColor: "#44c0fc",
		secondaryColor: "#f4f4f4",

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
		border: "#d2cdc6"

		black: "#000",
		transparent: "transparent"
	},
	// for theme2 and 3
	colorSet2: {
		primaryColor: "#2199e8",
		secondaryColor: "#777",

		info: {
			text: "#00529b",
			background: "#bde5f8"
		},
		success: {
			text: "#4f8a10",
			background: "#dff2bf"
		},
		warning: {
			text: "#9f6000",
			background: "#feefb3"
		},
		error: {
			text: "#d8000c",
			background: "#ffbaba"
		},

		white: "#fff",

		lightGray: "#e6e6e6",
		mediumGray: "#cacaca",
		darkGray: "#8a8a8a",

		black: "#000",
		transparent: "transparent"
	},
	// old default
	colorSet3: {
		primaryColor: "#666",
		secondaryColor: "#f4f4f4",

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

		lightGray: "#e6e6e6",
		mediumGray: "#cacaca",
		darkGray: "#8a8a8a",

		black: "#000",
		transparent: "transparent"
	},
	icons: {
		search: "#icon-search"
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

ko.applyBindings({
	store: store,
	numOfPages: ko.observable(),
	numOfItems: ko.observable(1000),
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
	notificationVisible: ko.observable(false)
});
