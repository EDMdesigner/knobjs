module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderColor": "blue"
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderColor": theme.darkGray
			},
			"active": {
				"backgroundColor": theme.white,
				"color": theme.primary,
				"fill": theme.primary
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		}
	};
};
 