#Meteor Load Order Test#

##Why##

This was created because Meteor seems to still display anomalous load order results that seem counter to what the official documentation states.

##What##

This Meteor app:

- console logs message when certain scripts are run

- logs the current number of HTML elements on the page at the time the scripts are run

The latter is useful because often we want to run 3rd party scripts that use jQuery. These scripts were not developed with Meteor in mind but nonetheless require all DOM nodes to be loaded in order to run. 

They do so by either being referenced at the very bottom of a traditional web page or by the use of $(document).ready(), both of which are ineffective and unreliable when used in a Meteor app.

##Results##

Open up Chrome Console and go here:

http://load-order-test.meteor.com/

##Analysis##

There are a few strange things going on.

- main.js and main.html are actually loaded very soon, counter to what the documentation says: http://docs.meteor.com/#/full/structuringyourapp
- all the DOM nodes are actually created *earlier* than expected
- with six templates that still have yet to have their .rendered() callbacks fired, the max number of DOM nodes has already been reached. We should expect more DOM nodes to be added with each .rendered() callback being fired.

##ACTUAL Script Load Order##

- /lib
- /client/compatibility
- /client/javascript
- template rendered callbacks defined (but not run)
- main.js in /client
- `<script>` tags inside `<head>` in main.html in /client 
- Meteor.startup()
- $('document').ready()
- $(window).load()
- ONLY `<html> <head> <body> <link> and <script>` nodes are created at this point
- the innermost partial template (inside of yield) rendered callback fired and all DOM nodes APPARENTLY created
- header template rendered callback
- yield rendered callback
- footer template rendered callback
- layout rendered callback
- any external scripts loaded from within the layout rendered callback