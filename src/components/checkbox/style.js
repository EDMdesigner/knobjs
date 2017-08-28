module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"fill": theme.black
			},
			"hover": {
				"fill": tinycolor(theme.black).lighten().lighten().toString()
			},
			"active": {
				"fill": tinycolor(theme.black).lighten().lighten().lighten().lighten().toString()
			},
			"disabled": {
				"fill": theme.darkGray
			}
		}
	};
};