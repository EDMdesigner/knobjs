/*jslint node: true */
"use strict";

module.exports = function pagedListCore(dependencies) {

	var obligatoryDeps = ["ko", "createPagedList"];

	for (var i = 0; i < obligatoryDeps.length; i += 1) {
		if (typeof dependencies[obligatoryDeps[i]] === "undefined") {
			throw new Error("dependencies." + obligatoryDeps[i] + " is mandatory!");
		}
	}

	var ko = dependencies.ko;
	var createPagedList = dependencies.createPagedList;

	return function createSelectablePagedList(config) {
		var pagedList = createPagedList(config);

		pagedList.selected = ko.observable(2);
		return pagedList;
	};
};
