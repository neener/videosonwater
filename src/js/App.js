var THREE = require('three');
require('./MirrorLoader.js')(THREE);
require('./WaterLoader.js')(THREE);

window.balls = [];

var Ball = require('./Ball.js');

var App = function(){
   this.container = document.body;
   
   this.scene = new THREE.Scene();

   this.height = window.innerHeight;
   this.width = window.innerWidth;

   window.camera = this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 0.5, 3000000 );
   this.camera.up = new THREE.Vector3(0,0,1);
   this.camera.position.set( 10, 65, 0 );
   this.camera.lookAt(new THREE.Vector3(0,0,0));

   this.renderer = new THREE.WebGLRenderer({ antialias: true });
   this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
   this.renderer.setSize( this.width, this.height);
   this.container.appendChild( this.renderer.domElement );

   // pointLight is just holding a position for the camera
   this.pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
   this.pointLight.position.set( 50, 50, 50 );

   this.ambientLight = new THREE.AmbientLight( 0xcccccc);
   this.scene.add( this.ambientLight );



   this.spotLightTop = new THREE.SpotLight(0xffffff, 0.1);
   this.spotLightTop.position.set( 0, 10, 850 );
   this.spotLightTop.castShadow = true;

   this.spotLightTop.shadowMapWidth = 1024;
   this.spotLightTop.shadowMapHeight = 1024;

   this.spotLightTop.shadowCameraNear = 10;
   this.spotLightTop.shadowCameraFar = 5000;
   this.spotLightTop.shadowCameraFov = 3000;

   this.spotLightTop.shadowDarkness = 1;

   this.spotLightTop.target = new THREE.Object3D(0,30,0);

   this.scene.add( this.spotLightTop );

   window.lightTop = this.spotLightTop;



   this.spotLightRight = new THREE.SpotLight(0xffffff, 0.1);
   this.spotLightRight.position.set( 0, 10, 850 );
   this.spotLightRight.castShadow = true;

   this.spotLightRight.shadowMapWidth = 1024;
   this.spotLightRight.shadowMapHeight = 1024;

   this.spotLightRight.shadowCameraNear = 10;
   this.spotLightRight.shadowCameraFar = 5000;
   this.spotLightRight.shadowCameraFov = 3000;

   this.spotLightRight.shadowDarkness = 1;

   this.spotLightRight.target = new THREE.Object3D(0,30,0);

   this.scene.add( this.spotLightRight );

   window.lightRight = this.spotLightRight;

   
   this.spotLightBottom = new THREE.SpotLight(0xffffff, 0.1);
   this.spotLightBottom.position.set( 0, 5, -850 );
   this.spotLightBottom.castShadow = true;

   this.spotLightBottom.shadowMapWidth = 1024;
   this.spotLightBottom.shadowMapHeight = 1024;

   this.spotLightBottom.shadowCameraNear = 500;
   this.spotLightBottom.shadowCameraFar = 10000;
   this.spotLightBottom.shadowCameraFov = 30;

   this.spotLightBottom.shadowDarkness = 1;

   this.spotLightBottom.target = new THREE.Object3D(0,20,0);

   this.scene.add( this.spotLightBottom );

   window.lightBottom = this.spotLightBottom;


   this.spotLightLeft = new THREE.SpotLight(0xffffff, 0.1);
   this.spotLightLeft.position.set( 0, -10, -850 );
   this.spotLightLeft.castShadow = true;

   this.spotLightLeft.shadowMapWidth = 1024;
   this.spotLightLeft.shadowMapHeight = 1024;

   this.spotLightLeft.shadowCameraNear = 10;
   this.spotLightLeft.shadowCameraFar = 5000;
   this.spotLightLeft.shadowCameraFov = 3000;

   this.spotLightLeft.shadowDarkness = 1;

   this.spotLightLeft.target = new THREE.Object3D(0,30,0);

   this.scene.add( this.spotLightLeft );

   window.lightLeft = this.spotLightLeft;


   window.THREE = THREE;

   this.loader = new THREE.ImageLoader();

   this.makeWater();
   this.makeEnvironment();
   
   this.addBalls();
   // this.init();
};

App.prototype.makeWater = function(){

   var waterNormals = new THREE.ImageUtils.loadTexture( '/textures/terrain.png' );
       waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 

   this.water = new THREE.Water( this.renderer, this.camera, this.scene, {
		textureWidth: 1024, 
		textureHeight: 1024,
		waterNormals: waterNormals,
		alpha: 0.5,
		sunDirection: this.pointLight.position.normalize(),
		sunColor: 0xcccccc,
		waterColor: 0xffccff,
		distortionScale: 50,
	});
   
   this.water.sunDirection.x = 0;
   this.water.sunDirection.y = 5.0;
   this.water.sunDirection.z = 2.0;


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
};

App.prototype.makeEnvironment = function(){
	this.cubeMap = new THREE.CubeTexture( [] );
    this.cubeMap.format = THREE.RGBFormat;


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

};

