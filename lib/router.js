if(Meteor.isClient){
	console.log('router.js in /lib has been loaded and the number of DOM nodes is ' + document.getElementsByTagName('*').length);
};

Router.configure({
	loadingTemplate: 'Loading',
	layoutTemplate: 'Layout',
	notFoundTemplate: 'NotFound'
});

Router.route('/', {
	name: 'Index'
})

