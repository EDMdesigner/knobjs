<link rel="stylesheet" href="examples/knob.min.css">

# knobjs
A component library for knockout.js


## knob-tabs

With the **knob-tabs** component, you can easily create tabbed user interfaces. This component is special in the sense that it works only if you add **knob-tab** components as child components. The params of the **knob-tab** components will be applied to a **knob-radio** component, which will be responsible for selecting the visible tab.

### Params

defaultTab - you can set the 0 based index of the default tab.

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





<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>
<script src="examples/knob.built.js"></script>
