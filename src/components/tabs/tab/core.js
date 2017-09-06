module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.base) {
		throw new Error("dependencies.base is mandatory!");
	}

	return function createTab(config) {
		config = config || {};
		config.component = "tab";
		config.variation = config.variation || "tab";
		config.state = "active";

		var vm = {};

		return vm;
	};
};