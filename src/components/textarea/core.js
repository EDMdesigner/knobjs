module.exports = function(dependencies) {
	var ko = dependencies.ko;

	return function createInput(config) {
		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (config.value && !ko.isObservable(config.value)) {
			throw new Error("config.value must be an observable");
		}

		if (config.hasFocus && !ko.isObservable(config.hasFocus)) {
			throw new Error("config.hasFocus must be an observable");
		}

		config.component = "textarea";
		config.placeholder = config.placeholder || "";

		var vm = {};

		vm.placeholder = config.placeholder;
		vm.value = config.value || ko.observable();
		vm.hasFocus = config.hasFocus || ko.observable(false);

		return vm;
	};
};