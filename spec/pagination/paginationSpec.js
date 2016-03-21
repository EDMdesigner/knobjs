var ko =  require("knockout");
var createPagination = require("../../src/pagination/vm");

var afterHead =  1;
var beforeTail =  1;
var beforeCurrent =  1;
var afterCurrent =  1;
var currentPage;
var numOfPages;


describe("Pagination", function() {

	describe("invalid config", function() {

		it("config.currentPage is not an observable", function() {
			expect(function() {
				createPagination({
					currentPage: 1
				}).toThrowError("currentPage has to be an observable");
			});
		});

		it("config.currentPage out of range", function() {

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
		it("empty config", function() {

			var pagination = createPagination();

			var pageSelectors = pagination.pageSelectors();

			// for (var i = 0; i < pageSelectors.length; i++) {
			// 	console.log(pageSelectors[i].label)
			// }
			expect(pageSelectors.length).toBe(7);
			expect(pageSelectors[0].label).toBe(1);
			expect(pageSelectors[0].state).toBe("disabled");
			expect(typeof pageSelectors[0].selectPage).toBe("function");


		});

		describe("behaviours", function() {

			it("set current page with normalize", function() {
				
			});

			it("pageSelectors correct", function() {
				
			});

			it("next", function() {
				
			});

			it("prev", function() {
				
			});

			it("first", function() {
				
			});

			it("last", function() {
				
			});
		});
	});
});