App.prototype.addBalls = function(){
	this.balls = [];

	var urls = ["https://www.youtube.com/embed/xR8FivNkypw", "https://www.youtube.com/embed/P0d70ExQAdY", "https://www.youtube.com/embed/TbZmVfs7MiM", "https://www.youtube.com/embed/tp-XIvCAwCk", "https://www.youtube.com/embed/iKdyVfT26eo", "https://www.youtube.com/embed/iMrZT8z_avg", "https://www.youtube.com/embed/KGinfh-FDs4", "https://www.youtube.com/embed/BOo2Qx_SWp0"];
	
	
	var textures = [
			{texturePath: "/textures/videos/montagegroundunderwater.jpg", settings: {scale: 0.035, maxz: 13, minz: 10, direction:1, position: {x: 7 , y: 20 , z: 14 }}}, 
			{texturePath: "/textures/videos/montagefreakudown.jpg", settings: {scale: 0.025, maxz: 12, minz: 11, direction:1, position: {x: -5 , y: 15, z: 8 }}}, 
			{texturePath: "/textures/videos/montagegivemeskin.jpg", settings: {scale: 0.025, maxz: 11, minz: 9, direction:1, position: {x: -15 , y: 20 , z: 10 }}},
			{texturePath: "/textures/videos/montageillbemyownreflection.jpg", settings: {scale: 0.040, maxz: -7, minz: -9, direction:1, position: {x: -18, y: 7, z: -10 }}}, 
			{texturePath: "/textures/videos/montagematchbook.jpg", settings: {scale: 0.037, maxz: -6, minz: -8, direction: 1, position: {x: 5 , y: 35 , z: -7 }}}, 
			{texturePath: "/textures/videos/montagetwentyone.jpg", settings: {scale: 0.035, maxz: -7, minz: -9, direction:1, position: {x: 15, y: 7, z: -10 }}},
			{texturePath: "/textures/videos/montagedonttellme.jpg", settings: {scale: 0.025,  maxz: -7, minz: -9, direction:1, position: {x: 25 , y: 7, z: -9 }}}, 
			{texturePath: "/textures/videos/montageonlygirlintheworld.jpg", settings: {scale: 0.025, maxz: 11, minz: 9, direction:1, position: {x: 20, y: 10, z: 10 }}}

	];
	
	textures.forEach(function(settings, i){
		var self = this;
		
		this.loader.load(settings.texturePath, function(image){
			var canvas= document.createElement('canvas');
			var ctx = canvas.getContext('2d');
				canvas.height = 256;
				canvas.width = 256;

				ctx.fillStyle = "#000000";
				ctx.fillRect( 0, 0, 256, 256 );

			var sphereTexture = new THREE.Texture(canvas, THREE.SphericalReflectionMapping);
			var material = new THREE.MeshPhongMaterial( {
						color: 0x666666, //the base color of the object, white here
						opacity: 0.4,
						transparent: true,
						ambient: 0xffffff, //ambient color of the object, also white
						diffuse: 0x000000,
						specular: 0xcccccc, //color for specular highlights, a dark grey here
						shininess: 100,
						metal: true,
						shading: THREE.SmoothShading,
						map: sphereTexture//the texture you created from the image
						});
		
			

			var ball = new Ball(THREE, material, image, ctx, self.scene, settings.settings, urls[i]);
			
			self.balls.push(ball);
			window.balls.push(ball);
		});
	}, this);
	this.init();

};

App.prototype.init = function(){
	window.requestAnimationFrame( this.render.bind(this) );
	this.renderer.domElement.addEventListener('click', this.rayTrace.bind(this));
	var self = this;
	window.addEventListener('resize', function(){
		if(window.innerWidth < 840) self.camera.position.set( 10, 120, 0 );
		if(window.innerWidth < 530) self.camera.position.set( 20, 140, 0 );
		if(window.innerWidth >= 840) self.camera.position.set( 10, 65, 0 );
		self.camera.aspect = window.innerWidth / window.innerHeight;
		self.camera.updateProjectionMatrix();
		self.renderer.setSize( window.innerWidth, window.innerHeight );
	});

};

App.prototype.rayTrace = function(event){
	var vector = new THREE.Vector3();
	var raycaster = new THREE.Raycaster();
	var dir = new THREE.Vector3();

	vector.set(
		( event.clientX / window.innerWidth ) * 2 - 1,
		- (event.clientY / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject(this.camera);

	raycaster.set(camera.position, vector.sub(this.camera.position).normalize());
	
	var intersects = raycaster.intersectObjects(this.scene.children, false);

	if(!intersects[0].object.url) return;
	this.openModal(intersects[0].object.url);
};

App.prototype.openModal = function(url){
		var modal = document.createElement('div');
		    modal.setAttribute('id', 'video-modal');
		    document.querySelectorAll('body')[0].appendChild(modal);
		    modal.innerHTML = '<div id="modal-close">CLOSE</div><iframe width="560" height="315" src="' + url + '?autoplay=1&modestbranding=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
		    document.getElementById('modal-close').addEventListener('click', this.closeModal.bind(this));
};

App.prototype.closeModal = function(url){
		var modal = document.getElementById('video-modal');
		    document.body.removeChild(modal);
};

App.prototype.render = function(){

	this.balls.forEach(function(ball){
		ball.move();
		ball.render();
	});

	this.water.material.uniforms.time.value += 1.0 / 400.0;
	try{
		this.water.render();
	} catch(e){

	}
	this.renderer.render( this.scene, this.camera );
	var self = this;
	window.setTimeout(function(){window.requestAnimationFrame(self.render.bind(self));}, 60);
};



module.exports = App;
