var ko = require("knockout");
var createConfirm = require("../../../src/modal/confirm/vm");

describe('Modal - Confirm', function() {

	describe('- with invalid config', function() {
		it("missing config", function() {
			expect(createConfirm).toThrowError("config is mandatory!");
		});
	});

	describe('- with valid config', function() {
		var style = {
			default: {
				default: {
					background: "#001",
					color: "#001",
					fill: "#001"
				}
			}
		};

		var config = {
			visible: ko.observable(false),
			title: "randomTitle",
			style: style,
			icon: "randomIcon"

		};

		var confirmModalVm = createConfirm(config);

		it('Confirm ok / cancel is a function', function() {
			expect(typeof confirmModalVm.ok).toBe("function");
			expect(typeof confirmModalVm.cancel).toBe("function");
		});

	});

});