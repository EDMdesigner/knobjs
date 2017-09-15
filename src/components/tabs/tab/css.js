"use strict";

module.exports = function(config) {

	let cssTemplate =`
.tab {
		background-color: ${ config.lightGray };
}	
.tab-transparent{
	background-color: transparent;
}
`;

	return cssTemplate;
};