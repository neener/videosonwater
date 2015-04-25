var App = require('./App.js');
var MobileApp = require('./MobileApp.js')
var domReady = require('domready');

domReady(function(){
	if (window.innerWidth >= 768){
    	var app = new App();
	}
	else{
		var app = new MobileApp();
	}
});