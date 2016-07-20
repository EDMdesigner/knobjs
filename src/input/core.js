module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.base) {
		throw new Error("dependencies.base is mandatory!");
	}

	if(!dependencies.ko) {
		throw new Error("dependencies.ko is mandatory!");
	}

	var ko = dependencies.ko;
	var base = dependencies.base;

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

		config.component = "input";
		config.type = config.type || "text";
		config.placeholder = config.placeholder || "";

		var vm = base(config);

		vm.behaviours.hover.enable();
		vm.behaviours.focus.enable();

		vm.placeholder = config.placeholder;
		vm.type = config.type;
		vm.value = config.value || ko.observable();
		vm.hasFocus = config.hasFocus || ko.observable(false);

		if (config.keyDown) {
			vm.eventHandlers.keydown = config.keyDown;
		}

		/* this should be working
		vm.left = {
			icon: ko.observable(ko.unwrap(config.leftIcon || config.icon)),
			text: ko.observable(ko.unwrap(config.prefixText))
		}

		vm.righ = {
			icon: ko.observable(ko.unwrap(config.rightIcon)),
			text: ko.observable(ko.unwrap(config.postFixText))
		}
		*/

		vm.leftIcon = ko.observable(ko.unwrap(config.leftIcon || config.icon));
		vm.rightIcon = ko.observable(ko.unwrap(config.rightIcon));
		vm.preFixText = ko.observable(ko.unwrap(config.preFixText));
		vm.postFixText = ko.observable(ko.unwrap(config.postFixText));
		
		return vm;
	};
};