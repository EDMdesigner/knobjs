/*jslint node: true */
"use strict";

var createProxy = require("../proxy/memory");
var createModel = require("../model/model");
var createStore = require("../store/store");

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
function handleResponse(err, result) {
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
//*/

//THIS FILE SHOULD BE GENERATED

var registerComponent = require("./knobRegisterComponent");

registerComponent("knob-button", require("./button/vm"), require("./button/template.html"), require("./button/style.js"));
registerComponent("knob-dropdown", require("./dropdown/vm"), require("./dropdown/template.html")/*, require("./button/style.json")*/);
registerComponent("knob-pagination", require("./pagination/vm"), require("./pagination/template.html"));
registerComponent("knob-items-per-page", require("./itemsPerPage/vm"), require("./itemsPerPage/template.html"));
registerComponent("knob-paged-list", require("./pagedList/vm"), require("./pagedList/template.html"));

//