console.log('a script in /public/javascript referenced in the Layout.rendered callback. This should only fire after all DOM nodes have been loaded.');

$('document').ready(function(){
	console.log('$("document").ready(func) is firing from a script in /public/javascript referenced in the Layout.rendered callback. All DOM nodes should be present at this time.');
});