console.log('layout.js has been run, which means Template.Layout.rendered callback has been defined');

Template.Layout.rendered = function(){

	console.log('layout template rendered and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
	$('head').append('<script src="/javascript/domCompleteScript.js"></script>');

};