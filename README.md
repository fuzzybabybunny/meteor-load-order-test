#Meteor Load Order Test#

##Why##

This was created because Meteor seems to still display anomalous load order results that seem counter to what the official documentation states.

##What##

This Meteor app:

- console logs message when certain scripts are run

- logs the current number of HTML elements on the page at the time the scripts are run

The latter is useful because often we want to run 3rd party scripts that use jQuery. These scripts were not developed with Meteor in mind but nonetheless require all DOM nodes to be loaded in order to run. 

They do so by either being referenced at the very bottom of a traditional web page or by the use of `$('document').ready()`, both of which are ineffective and unreliable when used in a Meteor app.

##Structure of the Templates###

router.js

```javascript
	Router.configure({
		layoutTemplate: 'Layout'
	});
```

layout.html

```html

<template name="Layout">

	<div class="border">
		This is the layout.html

		{{> Header}}
		{{> yield}}
		{{> Footer}}

	</div>

</template>

```

index.html

```html

<template name="Index">

	<div class="border">
		<div>This is the >yield.</div>

		{{> Partial1}}
		{{> Partial2}}

	</div>

</template>

```

##Results##

Open up Chrome Console and go here:

http://load-order-test.meteor.com/

##Analysis##

- `main.js` and `main.html` are actually loaded very soon, seemingly counter to what the documentation says: http://docs.meteor.com/#/full/structuringyourapp
- `Meteor.startup()` is run before all DOM nodes are present, again seemingly counter to the documentation (what does 'as soon as the DOM is ready' mean, exactly?): http://docs.meteor.com/#/full/meteor_startup
- `Meteor.startup()` is run when `<html>, <head>, and <body>` tags are created, but any tags created in your templates are NOT ready at this time.
- all the DOM nodes are actually created *earlier* than expected
- with six templates that still have yet to have their `.rendered()` callbacks fired, the max number of DOM nodes has already been reached. I would expect more DOM nodes to be added with each `.rendered()` callback being fired.

##Actual Script Load Order (please refer back to the Structure of the Templates section)##

- /lib
- /client/compatibility
- /client/javascript
- template rendered callbacks defined (but not run)
- main.js in /client
- `<script>` tags inside `<head>` in main.html in /client 
- Meteor.startup()
- `$('document').ready()`
- `$(window).load()`
- ONLY `<html> <head> <body> <link> and <script>` nodes are created at this point
- the innermost partial template (inside of yield) rendered callback fired and all DOM nodes APPARENTLY created
- header template rendered callback
- yield rendered callback
- footer template rendered callback
- layout rendered callback
- any external scripts loaded from within the layout rendered callback