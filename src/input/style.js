module.exports = function createStyleConfig(theme) {
	return {
		"default": {
			"default": {
				"backgroundColor": theme.inputBg,
				"color": theme.inputText,
				"border-color": theme.inputBorder
			},
			"hover": {
				"backgroundColor": theme.inputBg,
				"color": theme.inputText,
				"border-color": theme.inputText
			},
			"active": {
				"backgroundColor": theme.inputBg,
				"color": theme.inputActiveColor,
				"fill": theme.inputActiveColor
			},
			"disabled": {
				"backgroundColor": theme.inputBorder,
				"color": theme.inputDisabledColor,
				"fill": theme.inputActiveColor
			}
		}
	};
};
