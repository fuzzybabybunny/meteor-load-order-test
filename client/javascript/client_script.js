console.log('/client/javascript has been loaded and the number of DOM nodes is ' + document.getElementsByTagName('*').length);

$('document').ready(function(){
	console.log('$("document").ready has been fired inside of /client/javascript and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
});

$( window ).load(function(){ 
	console.log('$(window).load has been fired inside of /client/javascript and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
});

Meteor.startup(function(){
	console.log('Meteor.startup() has been fired inside of /client/javascript and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
});

// This does not run because it gets re-defined in layout.js later to something else
Template.Layout.rendered = function(){
	console.log('auto-minified script in /client/javascript inside of Layout.rendered has been loaded and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
};
