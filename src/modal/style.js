module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"color": theme.black,
				"border-color": theme.mediumGray
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
