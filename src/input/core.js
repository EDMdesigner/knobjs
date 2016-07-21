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
		left.icon = left.icon || {};
		left.text = left.text || {};
		left.icon.value = ko.observable(ko.unwrap(left.icon.value || config.icon) || "");
		left.icon.hideOnFocus = ko.unwrap(left.icon.hideOnFocus) || false;
		left.icon.visible = ko.observable(true);
		left.text.value = ko.observable(ko.unwrap(left.text.value) || "");
		left.text.hideOnFocus = ko.unwrap(left.text.hideOnFocus) || false;
		left.text.visible = ko.observable(true);

		var right = config.right || {};
		right.icon = right.icon || {};
		right.text = right.text || {};
		right.icon.value = ko.observable(ko.unwrap(right.icon.value) || "");
		right.icon.hideOnFocus = ko.unwrap(right.icon.hideOnFocus) || false;
		right.icon.visible = ko.observable(true);
		right.text.value = ko.observable(ko.unwrap(right.text.value) || "");
		right.text.hideOnFocus = ko.unwrap(right.text.hideOnFocus) || false;
		right.text.visible = ko.observable(true);

		var vm = base(config);

		vm.behaviours.hover.enable();
		vm.behaviours.focus.enable();

		vm.placeholder = ko.observable(config.placeholder);
		vm.type = config.type;
		vm.value = config.value || ko.observable();
		vm.hasFocus = config.hasFocus || ko.observable(false);

		if (config.keyDown) {
			vm.eventHandlers.keydown = config.keyDown;
		}

		ko.computed(function() {
			if(vm.hasFocus() && left.icon.hideOnFocus) {
				left.icon.visible(false);
			} else {
				left.icon.visible(true);
			}
		});

		ko.computed(function() {
			if(vm.hasFocus() && left.text.hideOnFocus) {
				left.text.visible(false);
			} else {
				left.text.visible(true);
			}

			if(vm.value()) {
				left.text.visible(false);
			} else {
				left.text.visible(true);
			}
		});

		ko.computed(function() {
			if(vm.hasFocus() && right.icon.hideOnFocus) {
				right.icon.visible(false);
			} else {
				right.icon.visible(true);
			}
		});

		ko.computed(function() {
			if(vm.hasFocus() && right.text.hideOnFocus) {
				right.text.visible(false);
			} else {
				right.text.visible(true);
			}

			if(vm.value()) {
				right.text.visible(false);
			} else {
				right.text.visible(true);
			}
		});

		vm.left = left;
		vm.right = right;
		
		return vm;
	};
};