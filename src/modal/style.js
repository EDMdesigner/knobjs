module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.black).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};
