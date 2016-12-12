module.exports = function createStyleConfig(theme) {
	var style = {
		"tab": {
			"default": {
				backgroundColor: theme.colors.lightGray
			},
			"hover": {
				backgroundColor: theme.colors.lightGray
			},
			"active": {
				backgroundColor: theme.colors.lightGray
			},
			"disabled": {
				backgroundColor: theme.colors.lightGray
			}
		},
		"tab-transparent": {
			"default": {
				backgroundColor: "transparent"
			},
			"hover": {
				backgroundColor: "transparent"
			},
			"active": {
				backgroundColor: "transparent"
			},
			"disabled": {
				backgroundColor: "transparent"
			}
		}
	};

	return style;
};