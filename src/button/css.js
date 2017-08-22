var tinycolor = require("tinycolor2");
var createColorShades = require("../utils/colorShades");

module.exports = function(config) {

	function createButtonStateColors(color, className) {
		var colorVersions = createColorShades(color);

		var textColor = tinycolor(color).isDark() ? tinycolor("white") : tinycolor("black");
		var fillColor = tinycolor(color).isDark() ? tinycolor("white").darken() : tinycolor("black").lighten();
		return `
			${ className.length > 0 ? ".variation-" + className + " " : "" }.knob-button {
				background-color: ${ tinycolor(color) };
				border-color: ${ colorVersions.color3 };
				color: ${ textColor };
				fill: ${ fillColor };
			}
			${ className.length > 0 ? ".variation-" + className + " " : "" }.knob-button:hover {
				background-color: ${ colorVersions.color3 };
				border-color: ${ colorVersions.color5 };
				color: ${ textColor };
				fill: ${ fillColor };
			}
			${ className.length > 0 ? ".variation-" + className + " " : "" }.knob-button:active {
				background-color: ${ colorVersions.color4 };
				border-color: ${ colorVersions.color6 };
				color: ${ textColor };
				fill: ${ fillColor };
			}
			${ className.length > 0 ? ".variation-" + className + " " : "" }.knob-button:disabled {
				background-color: ${ tinycolor("gray").lighten() };
				border-color: ${ tinycolor("gray").darken() };
				color: ${ textColor };
				fill: ${ fillColor };
			}`;
	}

	var defaultButtonColors = createButtonStateColors(config.default, "");
	var primaryButtonColors = createButtonStateColors(config.primary, "primary");
	var secondaryButtonColors = createButtonStateColors(config.secondary, "secondary");
	var infoButtonColors = createButtonStateColors(config.info, "info");
	var warningButtonColors = createButtonStateColors(config.warning, "warning");
	var errorButtonColors = createButtonStateColors(config.error, "error");
	var successButtonColors = createButtonStateColors(config.success, "success");



	let cssTemplate = `
		.knob-button {
			line-height: 1.42857;
			font-size: 12px;
			padding: 6px 12px;
			cursor: pointer;
			text-align: center;
			display: inline-block;
			text-align: center;
			touch-action: manipulation;
			border: 1px solid;
		}
		.knob-button .icon-wrapper .icon {
			width: 20px;
			height: 20px;
			vertical-align: middle;
			line-height: 1;
		}
		.knob-button .img {
			width: 20px;
			height: 20px;
		}
		.button--lg .knob-button {
			padding: 10px 16px;
			font-size: 18px;
			line-height: 1.33333;
		}
		.button--lg .knob-button .icon-wrapper .icon {
			width: 24px;
			height: 24px;
		}
		.button--sm .knob-button {
			padding: 5px 10px;
			font-size: 10px;
			line-height: 1.5;
		}
		.button--sm .knob-button .icon-wrapper .icon {
			width: 13px;
			height: 13px;
		}
		.knob-button:disabled {
			cursor: not-allowed;
		}

		${ defaultButtonColors }
		${ primaryButtonColors }
		${ secondaryButtonColors }
		${ infoButtonColors }
		${ warningButtonColors }
		${ successButtonColors }
		${ errorButtonColors }		
	`;

	return cssTemplate;
};