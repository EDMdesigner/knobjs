module.exports = function(dependencies) {
	if(!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if(!dependencies.base) {
		throw new Error("dependencies.base is mandatory!");
	}

	var base = dependencies.base;
	var ko = dependencies.ko;

	function createTab(config, componentInfo) {
		config = config || {};
		config.component = "tab";
		config.variation = config.variation || "tab";
		config.state = "active";

		var label = ko.isObservable(config.label) ? config.label : ko.observable(config.label);
		var icon = ko.isObservable(config.icon) ? config.icon : ko.observable(config.icon);
		var leftIcon = ko.isObservable(config.leftIcon) ? config.leftIcon : ko.observable(config.leftIcon);
		var rightIcon = ko.isObservable(config.rightIcon) ? config.rightIcon : ko.observable(config.rightIcon);

		var node = componentInfo.element;
		var tabsData = config.tabsData;

		var tabData = createTabData();
		var index = config.getIndex(node);
		if (index > -1) {
			tabsData.splice(index, 0, tabData);
		}

		var vm = base(config);

		function createTabData() {
			var tab = {
				label: label,
				icon: icon,
				leftIcon: leftIcon,
				rightIcon: rightIcon
			};

			Object.defineProperty(tab, "index", {
				get: function() {
					return tabsData.indexOf(tab);
				}
			});

			return tab;
		}

		vm.dispose = function() {
			console.log("dispose from vm");
		};
		
		return vm;
	}

	createTab.prototype.dispose = function() {
		console.log("dispose from prototype");
	};

	return createTab;
};


