module.exports = function(dependencies) {
	var base = dependencies.base;

	return function createFluidRow(config) {
		if (!config) {
			throw new Error("config is mandatory!");
		}

		if (!config.label) {
			throw new Error("config.label is mandatory!");
		}

		if (config.multiline && typeof config.multiline !== "boolean") {
			throw new Error("config.multiline must be a boolean!");
		}

		config.component = "fluid-row";

		var label = config.label;
		var multiline = config.multiline || false;

		var vm = base(config);

		vm.label = label;
		vm.multiline = multiline;

		return vm;
	};
};