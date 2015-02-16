var THREE = require('three');
require('./WaterLoader.js')(THREE);

var Ball = require('./Ball.js');

var App = function(){
   this.container = document.body;
   document.body.appendChild( this.container );
   
   this.scene = new THREE.Scene();

   this.height = window.innerHeight;
   this.width = window.innerWidth;

   this.camera = new THREE.PerspectiveCamera( 55, this.width / this.height, 0.5, 3000000 );
   this.camera.up = new THREE.Vector3(0,0,1);
   this.camera.position.set( 0, 50, 0 );
   this.camera.lookAt(new THREE.Vector3(0,0,0));

   this.renderer = new THREE.WebGLRenderer();
   this.renderer.setSize( this.width, this.height);
   this.container.appendChild( this.renderer.domElement );

   this.pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
   this.pointLight.position.set( 50, 50, 50 );

   this.waterNormals = new THREE.ImageUtils.loadTexture( '/textures/2.jpg' );
   this.waterNormals.wrapS = this.waterNormals.wrapT = THREE.RepeatWrapping; 

   this.water = new THREE.Water( this.renderer, this.camera, this.scene, {
		textureWidth: 2048 , 
		textureHeight: 2048,
		waterNormals: this.waterNormals,
		alpha: 0.5,
		sunDirection: this.pointLight.position.normalize(),
		sunColor: 0xffffff,
		waterColor: 0xee0000,
		distortionScale: 50.0
	} );

   this.waterPlane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry( 20000, 20000 ),
	this.water.material
	);

   this.mirrorMesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 20000, 20000 ),
		this.water.material
	);

   this.mirrorMesh.add( this.water );
   this.mirrorMesh.rotation.x = - Math.PI * 0.5;
   this.scene.add( this.mirrorMesh );

   this.cubeMap = new THREE.CubeTexture( [] );
   this.cubeMap.format = THREE.RGBFormat;

   this.loader = new THREE.ImageLoader();

   this.loader.load( 'textures/justpink.jpg', (function ( image ) {
      		var getSide = function ( x, y ) {
	   			var size = 1024;
	   			var canvas = document.createElement( 'canvas' );
	   			canvas.width = size;
	   			canvas.height = size;
	   			var context = canvas.getContext( '2d' );
	   			context.drawImage( image, - x * size, - y * size );
	   			return canvas;
	   		};
	   
   		this.cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
   		this.cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
   		this.cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
   		this.cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
   		this.cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
   		this.cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
   		this.cubeMap.needsUpdate = true;
   	}).bind(this));

   this.cubeShader = THREE.ShaderLib.cube;
   this.cubeShader.uniforms.tCube.value = this.cubeMap;

   this.skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: this.cubeShader.fragmentShader,
		vertexShader: this.cubeShader.vertexShader,
		uniforms: this.cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});

   this.skyBox = new THREE.Mesh(
		new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
		this.skyBoxMaterial
	);

   this.scene.add( this.skyBox );

   return this.addBalls();
};

App.prototype.addBalls = function(){
	var counter = 7;
	this.balls = [];
	var textures = [
			{texturePath: "/textures/videos/donttellme.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: 25 , z: 25 }}}, 
			{texturePath: "/textures/videos/freakudown.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: 45 , z: 25 }}}, 
			{texturePath: "/textures/videos/givemeskin.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: 30 , z: 25 }}}, 
			{texturePath: "/textures/videos/groundunderwater.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: -45 , z: 25 }}}, 
			{texturePath: "/textures/videos/illbemyownreflection.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: -50 , z: 25 }}}, 
			{texturePath: "/textures/videos/matchbook.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: -20 , z: 25 }}}, 
			{texturePath: "/textures/videos/twentyone.mp4", settings: {scale: 1, maxz: 100, minz: -100, direction: 1, position: {x: 25 , y: 1 , z: 25 }}}
	];
	
	textures.forEach(function(settings){
		var self = this;
		var video = document.createElement( 'video' );
			video.loop = true;
			video.src = settings.texturePath;
			video.load(); 
		video.addEventListener("canplaythrough", function(e){
			var vid = e.target;
			counter--;
			vid.play();
			var videocanvas = document.createElement( 'canvas' );
			var videocanvasctx = videocanvas.getContext( '2d' );

			// set its size
			videocanvas.width = 320;
			videocanvas.height = 380;

			// draw black rectangle so spheres don't start out transparent
			videocanvasctx.fillStyle = "#000000";
			videocanvasctx.fillRect( 0, 0, 380, 380 );

			// add canvas to new texture
			var spheretexture = new THREE.Texture(videocanvas, new THREE.SphericalReflectionMapping());

			// add texture to material that will be wrapped around the sphere
			var material = new THREE.MeshPhongMaterial( {
				color: 0xffffff, //the base color of the object, white here
				ambient: 0xffffff, //ambient color of the object, also white
				specular: 0x050505, //color for specular highlights, a dark grey here
				shininess: 50,
				map: spheretexture //the texture you created from the video
				} );
			
			var ball = new Ball(THREE, material, vid, videocanvasctx, self.scene, settings.settings);
			self.balls.push(ball);
			console.log("Video loaded :)");
			if(counter === 0) self.init();
		});
	}, this);

};

App.prototype.init = function(){
	window.requestAnimationFrame( this.init.bind(this) );
	this.render();
};

App.prototype.render = function(){
	this.balls.forEach(function(ball){
		ball.move();
		ball.render();
	});
	this.water.material.uniforms.time.value += 1.0 / 400.0;
	this.water.render();
	this.renderer.render( this.scene, this.camera );

};



module.exports = App;