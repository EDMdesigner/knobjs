var ko = require("knockout");
var createNotification = require("../../src/notificationBar/vm");

describe("NotificationBar", function() {

	describe("- with invalid config", function() {
		it("missing config", function() {
			expect(createNotification).toThrowError("config is mandatory!");
		});

		it("invalid visible type", function() {
			expect(function() {
				createNotification({
					visible: "text",
					message: "important message",
					icon: "string"
				});
			}).toThrowError("config.visible must be an observable");
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
			message: "randomTitle",
			style: style,
			icon: "randomIcon"
		};

		var notificationBarVm = createNotification(config);

		it("toggle true or false", function() {
			expect(notificationBarVm.visible()).toBe(false);
			notificationBarVm.visible.toggle();
			expect(notificationBarVm.visible()).toBe(true);
		});
	});
});