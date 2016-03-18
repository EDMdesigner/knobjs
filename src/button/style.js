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
				"color": theme.primaryActiveButtonFontColor,
				"fill": theme.primaryActiveButtonFontColor
			},
			"disabled": {
				"backgroundColor": theme.disabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		},
		"tab": {
			"default": {
				"borderColor": theme.inputText,
				"borderBottomColor": theme.inputText,
				"backgroundColor": theme.disabledButtonBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"hover": {
				"borderColor": theme.inputText,
				"borderBottomColor": theme.inputText,
				"backgroundColor": theme.baseHoverBg,
				"color": theme.baseButtonFontColor,
				"fill": theme.baseButtonFontColor
			},
			"active": {
				"borderColor": theme.inputText,
				"borderBottomColor": theme.inputBg,
				"backgroundColor": theme.inputBg,
				"color": theme.inputText,
				"fill": theme.inputText
			},
			"disabled": {
				"borderColor": theme.baseButtonFontColor,
				"borderBottomColor": theme.disabledButtonBg,
				"backgroundColor": theme.DisabledButtonBg,
				"color": theme.disabledButtonColor,
				"fill": theme.disabledButtonColor
			}
		}
	};
};
