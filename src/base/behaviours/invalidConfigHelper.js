function invalidConfig(config) {

	var behaviour = config.behaviour;

	describe("with invalid config", function() {
		it(" - falsy", function() {
			expect(behaviour).toThrowError("vm is mandatory!");
		});

		it(" - config.state is not observable", function() {
			expect(function() {
				behaviour({});
			}).toThrowError("vm.state has to be a knockout observable!");

			expect(function() {
				behaviour({
					state: function() {}
				});
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

}

module.exports = invalidConfig;
