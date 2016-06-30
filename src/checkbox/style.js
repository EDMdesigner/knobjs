module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"fill": tinycolor(theme.secondaryColor).darken().darken().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.secondaryColor).darken().toString()
			},
			"disabled": {
				"backgroundColor": theme.mediumGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};