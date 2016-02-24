module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.baseBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.baseHoverBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"active": {
				"backgroundColor": theme.baseActiveBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.DisabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		},
		"primary": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"hover": {
				"backgroundColor": theme.primaryHoverBg,
				"color": theme.primaryHoverButtonFontColor,
				"fill": theme.primaryHoverButtonFontColor
			},
			"active": {
				"backgroundColor": theme.primaryActiveBg,
				"color": theme.activeButtonFontColor,
				"fill": theme.activeButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.disabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		}
	};
};
