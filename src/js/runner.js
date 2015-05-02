var App = require('./App.js');
var MobileApp = require('./MobileApp.js');
var domReady = require('domready');

domReady(function(){
	var app;

	if (window.innerWidth >= 768 || !( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; } } )()){
    	app = new App();
	}
	else{
		app = new MobileApp();
	}
});