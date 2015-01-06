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

##Analysis##

- files with lib anywhere are certainly run first
- `main.js` and `main.html` are actually loaded very soon, seemingly counter to what the documentation says. The DOM is NOT ready by the time `main.*` is run: http://docs.meteor.com/#/full/structuringyourapp
- `Meteor.startup()` is run before all DOM nodes are present and is run when `<html>, <head>, and <body>` tags are created. Any tags created in your templates are NOT ready at this time. When the docs say 'as soon as the DOM is ready' they refer only to `<html>, <head>, and <body>` tags: http://docs.meteor.com/#/full/meteor_startup
- according to the Docs, within a directory, files are loaded in alphabetical order. The partial1 rendered callback in **p**artial_1.js in the /client/**p**artials folder is still called before the header rendered callback in  **h**eader.js in the /client/**i**ncludes folder, which is to be expected.
- all the DOM nodes are seemingly created by the time the first template rendered callback is run.
- despite the above, it may be safer to assume all DOM nodes are created by the time the layout rendered callback is run.
- with six templates that still have yet to have their `.rendered()` callbacks fired, the max number of DOM nodes has already been reached. One might expect more DOM nodes to be added with each `.rendered()` callback being fired, but this test shows that `.rendered()` doesn't run immediately after the DOM node is created.