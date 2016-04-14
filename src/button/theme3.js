module.exports = function createStyleConfig(theme) {

	var tinycolor = require("tinycolor2");

	return {
		"default": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.secondaryColor,
				"borderRadius": "5px",
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": tinycolor(theme.secondaryColor).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"backgroundColor": theme.mediumGray,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},

		"primary": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.primaryColor,
				"borderRadius": "5px",
				"color": theme.primaryColor,
				"fill": theme.primaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.primaryColor).lighten().toString(),
				"borderColor":tinycolor(theme.primaryColor).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.primaryColor).darken().toString(),
				"borderColor": tinycolor(theme.primaryColor).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"backgroundColor": theme.lightGray,
				"color": theme.darkGray,
				"fill": theme.darkGray
			}
		},
		"tab": {
			"default": {
				"borderColor": theme.white,
				"backgroundColor": theme.white,
				"color": theme.black,
				"borderRadius": "5px 5px 0 0",
				"fill": theme.black
			},
			"hover": {
				"backgroundColor": theme.white,
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"active": {
				"backgroundColor": theme.white,
				"borderColor": tinycolor(theme.secondaryColor).lighten().toString()
			},
			"disabled": {
				"backgroundColor": theme.white,
				"color": theme.lightGray,
				"fill": theme.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.secondaryColor,
				"fill": theme.secondaryColor
			},
			"hover": {
				"backgroundColor": tinycolor(theme.secondaryColor).lighten().toString(),
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.secondaryColor).darken().toString(),
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"disabled": {
				"borderColor": theme.secondaryColor,
				"backgroundColor": theme.white,
				"color": theme.mediumGray,
				"fill": theme.mediumGray
			}
		},
		"modalHead": {
			"default": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor,
				"color": theme.white,
				"fill": theme.white
			},
			"hover": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
			},
			"active": {
				"backgroundColor": theme.secondaryColor,
				"borderColor": theme.secondaryColor
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
				"backgroundColor":theme.white,
				"borderColor": theme.info.text,
				"borderRadius": "5px",
				"color": theme.info.text,
				"fill": theme.info.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.info.text).lighten().toString(),
				"borderColor": tinycolor(theme.info.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.info.text).darken().toString(),
				"borderColor": tinycolor(theme.info.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
		"success": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.success.text,
				"borderRadius": "5px",
				"color": theme.success.text,
				"fill": theme.success.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.success.text).lighten().toString(),
				"borderColor": tinycolor(theme.success.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.success.text).darken().toString(),
				"borderColor": tinycolor(theme.success.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
		"warning": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.warning.text,
				"borderRadius": "5px",
				"color": theme.warning.text,
				"fill": theme.warning.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.warning.text).lighten().toString(),
				"borderColor": tinycolor(theme.warning.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.warning.text).darken().toString(),
				"borderColor": tinycolor(theme.warning.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		},
		"error": {
			"default": {
				"backgroundColor": theme.white,
				"borderColor": theme.error.text,
				"borderRadius": "5px",
				"color": theme.error.text,
				"fill": theme.error.text
			},
			"hover": {
				"backgroundColor": tinycolor(theme.error.text).lighten().toString(),
				"borderColor": tinycolor(theme.error.text).lighten().toString(),
				"color": theme.white,
				"fill": theme.white
			},
			"active": {
				"backgroundColor": tinycolor(theme.error.text).darken().toString(),
				"borderColor": tinycolor(theme.error.text).darken().toString(),
				"color": theme.white,
				"fill": theme.white
			}
		}
	};
};