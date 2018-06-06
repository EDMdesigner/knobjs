"use strict";

var tinycolor = require("tinycolor2");
var createColorShades = require("../../utils/colorShades");

module.exports = function(config) {

	function createButtonStateColors(color, className) {
		var colorVersions = createColorShades(color);

		var textColor = tinycolor(colorVersions.color2).isDark() ? tinycolor("white") : tinycolor("black");
		return `
			${ className.length > 0 ? ".variation-" + className + " > " : "" }.knob-button {
				background-color: ${ tinycolor(color) };
				border-color: ${ tinycolor(color) };
				color: ${ textColor };
				fill: ${ textColor };
			}
			${ className.length > 0 ? ".variation-" + className + " > " : "" }.knob-button:hover {
				background-color: ${ colorVersions.color2 };
				border-color: ${ colorVersions.color2 };
			}
			${ className.length > 0 ? ".variation-" + className + " > " : "" }.knob-button:active {
				background-color: ${ colorVersions.color4 };
				border-color: ${ colorVersions.color4 };
			}
			${ className.length > 0 ? ".variation-" + className + " > " : "" }.knob-button:disabled {
				background-color: ${ colorVersions.color6 };
				border-color: ${ colorVersions.color6 };
				opacity: 0.6;
				color: white;
				fill: white;
				cursor: not-allowed;
			}`;
	}

	function createLinkButtonShades() {
		return `
			.variation-link > .knob-button {
				background-color: transparent;
				border-color: transparent;
				color: #2ca6f7;
				fill: #2ca6f7;
				padding: 0;
			}
			.variation-link > .knob-button:hover {
				background-color: transparent;
				border-color: transparent;
				color: #82cdff;
				fill: #82cdff;
				padding: 0;
			}
			.variation-link > .knob-button:active {
				background-color: transparent;
				border-color: transparent;
				color: #104b72;
				fill: #104b72;
				padding: 0;
			}
			.variation-link > .knob-button:disabled {
				background-color: transparent;
				border-color: transparent;
				color: #606060;
				fill: #606060;
				cursor: not-allowed;
				padding: 0;
			}`;
	}

	function createGhostButtonShades() {
		return `
			.variation-ghost > .knob-button {
				background-color: rgba(248, 244, 244, 0.36);
				border-color: solid 1px #dddddd;
				color: white;
				fill: white;
			}
			.variation-ghost > .knob-button:hover {
				background-color: rgba(216, 213, 213, 0.72);
				border-color: rgba(216, 213, 213, 0.72);
			}
			.variation-ghost > .knob-button:active {
				background-color: rgba(255, 255, 255, 0.36);
				border-color: #ffffff;
			}
			.variation-ghost > .knob-button:disabled {
				background-color: rgba(248, 244, 244, 0.72);
				border-color: #dddddd;
				opacity: 0.6;
				cursor: not-allowed;
			}`;
	}

	function createLightButtonShades() {
		var lightColorVersions = createColorShades(config.light);
		return `
			.variation-light > .knob-button {
				background-color: ${ lightColorVersions.color1 };
				border: solid 1px ${ lightColorVersions.color1 };
				color: ${ tinycolor(config.primary) };
				fill: ${ tinycolor(config.primary) };
			}
			.variation-light > .knob-button:hover {
				background-color: ${ lightColorVersions.color2 };
				border-color: ${ lightColorVersions.color2 }
			}
			.variation-light > .knob-button:disabled {
				opacity: 0.27;
				cursor: not-allowed;
			}`;
	}

	function createDarkButtonShades() {
		var darkColorVersions = createColorShades(config.dark);
		return `
			.variation-dark .knob-button {
				background-color: ${ darkColorVersions.color1 };
				border: solid 1px ${ darkColorVersions.color1 };
				color: white;
				fill: white;
			}
			.variation-dark .knob-button:hover {
				background-color: ${ darkColorVersions.color2 };
				border-color: ${ darkColorVersions.color2 };
			}
			.variation-dark .knob-button:disabled {
				opacity: 0.27;
				cursor: not-allowed;
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
			position: relative;
		}
		.rounded .knob-button {
			border-radius: 6px;
		}
		.knob-button .icon-wrapper .icon {
			width: 17px;
			height: 17px;
			vertical-align: middle;
			line-height: 1;
		}
		.knob-button .img {
			width: 20px;
			height: 20px;
			vertical-align: middle;
		}
		btn_xsmall{
			height: 30px;
			width: 110px;
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

		.counter {
			position: absolute;
			font-size: 12px;
			border-radius: 3px;
			padding: 2px 4px;
			width: max-content;
			right: -15px;
			bottom: -15px;
			z-index: 1;
		}

		.counter-default .counter {
			background: black;
			color: white;
		}

		.counter-primary .counter {
			background: ${config.secondary};
			color: ${config.primary};
		}

		.counter-secondary .counter {
			background: ${config.primary};
			color: ${config.secondary};
		}

		.counter-light .counter {
			background: ${ config.light };
			color: ${ config.dark };
		}

		.counter-dark .counter {
			background: ${ config.dark };
			color: ${ config.light };
		}

		.counter-warm-gray .counter {
			background: ${ config.warmGray };
			color: ${ config.light };
		}

		.counter-dark-gray .counter {
			background: ${ config.darkGray };
			color: ${ config.light };
		}

		.counter-error .counter {
			background: ${config.error};
			color: white;
		}

		${ defaultButtonColors }
		${ primaryButtonColors }
		${ secondaryButtonColors }
		${ infoButtonColors }
		${ warningButtonColors }
		${ successButtonColors }
		${ errorButtonColors }
		${ createLinkButtonShades() }	
		${ createGhostButtonShades() }	
		${ createDarkButtonShades() }	
		${ createLightButtonShades() }
	`;

	return cssTemplate;
};