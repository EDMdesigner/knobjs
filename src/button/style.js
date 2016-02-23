module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.baseBg,
				"color": theme.ButtonFontColor,
				"fill": theme.ButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.baseHoverBg,
				"color": theme.ButtonFontColor,
				"fill": theme.ButtonFontColor
			},
			"active": {
				"backgroundColor": theme.baseActiveBg,
				"color": theme.ButtonFontColor,
				"fill": theme.ButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.DisabledButtonBg,
				"color": theme.DisabledButtonColor,
				"fill": theme.DisabledButtonColor
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.ButtonFontColor,
				"fill": theme.ButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.primaryHoverBg,
				"color": theme.ButtonFontColor,
				"fill": theme.ButtonFontColor
			},
			"active": {
				"backgroundColor": theme.primaryActiveBg,
				"color": theme.ButtonFontColor,
				"fill": theme.ButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.DisabledButtonBg,
				"color": theme.DisabledButtonColor,
				"fill": theme.DisabledButtonColor
			}
		}
	};
};
