var ko = require("knockout");
var notificationBarCore = require("./core");

describe("NotificationBar", function() {

	describe("- with invalid config", function() {
		var mockBase = {};
		var createNotificationBar = notificationBarCore({
			ko: ko,
			base: mockBase
		});

		it("missing config", function() {
			expect(createNotificationBar).toThrowError("config is mandatory!");
		});

		it("invalid visible type", function() {
			expect(function() {
				createNotificationBar({
					visible: "text",
					message: "important message",
					icon: "string"
				});
			}).toThrowError("config.visible must be an observable");
		});
	});

	describe("- with valid config", function() {
		var base;
		var createNotificationBar;
		var notificationBarVm;

		beforeEach(function() {
			base = {
				mockBase: function() {
					return {};
				}
			};

			spyOn(base, "mockBase").and.callThrough();
			createNotificationBar = notificationBarCore({
				ko: ko,
				base: base.mockBase
			});
		});

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

		it("call base", function() {
			notificationBarVm = createNotificationBar(config);
			expect(base.mockBase).toHaveBeenCalled();
		});

		it("toggle true or false", function() {
			notificationBarVm = createNotificationBar(config);

			expect(notificationBarVm.visible()).toBe(false);
			notificationBarVm.visible.toggle();
			expect(notificationBarVm.visible()).toBe(true);
		});
	});
});