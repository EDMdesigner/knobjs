module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"border-color": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"color": theme.black,
				"border-color": tinycolor(theme.mediumGray).darken.toString()
			},
			"active": {
				"color": tinycolor(theme.mediumGray).darken.toString(),
				"fill": tinycolor(theme.mediumGray).darken.toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.black
			},
			"success": {
				"backgroundColor": theme.successColor,
				"color": theme.white,
				"fill": theme.white
			},
			"error": {
				"backgroundColor": theme.alertColor,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};
