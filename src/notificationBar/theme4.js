module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.black,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"info": {
			"default": {
				"backgroundColor": theme.info.background,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.success.background,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.warning.background,
				"color": theme.white,
				"fill": theme.white
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.error.background,
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};