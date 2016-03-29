var ko = require("knockout");
var createPagination = require("../../src/pagination/vm");

describe("Pagination", function() {

	describe("invalid config", function() {

		it("config.currentPage out of range should work", function() {
			var pagination = createPagination({
				currentPage: 99
			});

			expect(pagination.currentPage()).toBe(9);
		});

		it("if config.afterHead present, it should be larger than zero", function() {
			expect(function() {
				createPagination({
					afterHead: 0
				}).toThrowError("config.afterHead must be larger than zero");
			});
		});

		it("if config.beforeTail present, it should be larger than zero", function() {
			expect(function() {
				createPagination({
					beforeTail: 0
				}).toThrowError("config.beforeTail must be larger than zero");
			});
		});

		it("if config.beforeCurrent present, it should be larger than zero", function() {
			expect(function() {
				createPagination({
					beforeCurrent: 0
				}).toThrowError("config.beforeCurrent must be larger than zero");
			});
		});

		it("if config.afterCurrent present, it should be larger than zero", function() {
			expect(function() {
				createPagination({
					afterCurrent: 0
				}).toThrowError("config.afterCurrent must be larger than zero");
			});
		});

	});

	describe("valid config", function() {

		it("Interface", function() {
			var pagination = createPagination();

			expect(ko.isObservable(pagination.pageSelectors)).toBe(true);
			expect(ko.isObservable(pagination.first)).toBe(true);
			expect(ko.isObservable(pagination.last)).toBe(true);
			expect(ko.isObservable(pagination.next)).toBe(true);
			expect(ko.isObservable(pagination.prev)).toBe(true);
			expect(ko.isObservable(pagination.currentPage)).toBe(true);
			expect(ko.isObservable(pagination.numOfPages)).toBe(true);
		});

		describe("Step Tests", function() {
			it("Empty config", function() {
				var pagination = createPagination();

				var description = {
					labels: [1, 2, 3, "...", 8, 9, 10],
					currentPage: 1,
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// NEXT
				pagination.next().selectPage();
				var description = {
					labels: [1, 2, 3, 4, "...", 8, 9, 10],
					currentPage: 2,
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// NEXT
				pagination.next().selectPage();
				var description = {
					labels: [1, 2, 3, 4, 5, "...", 8, 9, 10],
					currentPage: 3,
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// CURRENTPAGE => 6
				pagination.currentPage(5);
				var description = {
					labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					currentPage: 6,
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// LAST
				pagination.last().selectPage();
				var description = {
					labels: [1, 2, 3, "...", 8, 9, 10],
					currentPage: 10, // Label value
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// PREV
				pagination.prev().selectPage();
				var description = {
					labels: [1, 2, 3, "...", 7, 8, 9, 10],
					currentPage: 9, // Label value
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// PREV
				pagination.prev().selectPage();
				var description = {
					labels: [1, 2, 3, "...", 6, 7, 8, 9, 10],
					currentPage: 8, // Label value
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// FIRST
				pagination.first().selectPage();
				var description = {
					labels: [1, 2, 3, "...", 8, 9, 10],
					currentPage: 1, // Label value
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				// CURRENTPAGE => 7
				pagination.currentPage(6);
				var description = {
					labels: [1, 2, 3, "...", 5, 6, 7, 8, 9, 10],
					currentPage: 7,
					numOfPages: 10
				};

				checkSelectors(pagination, description);
			});

			it("With 30 pages", function() {
				var pagination = createPagination({
					numOfPages: ko.observable(30),
					afterHead: 4,
					beforeTail: 4,
					beforeCurrent: 4,
					afterCurrent: 4
				});

				var description = {
					labels: [1, 2, 3, 4, 5, "...", 26, 27, 28, 29, 30],
					currentPage: 1,
					numOfPages: 30
				};

				checkSelectors(pagination, description);

				// NEXT
				pagination.next().selectPage();
				var description = {
					labels: [1, 2, 3, 4, 5, 6, "...", 26, 27, 28, 29, 30],
					currentPage: 2,
					numOfPages: 30
				};

				checkSelectors(pagination, description);

				// PAGE 15
				pagination.currentPage(14);
				var description = {
					labels: [1, 2, 3, 4, 5, "...", 11, 12, 13, 14, 15, 16, 17, 18, 19, "...", 26, 27, 28, 29, 30],
					currentPage: 15,
					numOfPages: 30
				};

				// PAGE 20
				pagination.currentPage(19);
				var description = {
					labels: [1, 2, 3, 4, 5, "...", 16, 17, 18, 19, 20, 21, 22, 23, 24, "...", 26, 27, 28, 29, 30],
					currentPage: 20,
					numOfPages: 30
				};

				checkSelectors(pagination, description);

				// LAST
				pagination.last().selectPage();
				var description = {
					labels: [1, 2, 3, 4, 5, "...", 26, 27, 28, 29, 30],
					currentPage: 30,
					numOfPages: 30
				};

				checkSelectors(pagination, description);

				// 2x PREV
				pagination.prev().selectPage();
				pagination.prev().selectPage();
				var description = {
					labels: [1, 2, 3, 4, 5, "...", 24, 25, 26, 27, 28, 29, 30],
					currentPage: 28,
					numOfPages: 30
				};

				checkSelectors(pagination, description);

				// FIRST
				pagination.first().selectPage();
				var description = {
					labels: [1, 2, 3, 4, 5, "...", 26, 27, 28, 29, 30],
					currentPage: 1,
					numOfPages: 30
				};

				checkSelectors(pagination, description);
			});

			it("next and prev should not out index", function() {
				var pagination = createPagination();

				pagination.prev().selectPage();

				var description = {
					labels: [1, 2, 3, "...", 8, 9, 10],
					currentPage: 1,
					numOfPages: 10
				};

				checkSelectors(pagination, description);

				pagination.last().selectPage();
				pagination.next().selectPage();

				var description = {
					labels: [1, 2, 3, "...", 8, 9, 10],
					currentPage: 10,
					numOfPages: 10
				};

				checkSelectors(pagination, description);

			});
		});



		function checkSelectors(pagination, description) {
			var selectors = pagination.pageSelectors();

			var disabled = [];

			for (var i = 0; i < description.labels.length; i += 1) {
				if (description.labels[i] === description.currentPage || description.labels[i] === "...") {
					disabled.push(i);
				}
			}

			expect(pagination.currentPage()).toBe(description.currentPage - 1);
			expect(pagination.numOfPages()).toBe(description.numOfPages);
			expect(selectors.length).toBe(description.labels.length);

			var disabledIdx = 0;

			for (var i = 0; i < description.labels.length; i += 1) {
				expect(selectors[i].label).toBe(description.labels[i]);
				expect(typeof selectors[i].selectPage).toBe("function");

				if (disabled.indexOf(i) >= 0) {
					expect(selectors[i].state).toBe("disabled");
					disabledIdx += 1;
				} else {
					expect(selectors[i].state).toBe("default");
				}
			}

			// console.log();
			// for (var i = 0; i < selectors.length; i += 1) {
			// 	process.stdout.write(selectors[i].label + " ");
			// }
			// console.log();
		}
	});
});
