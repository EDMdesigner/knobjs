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

		var left = config.left || {};
		left.icon = ko.observable(ko.unwrap(left.icon || config.icon) || "");
		left.hideOnFocus = ko.unwrap(left.hideOnFocus) || false;
		left.text = ko.observable(ko.unwrap(left.text) || "");
		left.visible = ko.observable(true);

		var right = config.right || {};
		right.icon = ko.observable(ko.unwrap(right.icon) || "");
		right.hideOnFocus = ko.unwrap(right.hideOnFocus) || false;
		right.text = ko.observable(ko.unwrap(right.text) || "");
		right.visible = ko.observable(true);

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

		ko.computed(function() {
			if(vm.hasFocus() && left.hideOnFocus) {
				left.visible(false);
			} else {
				left.visible(true);
			}
		});

		ko.computed(function() {
			if(vm.hasFocus() && right.hideOnFocus) {
				right.visible(false);
			} else {
				right.visible(true);
			}
		});

		vm.left = left;
		vm.right = right;
		
		return vm;
	};
};