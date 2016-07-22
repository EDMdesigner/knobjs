var tinycolor = require("tinycolor2");

module.exports = function createStyleConfig(config) {
	var colors = config.colors;

	return {
		"default": {
			"default": {
				"backgroundColor": colors.secondary,
				"borderColor": colors.border,
				"color": colors.black,
				"fill": colors.black
			},
			"hover": {
				"backgroundColor": tinycolor(colors.secondary).lighten().toString(),
				"borderColor": tinycolor(colors.border).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.secondary).darken().toString(),
				"borderColor": tinycolor(colors.border).darken().toString()
			},
			"disabled": {
				"backgroundColor": colors.mediumGray,
				"color": colors.lightGray,
				"fill": colors.lightGray
			}
		},
		"primary": {
			"default": {
				"backgroundColor": colors.primary,
				"borderColor": colors.primary,
				"color": colors.white,
				"fill": colors.white
			},
			"hover": {
				"backgroundColor": tinycolor(colors.primary).lighten().toString(),
				"borderColor":tinycolor(colors.primary).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.primary).darken().toString(),
				"borderColor": tinycolor(colors.primary).darken().toString()
			},
			"disabled": {
				"backgroundColor": colors.lightGray,
				"color": colors.darkGray,
				"fill": colors.darkGray
			}
		},
		"tab": {
			"default": {
				"borderColor": colors.border,
				"backgroundColor": colors.darkGray,
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"hover": {
				"borderColor": colors.border,
				"backgroundColor": tinycolor(colors.secondary).lighten().toString(),
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"active": {
				"backgroundColor": colors.lightGray,
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"disabled": {
				"backgroundColor": colors.white,
				"color": colors.lightGray,
				"fill": colors.lightGray
			}
		},
		"pagination": {
			"default": {
				"borderColor": colors.lightGray,
				"backgroundColor": colors.lightGray,
				"color": colors.black,
				"fill": colors.black
			},
			"hover": {
				"backgroundColor": tinycolor(colors.lightGray).lighten().toString(),
				"borderColor": tinycolor(colors.lightGray).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.lightGray).darken().toString(),
				"borderColor": tinycolor(colors.lightGray).darken().toString()
			},
			"disabled": {
				"borderColor": colors.white,
				"backgroundColor": colors.white,
				"color": colors.mediumGray,
				"fill": colors.mediumGray
			}
		},
		"accordion": {
			"default": {
				"borderColor": colors.border,
				"backgroundColor": colors.white,
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"hover": {
				"borderColor": colors.border,
				"backgroundColor": colors.white,
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"active": {
				"borderColor": colors.border,
				"backgroundColor": colors.lightGray,
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"disabled": {
				"borderColor": colors.white,
				"backgroundColor": colors.white,
				"color": colors.mediumGray,
				"fill": colors.mediumGray
			}
		},
		"dropdown": {
			"default": {
				"borderColor": colors.border,
				"backgroundColor": colors.white,
				"color": colors.black,
				"fill": colors.black
			},
			"hover": {
				"backgroundColor": colors.lightGray
			},
			"active": {
				"backgroundColor": colors.white,
			},
			"disabled": {
				"backgroundColor": colors.white,
				"color": colors.lightGray,
				"fill": colors.lightGray
			}
		},
		"dropdown-option": {
			"default": {
				"borderColor": colors.border,
				"backgroundColor": colors.white,
				"color": colors.black,
				"fill": colors.black
			},
			"hover": {
				"backgroundColor": colors.lightGray
			},
			"active": {
				"backgroundColor": colors.white,
			},
			"disabled": {
				"backgroundColor": colors.white,
				"color": colors.lightGray,
				"fill": colors.lightGray
			}
		},
		"modalHead": {
			"default": {
				"backgroundColor": colors.transparent,
				"borderColor": colors.transparent,
				"color": colors.black,
				"fill": colors.black
			},
			"hover": {
				"backgroundColor": colors.transparent,
				"borderColor": colors.transparent
			},
			"active": {
				"backgroundColor": colors.transparent,
				"borderColor": colors.darkGray
			}
		},
		"info": {
			"default": {
				"backgroundColor":colors.info,
				"borderColor": colors.info,
				"color": colors.white,
				"fill": colors.white
			},
			"hover": {
				"backgroundColor": tinycolor(colors.info).lighten().toString(),
				"borderColor": tinycolor(colors.info).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.info).darken().toString(),
				"borderColor": tinycolor(colors.info).darken().toString()
			}
		},
		"success": {
			"default": {
				"backgroundColor": colors.success,
				"borderColor": colors.success,
				"color": colors.white,
				"fill": colors.white
			},
			"hover": {
				"backgroundColor": tinycolor(colors.success).lighten().toString(),
				"borderColor": tinycolor(colors.success).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.success).darken().toString(),
				"borderColor": tinycolor(colors.success).darken().toString()
			}
		},
		"warning": {
			"default": {
				"backgroundColor": colors.warning,
				"borderColor": colors.warning,
				"color": colors.white,
				"fill": colors.white
			},
			"hover": {
				"backgroundColor": tinycolor(colors.warning).lighten().toString(),
				"borderColor": tinycolor(colors.warning).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.warning).darken().toString(),
				"borderColor": tinycolor(colors.warning).darken().toString()
			}
		},
		"error": {
			"default": {
				"backgroundColor": colors.error,
				"borderColor": colors.error,
				"color": colors.white,
				"fill": colors.white
			},
			"hover": {
				"backgroundColor": tinycolor(colors.error).lighten().toString(),
				"borderColor": tinycolor(colors.error).lighten().toString()
			},
			"active": {
				"backgroundColor": tinycolor(colors.error).darken().toString(),
				"borderColor": tinycolor(colors.error).darken().toString()
			}
		},
		"cancel": {
			"default": {
				"backgroundColor": colors.lightGray,
				"borderColor": colors.lightGray,
				"color": colors.secondary,
				"fill": colors.secondary
			},
			"hover": {
				"backgroundColor": colors.darkGray,
				"borderColor": colors.darkGray
			},
			"active": {
				"backgroundColor": tinycolor(colors.lightGray).darken().toString(),
				"borderColor": tinycolor(colors.lightGray).darken().toString()
			}
		}
	};
};