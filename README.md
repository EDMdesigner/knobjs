# knobjs
A component library for knockout.js

Components communicate through ko.observables.

Dependency: superdata


## knob-button

This is one of the most basic components in knobjs. It works like you would expect it from a button. If you click on it, something will be triggered. This is why most of the components in knobjs are using this element. Each components where some kind of changes should be triggered by a click are implemented with knob-buttons.

### Params

Param | Type | Required | Default value | Description
---|---|---|---|---
variation | string | No | "default" | The variation of the button. See the [style](#styling-knob-components) section.
label | string | Partially ** | | The text which will be written on the button.
iconLeft | string | Partially ** | | The id of the icon on the left of the label.
iconRight | string | Partially ** | | The id of the icon on the right of the label
icon | string | Partially ** | | This is a synonim for iconLeft.
click | function | No | | This is the callback which will be called on click.

** At least one of these params has to be given, otherwise an error will be thrown. It's because you probably don't want to create a totally empty button.


### Example

```html
<knob-button class="button--sm" params="
	label: 'Search',
	variation: 'primary',
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

This is the other most basic component in knobjs. It's just a simple imput, but you can style it in the [knob way](#styling-knob-components).

### Params

Param | Type | Required | Default value | Description
---|---|---|---|---
variation | string | No | "default" | The variation of the button. See the [style](#styling-knob-components) section.
type | string | No | "text" | The type of the input. (Eg.: 'password')
value | ko.observable | Yes | | This is the observable in which the value will be written. If you want to use the value of the input, then you must give it as a parameter.
hasFocus | ko.observable (boolean) | No | ko.observable (false) | With this observable, you can programmatically set the focus to this input.


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

This component is built on top of the knob-button component and it implements a radio button behaviour. This means that you can select one of it's elements and only one element can be selected from the group. Since it is composed from knob-button elements, you can add icons and labels to it's elements.

### Params

Param | Type | Required | Default value | Description
---|---|---|---|---
group | string | Yes | | This value will indicate in which group the buttons will be. You can connect multiple knob-radios by putting them into the same group.
selected | ko.observable | No | | The selected element will be put into this observable.
selectedIdx | ko.observable (number) | No | | The selected index will be written into this observable. Also, you can set the default selection by giving a value to this observable.
items | Array | Yes | | You can configure the buttons within the component, so every parameter which you can pass to buttons are valid in this array. Also, there is an extra value parameter.

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

This component is also composed of knob-buttons. Therefore very element can have it's icon and label. It also can have an icon on the right, which is usually a caret pointing down to indicate the options will be visible if you click on it. In a sense, it's very similar to the knob-radio element.

### Params

Param | Type | Required | Default value | Description
---|---|---|---|---
selected | ko.observable | Yes | | The selected element. This is not visible in the dropdown list.
rightIcon | string | No | | The icon on the right of the selected element. Should be a caret to indicate that something will appear on the bottom if you click on it.
items | Array | Yes | | The items in the dropdown. They are configured just like buttons and they also can have a value property.

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

It's a quite common task to edit a short text. This component has one major boolean state variable, the editMode. If the edit mode is false, then the text value is shown as a text node and there is an edit button next to it. If you click on the edit mode, then it's replaced with a knob-input and a save and a cancel button. The save and cancel functionality can be triggered with pressing enter and the esc key.

### Params

Param | Type | Required | Default value | Description
---|---|---|---|---
value | ko.observable | Yes | | The initial value is read from this observable and the changes will be written back to it. (Only if you save the changes.)

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

This component is used in the knob-paged-list component. It's basically responsible for calculating the actual number of pages based on the number of items and the items per page value. This value is selected from a dropdown list.

### Params

Param | Type | Required | Default value | Description
---|---|---|---|---
numOfItems | ko.observable (number) | Yes | | The number of items in a result set.
itemsPerPage | ko.observable (number) | Yes | | The number of items on a page.
numOfPages | ko.observable (number) | Yes | | The calculated number of pages, which are based on the previous two values.
itemsPerPageList | Array | Yes | | The available numbers of items which will show up in the dropdown.

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
