module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	var defaultButtonStates = {
		"default": {
			"backgroundColor": theme.secondaryColor,
			"borderColor": theme.secondaryColor,
			"color": tinycolor(theme.secondaryColor).isDark() ? theme.white : theme.black,
			"fill": tinycolor(theme.secondaryColor).isDark() ? theme.white : theme.black
		},
		"disabled": {
			"backgroundColor": theme.mediumGray,
			"color": theme.lightGray,
			"fill": theme.lightGray
		}
	};

	if (tinycolor(theme.secondaryColor).isDark()) {
		defaultButtonStates.hover = {
			"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
			"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
		};

		defaultButtonStates.active = {
			"backgroundColor": tinycolor(theme.secondaryColor).lighten().lighten().toString(),
			"borderColor": tinycolor(theme.secondaryColor).lighten().lighten().toString()
		};
	} else {
		defaultButtonStates.hover = {
			"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
			"borderColor": tinycolor(theme.secondaryColor).darken().toString()
		};

		defaultButtonStates.active = {
			"backgroundColor": tinycolor(theme.secondaryColor).darken().darken().toString(),
			"borderColor": tinycolor(theme.secondaryColor).darken().darken().toString()
		};
	}

	return {
		"default": defaultButtonStates,
		"primary": {
			"default": {
				"backgroundColor": theme.primaryColor,
				"borderColor": theme.primaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString(),
				"borderColor":tinycolor(theme.primaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString(),
				"borderColor": tinycolor(theme.primaryColor).darken().toString()
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.darkGray,
				"fill": theme.darkGray
			}
		},
		"tab": {
			"default": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.secondaryColor,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
				"borderColor": theme.white
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.lightGray,
				"backgroundColor": theme.lightGray,
				"color": theme.black,
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": tinycolor(theme.lightGray).lighten().toString(),
				"borderColor": tinycolor(theme.lightGray).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.lightGray).darken().toString(),
				"borderColor": tinycolor(theme.lightGray).darken().toString()
			},
			"disabled": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"dropdown": defaultButtonStates,
		"dropdown-option": defaultButtonStates,
		"modalHead": {
			"default": {
				"backgroundColor": theme.darkGray,
				"borderColor": theme.darkGray,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.mediumGray,
				"borderColor": theme.mediumGray
			},
			"active": {
				"backgroundColor": theme.darkGray,
				"borderColor": theme.darkGray
			}
		},
		"action": {
			"default": {
				"borderColor": theme.info.text,
				"backgroundColor": theme.white,
				"color": theme.info.text,
				"fill": theme.info.text
			},
			"hover": {
				"borderColor": tinycolor(theme.info.text).lighten().toString(),
			},
			"active": {
				"borderColor": tinycolor(theme.info.text).darken().toString(),
			}
		},
		"danger": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.error.text,
				"color": theme.error.text,
				"fill": theme.error.text
			},
			"hover": {
				"borderColor": tinycolor(theme.error.text).lighten().toString(),
			},
			"active": {
				"borderColor": tinycolor(theme.error.text).darken().toString(),
			}
		},
		"info": {
			"default": {
				"backgroundColor":theme.info.background,
				"borderColor": theme.info.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.background).lighten().toString(),
				"borderColor": tinycolor(theme.info.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.background).darken().toString(),
				"borderColor": tinycolor(theme.info.background).darken().toString()
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.success.background,
				"borderColor": theme.success.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.success.background).lighten().toString(),
				"borderColor": tinycolor(theme.success.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.background).darken().toString(),
				"borderColor": tinycolor(theme.success.background).darken().toString()
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.warning.background,
				"borderColor": theme.warning.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.warning.background).lighten().toString(),
				"borderColor": tinycolor(theme.warning.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.background).darken().toString(),
				"borderColor": tinycolor(theme.warning.background).darken().toString()
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.error.background,
				"borderColor": theme.error.background,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": tinycolor(theme.error.background).lighten().toString(),
				"borderColor": tinycolor(theme.error.background).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.background).darken().toString(),
				"borderColor": tinycolor(theme.error.background).darken().toString()
			}
		},
		"cancel": {
			"default": {
				"backgroundColor": theme.darkGray,
				"borderColor": theme.lightGray,
				"color": tinycolor(theme.darkGray).isDark() ? theme.white : theme.black,
				"fill": tinycolor(theme.secondaryColor).isDark() ? theme.white : theme.black
			},
			"hover": {
				"backgroundColor": theme.darkGray,
				"borderColor": theme.darkGray
			},
			"active": {
				"backgroundColor": tinycolor(theme.lightGray).darken().toString(),
				"borderColor": tinycolor(theme.lightGray).darken().toString()
			}
		}
	};
};