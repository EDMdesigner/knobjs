var ko = require("knockout");
var createConfirm = require("../../confirm/vm");

describe("Modal - Confirm", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createConfirm).toThrowError("config is mandatory!");
		});

		it("message", function() {
			expect(function() {
				createConfirm({
					okLabel: "Ok",
					cancelLabel: "Cancel"
				});
			}).toThrowError("config.message element is mandatory!");
		});

		it("okLabel", function() {
			expect(function() {
				createConfirm({
					message: "lipsum",
					cancelLabel: "Cancel"
				});
			}).toThrowError("config.okLabel element is mandatory!");
		});

		it("cancelLabel", function() {
			expect(function() {
				createConfirm({
					okLabel: "Ok",
					message: "lipsum"
				});
			}).toThrowError("config.cancelLabel element is mandatory!");
		});

	});

	describe("- with valid config", function() {

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
			icon: "randomIcon",
			okLabel: "Ok",
			cancelLabel: "Cancel",
			message: "Lipsum"
		};

		var confirmModalVm = createConfirm(config);

		it("interface test", function() {
			expect(typeof confirmModalVm.ok).toBe("function");
			expect(typeof confirmModalVm.cancel).toBe("function");
			expect(ko.isObservable(confirmModalVm.visible)).toBe(true);
			expect(typeof confirmModalVm.title).toBe("string");
			expect(typeof confirmModalVm.icon).toBe("string");
			expect(typeof confirmModalVm.okLabel).toBe("string");
			expect(typeof confirmModalVm.cancelLabel).toBe("string");
			expect(typeof confirmModalVm.message).toBe("string");
		});

		it("Confirm Ok callback", function() {

			config.callback = function(param) {
				expect(param).toBe(true);
			};

			spyOn(config, "callback").and.callThrough();

			var confirmModalCb = createConfirm(config);

			confirmModalCb.ok();
			expect(config.callback).toHaveBeenCalled();
		});

		it("Confirm Cancel callback", function() {

			config.callback = function(param) {
				expect(param).toBe(false);
			};
			spyOn(config, "callback").and.callThrough();

			var confirmModalCb = createConfirm(config);

			confirmModalCb.cancel();
			expect(config.callback).toHaveBeenCalled();

		});
	});
});