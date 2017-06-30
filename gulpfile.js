"use strict";

var gulp = require("gulp");
var createSuperGulp = require("edm-supergulp");

var superGulp = createSuperGulp({
	gulp: gulp
});

var packageJson = require("./package.json");
/*
var resourceConfigs = {
	dev: __dirname + "/src/config-superpreview-dev.json",
	staging: __dirname + "/src/config-superpreview-staging.json",
	prod: __dirname + "/src/config-superpreview-prod.json"
};
*/
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
	"spec/**/*Spec.js"
];

var sourceFiles = [
	"src/**/*.js"
];
/*
var localDeps = [
	"./node_modules/knob-js/dist/knob.js",
	"./node_modules/knob-js/dist/knob.min.css",
	"./node_modules/normalize.css/normalize.css",
	"./node_modules/knockout/build/output/knockout-latest.debug.js",
];

var deps = [
	"./src/public/img/ipad-white-portrait-final2.png",
	"./src/public/img/iphone5s-white-portrait-final2.png",
	"./src/public/img/macbookpro-final2.png",
	"./src/public/img/macbookpro-final2b.png"
];
*/
var deployFiles = [
	"!./dist/examples",
	"!./dist/lib",
	"./dist/**/*"
];


//
// //SVG sprite generate
//
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
//
//
// // Watchers
// // ==================================================
// gulp.task("sass:watch", function() {
// 	gulp.watch("./src/**/*.scss", ["sass:dev"]);
// });
//
// gulp.task("js:watch", function() {
// 	gulp.watch(["./src/**/*.js", "./examples/**/*.js", "./src/**/*.html", "./examples/**/*.html", "./src/**/*.json"], ["js:dev"])
// 		.on("change", function(event) {
// 			console.log(event);
// 		});
// });
/*
gulp.task("s3-deploy", function() {
	//console.log(gutil.env);
	if (!gutil.env.s3key || !gutil.env.s3secret || !gutil.env.s3region || !gutil.env.s3bucket) {
		throw new Error("s3key, s3secret, s3region and s3bucket is mandatory! Use command like this: gulp s3-deploy --s3key 'S3 KEY' --s3secret 'S3 SECRET' --s3region 'S3 region' --s3bucket 'S3 bucket'!");
	}

	var s3 = new AWS.S3({
		accessKeyId: gutil.env.s3key,
		secretAccessKey: gutil.env.s3secret,
		region: gutil.env.s3region,
		params: {
			Bucket: gutil.env.s3bucket
		}
	});
	var version = packageJson.version;
	var destFolder = version + "/";
	var files = [
		"./dist/knob.js",
		"./dist/knob.min.css"
	];
	var createUploadFunction = function(currentFile) {
		return function(err, data) {
			if (err) {
				throw new Error(err);
			}
			var putObjectConfig = {
				Key: destFolder + currentFile.replace("./dist/", "").replace("./examples/", "").replace("./", ""),
				Bucket: gutil.env.s3bucket,
				ACL: "public-read",
				Body: data,
				ContentType: mime.lookup(currentFile)
			};
			s3.putObject(putObjectConfig, function(err, awsResult) {
				if (err) {
					throw new Error(err);
				}
				console.log("File '" + currentFile + "' uploaded successfully to S3!");
				console.log(awsResult);
			});
		};
	};

	var params = {
		Bucket: gutil.env.s3bucket,
		Key: destFolder + "editor.js"
	};
	s3.headObject(params, function (err) {
		if (!err || err.code !== "NotFound") {
			var errorMessage = "Version is already published! Change version before deployment! Checked file: '" + params.Key + "'.";
			if (err && err.code) {
				errorMessage += " Returned error when testing: '" + err.code + "' (instead of 'NotFound')";
			}
			throw new Error(errorMessage);
		}

		var currentFile;

		for (var i = 0; i < files.length; i += 1) {
			currentFile = files[i];
			fs.readFile(currentFile, createUploadFunction(currentFile));
		}
	});
});


*/
superGulp.taskTemplates.initPluginTasks({
	packageJson: packageJson,
	coverage: 70,
	deployFolder: packageJson.version,
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
				{files: "./examples/example.html", dest: "./dist/examples"}
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
					minify: true,
					destFolder: "./dist/",
					outputFileName: "knob.js",
					standaloneName: packageJson.name
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
