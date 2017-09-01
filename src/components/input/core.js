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

		function createInputDeco(config, prop) {
			var returnable = config[prop] || {};
			returnable.icon = returnable.icon || {};
			returnable.text = returnable.text || {};
			returnable.icon.value = ko.observable(ko.unwrap(returnable.icon.value || config.icon) || "");
			returnable.icon.hideOnContent = ko.unwrap(returnable.icon.hideOnContent) || false;
			returnable.icon.visible = ko.observable(true);
			returnable.text.value = ko.observable(ko.unwrap(returnable.text.value) || "");
			returnable.text.hideOnContent = ko.unwrap(returnable.text.hideOnContent) || false;
			returnable.text.visible = ko.observable(true);

			return returnable;
		}

		var left = createInputDeco(config, "left");
		var right = createInputDeco(config, "right");

		var vm = base(config);

		vm.placeholder = ko.observable(config.placeholder);
		vm.type = config.type;
		vm.value = config.value || ko.observable();
		vm.hasFocus = config.hasFocus || ko.observable(false);

		if (config.keyDown) {
			vm.eventHandlers.keydown = config.keyDown;
		}

		function createPlaceholderComputed(item, dependency) {
			ko.computed(function() {
				if(item.hideOnContent && dependency()) {
					item.visible(false);
				} else {
					item.visible(true);
				}
			});
		}

		createPlaceholderComputed(left.icon, vm.value);
		createPlaceholderComputed(left.text, vm.value);
		createPlaceholderComputed(right.icon, vm.value);
		createPlaceholderComputed(right.text, vm.value);

		vm.left = left;
		vm.right = right;
		
		return vm;
	};
};