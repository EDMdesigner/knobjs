"use strict";

var gulp = require("gulp");
var createSuperGulp = require("edm-supergulp");

var superGulp = createSuperGulp({
	gulp: gulp
});

var packageJson = require("./package.json");

var jsFiles = [
	"./*.js",
	"./src/**/*.js",
	"./spec/**/*.js",
	"./examples/*.js"
];

var jsonFiles = [
	".jshintrc",
	".jscsrc",
	"./package.json",
	"./src/**/*.json",
	"./spec/**/*.json",
	"./examples/*.json"
];

var specFiles = [
	"src/**/spec.js"
];

var sourceFiles = [
	"src/**/*.js"
];

var deployFiles = [
	"!./dist/examples",
	"!./dist/lib",
	"./dist/**/*"
];



//SVG sprite generate

// gulp.task("svg", function () {
// 	var svgs = gulp.src("examples/SVG/*.svg")
// 		.pipe(svgstore({ inlineSvg: true }));
//
// 		function fileContents (filePath, file) {
// 			return file.contents.toString();
// 		}
//
// 	return gulp.src("examples/knob.html")
// 		.pipe(inject(svgs, { transform: fileContents }))
// 		.pipe(gulp.dest("examples/"));
// });

superGulp.taskTemplates.initFrontendTasks({
	packageJson: packageJson,
	coverage: 70,
	deployFolder: "knobjs/" + packageJson.version + "/",
	addPluginTasks: false,
	files: {
		js: jsFiles,
		json: jsonFiles,
		spec: specFiles,
		source: sourceFiles,
		deploy: deployFiles,
	},
	tasks: {
		copy:{
			dev: [
				{files: "./node_modules/normalize.css/normalize.css", dest: "./dist/lib"},
				{files: "./node_modules/knockout/build/output/knockout-latest.debug.js", dest: "./dist/lib"},
				{files: "./examples/example.html", dest: "./dist/examples"},
				{files: "./examples/button.html", dest: "./dist/examples"},
				{files: "./examples/pagination.html", dest: "./dist/examples"},
				{files: "./examples/tabs.html", dest: "./dist/examples"},
				{files: "./examples/pagedList.html", dest: "./dist/examples"},
				{files: "./examples/radio.html", dest: "./dist/examples"},
				{files: "./examples/dropdown.html", dest: "./dist/examples"},
				{files: "./examples/checkbox.html", dest: "./dist/examples"},
				{files: "./examples/infiniteList.html", dest: "./dist/examples"},
				{files: "./examples/misc.html", dest: "./dist/examples"},
				{files: "./examples/modal.html", dest: "./dist/examples"},				
				{files: "./examples/selectablePagedList.html", dest: "./dist/examples"}				
			]
		},
		sass: {
			common: [
				{ files:"./src/main.scss", dest: "./dist", outputFileName: "knob.css"},
			],
			dev: [
				{ files:"./src/main.scss", dest: "./dist/examples", outputFileName: "knob.css"},
				{ files:"./examples/example.scss", dest: "./dist/examples", outputFileName: "example.css"}
			]
		},
		js: {
			common: [
				{
					entries: ["./src/main.js"],
					minify: false,
					destFolder: "./dist/",
					outputFileName: "knob.js",
					standaloneName: "knob"
				}
			],
			dev: [
				{
					entries: ["./examples/main.js"],
					destFolder: "./dist/examples/",
					minify: false,
					outputFileName: "main.js",
					standaloneName: packageJson.name + "Example",
				}
			]
		}
	}
});
