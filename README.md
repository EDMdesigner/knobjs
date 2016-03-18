# knobjs
A component library for knockout.js

Dependency: superdata


## knob-button

This is one of the most basic components in knobjs. It works like you would expect it from a button. If you click on it, something will be triggered. This is why most of the components in knobjs are using this element. Each components where some kind of changes should be triggered by a click are implemented with knob-buttons.

### Params

Param | Required | Default value | Description
---|---|---|---
variation | No | "default" | The variation of the button. See the [style](#styling-knob-components) section.
label | Partially ** | | The text which will be written on the button.
iconLeft | Partially ** | | The id of the icon on the left of the label.
iconRight | Partially ** | | The id of the icon on the right of the label
icon | Partially ** | | This is a synonim for iconLeft.
click | No | | This is the callback which will be called on click.
** At least one of these params has to be given, otherwise an error will be thrown. It's because you probably don't want to create a totally empty button.


### Example

```html
<knob-button class="button--sm" params="
	label: 'Search',
	variation: 'default',
	icon: '#icon-search',
	click: clickCallback">
</knob-button>

<script>
	ko.applyBindings({
		clickCallback: function() {
			alert("search clicked")
		}
	});
</script>
```

## knob-input

### Params

### Example
```html
<knob-input params="
	type: 'password',
	value: value">
</knob-input>

<script>
	ko.applyBindings({
		value: ko.observable("")
	});
</script>
```

## knob-radio

### Params

### Example
```html
<knob-radio class="knob-radio--inline" params="
	group: 'test',
	selected: selectedElement,
	selectedIdx: selectedIndex,
	items: [
		{icon: '#icon-grid', value: {field: 'id desc', asc: true}},
		{icon: '#icon-list', value: {field: 'id', asc: false}},
		{label: 'Third option', value: {field: 'name', asc: true}}
	]">
</knob-radio>

<script>
	ko.applyBindings({
		selectedElement: ko.observable(),
		selectedIndex: ko.observable(1)
	});
</script>
```

## knob-dropdown

### Params

### Example
```html
<knob-dropdown params="
	selected: selectedElement,
	rightIcon: '#icon-down',
	items: [
		{label: 'id', icon: '#icon-a-z', value: {field: 'id desc', asc: true}},
		{label: 'id', icon: '#icon-z-a', value: {field: 'id', asc: false}},
		{label: 'name', icon: '#icon-a-z', value: {field: 'name', asc: true}},
		{label: 'name', icon: '#icon-z-a', value: {field: 'name', asc: false}}
	]">
</knob-dropdown>

<script>
	ko.applyBindings({
		selectedElement: ko.observable()
	});
</script>
```

## knob-inline-text-editor

### Params

### Example
```html
<knob-inline-text-editor params="
	value: value">
</knob-inline-text-editor>

<script>
	ko.applyBindings({
		value: ko.observable("")
	});
</script>
```

## knob-items-per-page

### Params

### Example
```html
<knob-items-per-page params="
	numOfItems: numOfItems,
	itemsPerPage: itemsPerPage,
	numOfPages: numOfPages,
	itemsPerPageList: [
		10,
		25,
		50,
		100
	]">
</knob-items-per-page>

<script>
	ko.applyBindings({
		numOfItems: ko.observable(1230),
		itemsPerPage: ko.observable(10),
		numOfPages: ko.observable()
	});
</script>
```

## knob-pagination

### Params

### Example
```html
<knob-pagination params="
	numOfPages: numOfPages
	afterHead: 3,
	beforeTail: 3,
	beforeCurrent: 4,
	afterCurrent: 4">
</knob-pagination>

<script>
	ko.applyBindings({
		numOfPages: ko.observable(100)
	});
</script>
```

## knob-paged-list

### Params

### Example
```html
<knob-paged-list params="store: store, search: 'title', sort: ['id', 'name']">
	<div>
		<span data-bind="text: data.id"></span>
		<span data-bind="text: data.email"></span>
		<span data-bind="text: data.name"></span>
		<span data-bind="text: data.title"></span>
	</div>
</knob-paged-list>

<script>
	ko.applyBindings({
		store: store //where store is a superdata.store.store instance
	});
</script>
```


## knob-tabs

With the **knob-tabs** component, you can easily create tabbed user interfaces. This component is special in the sense that it works only if you add **knob-tab** components as child components. The params of the **knob-tab** components will be applied to a **knob-radio** component, which will be responsible for selecting the visible tab.

### Params

defaultTab - you can set the 0 based index of the default tab.

Also, the knob-tab child elements has to have at least one of the following parameters:
 - label
 - icon (a synonim for leftIcon)
 - leftIcon 
 - rightIcon

### Example
``` html
<knob-tabs params="defaultTab: 1">
	<knob-tab params="label: 'tab1', icon: '#icon-grid'">
		content1
	</knob-tab>
	<knob-tab params="icon: '#icon-grid'">
		content2
	</knob-tab>
	<knob-tab params="label: 'tabX'">
		content3
	</knob-tab>
</knob-tabs>
```

## Styling knob components
Awesomeness!
