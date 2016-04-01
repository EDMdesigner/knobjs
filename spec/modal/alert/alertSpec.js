// var ko = require("knockout");
// var createAlert = require("../../../src/modal/alert/vm");

// describe("Modal", function() {

// 	describe("- with invalid config", function() {
// 		it("missing config", function() {
// 			expect(createAlert).toThrowError("config is mandatory!");
// 		});

// 		it("invalid visible type", function() {
// 			expect(function() {
// 				createAlert({
// 					visible: "text",
// 					title: "style",
// 					icon: "string"
// 				});
// 			}).toThrowError("config.visible must be an observable");
// 		});
// 	});


// 	describe("- with valid config", function() {

// 		var style = {
// 			default: {
// 				default: {
// 					background: "#001",
// 					color: "#001",
// 					fill: "#001"
// 				}
// 			}
// 		};

// 		var config = {
// 			visible: ko.observable(false),
// 			title: "randomTitle",
// 			style: style,
// 			icon: "randomIcon"
// 		};

// 		var modalVm = createAlert(config);

// 		it("toggle true or false", function() {
// 			expect(modalVm.visible()).toBe(false);
// 			modalVm.visible.toggle();
// 			expect(modalVm.visible()).toBe(true);
// 		});
// 	});

// });
