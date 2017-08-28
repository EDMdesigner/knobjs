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
				"backgroundColor": theme.info,
				"color": theme.black,
				"fill": theme.black
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.success,
				"color": theme.black,
				"fill": theme.black
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.warning,
				"color": theme.black,
				"fill": theme.black
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.error,
				"color": theme.black,
				"fill": theme.black
			}
		}
	};
};