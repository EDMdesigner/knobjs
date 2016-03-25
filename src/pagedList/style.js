module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.mediumGray
			},
			"hover": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.black
			},
			"active": {
				"color": theme.mediumGray,
				"fill": theme.mediumGray
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
