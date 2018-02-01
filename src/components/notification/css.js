"use strict";

module.exports = function(colors) {
	console.log(colors);
	var cssTemplate = `
		.notification-handler {
			position: absolute;
			top: 0;
			width: 100%;
			z-index: 1000;
			box-sizing: border-box;
		}

		.notification-handler .notification {
			width: 100%;
			text-align: center;
			padding: 11px 12px 10px 16px;
			display: flex;
			justify-content: center;
			position: relative;
			color: ${colors.white};
		}

		.notification-handler .notification .message {
			font-family: "Open Sans";
			font-size: 16px;
			letter-spacing: 0.4px;
		}

		.notification-handler .notification knob-button {
			position: absolute;
			right: 40px;
			top: 9px;
		}

		.notification-handler .notification .knob-button, .loader {
			background-color: transparent;
			border: none;
			outline: none;
			padding: 0;
		}

		.notification-handler .notification .loader {
			background-size: contain;
			height: 30px;
			width: 30px;
			opacity: 0.5;
			margin-top: -6px;
			margin-left: 15px;
		}

		.notification-handler .notification .knob-button svg {
			fill: ${colors.white};
		}

		.notification-handler .notification.variation-success {
			background-color: ${colors.success};
		}

		.notification-handler .notification.variation-error {
			background-color: ${colors.error};
		}

		.notification-handler .notification.variation-warning {
			background-color: ${colors.warning};
		}

		.notification-handler .notification.variation-loading {
			color: #444444;
			background-color: ${colors.darkGray};
		}

		.notification-handler .notification.variation-loading .knob-button svg {
			fill: #444444;
		}
	`;

	return cssTemplate;
};