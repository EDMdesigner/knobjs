var ko = require("knockout");
var modalCore = require("./core");

describe("Modal", function() {

	describe("- with invalid config", function() {
		var mockBase = {};
		var createModal = modalCore({
			ko: ko,
			base: mockBase
		});

		it("missing config", function() {
			expect(createModal).toThrowError("config is mandatory!");
		});

		it("invalid visible type", function() {
			expect(function() {
				createModal({
					visible: "text",
					title: "style",
					icon: "string"
				});
			}).toThrowError("config.visible must be an observable");
		});
	});


	describe("- with valid config", function() {
		var createModal;
		var modalVm;

		beforeEach(function() {
			createModal = modalCore({
				ko: ko
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
			title: "randomTitle",
			style: style,
			icon: "randomIcon"
		};


		it("toggle true or false", function() {
			modalVm = createModal(config);

			expect(modalVm.visible()).toBe(false);
			modalVm.visible.toggle();
			expect(modalVm.visible()).toBe(true);
		});
	});

});