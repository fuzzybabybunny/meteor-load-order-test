Template.Footer.rendered = function(){

	console.log('Footer template rendered and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
	$('#partial1Value').text('This text was added using jQuery inside of Template.Footer.rendered() and the DOM node that was selected was originally created when Partial 1 was rendered');

};