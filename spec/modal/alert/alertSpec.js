var ko = require("knockout");
var createAlert = require("../../../src/modal/alert/vm");

describe("Modal - Alert", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createAlert).toThrowError("config is mandatory!");
		});

		it("invalid message type", function() {
			expect(function() {
				createAlert({
					visible: "text",
					okLabel: "ok",
					callback: function() {}
				});
			}).toThrowError("config.message must be a string");
		});

		it("invalid okLabel type", function() {
			expect(function() {
				createAlert({
					message: "Hello",
					visible: "text",
					callback: function() {}
				});
			}).toThrowError("config.okLabel must be a string");
		});

		it("invalid visible type", function() {
			expect(function() {
				createAlert({
					message: "Hello",
					okLabel: "ok",
					visible: "text",
					callback: function() {}
				});
			}).toThrowError("config.visible must be an observable");
		});

		it("invalid callback", function() {
			expect(function() {
				createAlert({
					visible: ko.observable(),
					message: "Hello",
					okLabel: "ok",
					callback: "notAFunction"
				});
			}).toThrowError("config.callback must be a function");
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
			okLabel: "A random label",
			message: "I have to alert you about something!",
			callback: function() {}
		};

		it("interface", function() {
			var alertVm = createAlert(config);

			expect(alertVm.visible()).toBe(config.visible());
			expect(alertVm.title).toBe(config.title);
			expect(alertVm.icon).toBe(config.icon);
			expect(alertVm.message).toBe(config.message);
			expect(alertVm.okLabel).toBe(config.okLabel);

			expect(ko.isObservable(alertVm.visible)).toBe(true);
			expect(typeof alertVm.title).toBe("string");
			expect(typeof alertVm.icon).toBe("string");
			expect(typeof alertVm.message).toBe("string");
			expect(typeof alertVm.okLabel).toBe("string");
			expect(typeof alertVm.ok).toBe("function");
		});


		it("call ok", function() {
			spyOn(config, "callback").and.callThrough();

			var alertVm = createAlert(config);
			var origVisible = alertVm.visible();

			alertVm.ok();

			expect(config.callback).toHaveBeenCalled();
			expect(alertVm.visible()).toBe(!origVisible);
		});
	});
});
