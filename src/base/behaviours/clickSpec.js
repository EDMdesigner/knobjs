var ko = require("knockout");
var clickCore = require("../../behaviours/clickCore");

describe("Click behaviour", function() {
	var mockKo = {
		isObservable: function() {
			return true;
		}
	};

	describe("with invalid config", function() {
		it("missing config", function() {
			var clickBehaviour = clickCore({
				ko: ko,
				window: {}
			});

			expect(clickBehaviour).toThrowError("vm is mandatory!");
		});

		it("state not observable", function() {
			var clickBehaviour = clickCore({
				ko: ko,
				window: {}
			});

			var mockVm = {
				state: "notAnObservable"
			};
			
			expect(function() {
				clickBehaviour(mockVm);
			}).toThrowError("vm.state has to be a knockout observable!");
		});
	});

	describe("with valid config", function() {
		var mockVm;
		var clickBehaviour;
		var mockWindow;
		beforeEach(function() {
			mockVm = {
				state: ko.observable("default")
			};

			mockWindow = {
				addEventListener: function(eventName, callback) {
					setTimeout(function() {
						callback();
					}, 0);
				},
				removeEventListener: function() {

				}
			};

			clickBehaviour = clickCore({
				ko: mockKo,
				window: mockWindow
			});

			spyOn(mockWindow, "addEventListener").and.callThrough();
			spyOn(mockWindow, "removeEventListener");

			clickBehaviour(mockVm);

			spyOn(mockVm.eventHandlers, "mouseup").and.callThrough();
		});

		//interface check;
		it("eventHandlers are functions, state is ko.observable", function() {
			expect(typeof mockVm.eventHandlers.mousedown).toBe("function");
			expect(typeof mockVm.eventHandlers.mouseup).toBe("function");
			expect(ko.isObservable(mockVm.state)).toBe(true);
		});
		


		//mousedown disabled
		it("not call addEventlistener", function() {
			mockVm.state("disabled");
			mockVm.eventHandlers.mousedown();

			expect(mockVm.state()).toBe("disabled");
			expect(mockWindow.addEventListener).not.toHaveBeenCalled();
		});

		//mousedown non-disabled
		it("call addEventListener, mouseUp and removeEventListener", function(done) {
			mockVm.eventHandlers.mousedown();

			expect(mockVm.state()).toBe("active");
			expect(mockWindow.addEventListener).toHaveBeenCalled();

			setTimeout(function() {
				expect(mockWindow.removeEventListener).toHaveBeenCalled();
				expect(mockVm.state()).toBe("default");
				done();
			}, 1);
		});

		//mouseup disabled
		it("vm.state() remains disabled", function() {
			mockVm.state("disabled");
			mockVm.eventHandlers.mouseup();

			expect(mockVm.state()).toBe("disabled");
		});

		//mouseup non-disabled
		it("vm.state() changed to hover", function() {
			mockVm.eventHandlers.mouseup();

			expect(mockVm.state()).toBe("hover");
		});
	});
});
