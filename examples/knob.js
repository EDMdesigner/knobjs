/*jslint node: true */
"use strict";

var superdata = require("superdata");

var initKnob = require("../src/components");

initKnob({
	//Button Colors
	baseButtonFontColor: "#fff",
	disabledButtonBg: "#d1d5d8",
	disabledButtonColor: "#131313",
	baseBg: "#2969b0",
	baseHoverBg: "#3d8eb9",
	baseActiveBg: "#54acd2",
	primaryBg: "#fba026",
	primaryHoverBg: "#FAC51C",
	primaryHoverButtonFontColor: "#fff",
	primaryActiveBg: "#F7DA64",
	primaryActiveButtonFontColor: "#fff",

	// InputColors
	inputBg: "#fff",
	inputText: "#131313",
	inputBorder: "#ddd",
	inputHoverBorder: "#131313",
	inputDisabledBg: "#fafafa",
	inputActiveColor: "#1337aa",
	inputDisabledColor: "#aaa",

	//ListItemRowColors
	evenBg: "red",
	evenColor: "yellow",
	evenHoverBg: "yellow",
	evenHoverColor: "red",
	oddBg: "pink",
	oddColor: "navy",
	oddHoverBg: "navy",
	oddHoverColor: "pink"
});



var createProxy = superdata.proxy.memory;
var createModel = superdata.model.model;
var createStore = superdata.store.store;

var ko = window.ko;

var proxy = createProxy({
	idProperty: "id",
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
	var titles = ["CEO", "CTO", "Slave"];

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

for (var idx = 0; idx < 10; idx += 1) {
	buttons.push("button" + idx);
}
ko.applyBindings({
	store: store,
	numOfPages: ko.observable(),
	numOfItems: ko.observable(1000),
	buttons: buttons
});
