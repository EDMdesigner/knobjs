module.exports = function helpBoxCore(dependencies) {
	var ko = dependencies.ko;
	var localStorage = dependencies.localStorage;

	var nextId = 0;
	return function createHelpBox(config) {
		config = config || {};

		var prefix = "knob-helpBox-";

		var name = "";
		
		if (typeof config.name === "string") {
			name = config.name;
		}

		if (typeof name === "undefined") {
			name = nextId;
			nextId += 1;
		}

		var vm = {};

		vm.boxEnabled = ko.observable(true);
		vm.infoEnabled = ko.observable(false);

		var lsValue = localStorage.getItem(prefix + name);

		if (lsValue === "false") {
			vm.boxEnabled(false);
			vm.infoEnabled(true);
		} else {
			vm.boxEnabled(true);
			vm.infoEnabled(false);
		}

		vm.hideBox = function() {
			vm.boxEnabled(false);
			vm.infoEnabled(true);

			localStorage.setItem(prefix + name, "false");
		};
		vm.showBox = function() {
			vm.boxEnabled(true);
			vm.infoEnabled(false);

			localStorage.setItem(prefix + name, "true");
		};

		return vm;
	};
};
