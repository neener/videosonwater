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
   this.renderer.setSize( this.width, this.height);
   this.container.appendChild( this.renderer.domElement );

   this.pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
   this.pointLight.position.set( 50, 50, 50 );

   this.ambientLight = new THREE.AmbientLight( 0xe2cae2 );
   this.scene.add( this.ambientLight );

   this.directionalLight = new THREE.DirectionalLight( 0xff99ff, 0.5 );
   this.directionalLight.position.set( 0, 1, 0 );
   this.directionalLight.position.normalize();
   this.scene.add( this.directionalLight );

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
		sunColor: 0xe1c9e1,
		waterColor: 0xf6eafd,
		distortionScale: 50,
	});
   
   this.water.sunDirection.x = 4.0;
   this.water.sunDirection.y = 4.0;
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

	var urls = ["http://youtu.be/KGinfh-FDs4", "/freakudown", "givemeskin.mp4", "groundunderwater.mp4", "illbemyownreflection", "matchbook", "twentyone"]
	
	
	var textures = [
			{texturePath: "/textures/videos/montagedonttellme.jpg", settings: {scale: 0.035, maxz: 1, minz: -1, direction:1, position: {x: 25 , y: 0 , z: 0 }}}, 
			{texturePath: "/textures/videos/montagefreakudown.jpg", settings: {scale: 0.025, maxz: 0.5, minz: -0.05, direction:1, position: {x: 0 , y: 25, z: 5 }}}, 
			{texturePath: "/textures/videos/montagegivemeskin.jpg", settings: {scale: 0.035, maxz: 0.5, minz: -0.5, direction:0, position: {x: -20 , y: 0 , z: 0 }}},
			{texturePath: "/textures/videos/montagegroundunderwater.jpg", settings: {scale: 0.035, maxz: 0.5, minz: -0.5, direction:0, position: {x: -25 , y: 10 , z: 10 }}}, 
			{texturePath: "/textures/videos/montageillbemyownreflection.jpg", settings: {scale: 0.050, maxz: 0.5, minz: -0.5, direction:0, position: {x: -28, y: 10, z: -10 }}}, 
			{texturePath: "/textures/videos/montagematchbook.jpg", settings: {scale: 0.040, maxz: -5, minz: 5, direction: 0, position: {x: 5 , y: 35 , z: -7 }}}, 
			{texturePath: "/textures/videos/montagetwentyone.jpg", settings: {scale: 0.025, maxz: 0.5, minz: -0.5, direction:1, position: {x: 15 , y: 5 , z: 6 }}},
			{texturePath: "/textures/videos/montageonlygirlintheworld.jpg", settings: {scale: 0.025, maxz: 0.5, minz: -0.5, direction:0, position: {x: 25, y: 5 , z: 10 }}}

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
						color: 0xffffff, //the base color of the object, white here
						ambient: 0xec9daf, //ambient color of the object, also white
						// specular: 0x43444d, //color for specular highlights, a dark grey here
						shininess: 15,
						map:  sphereTexture//the texture you created from the image
						} );
					
			var ball = new Ball(THREE, material, image, ctx, self.scene, settings.settings, urls[i]);
			
			self.balls.push(ball);
			window.balls.push(ball);
		});
	}, this);
	this.init();

};

App.prototype.init = function(){
	window.requestAnimationFrame( this.render.bind(this) );
	window.addEventListener('click', this.rayTrace.bind(this));
	var self = this
	window.addEventListener('resize', function(){
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
	window.open(intersects[0].object.url)
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
	window.setTimeout(function(){window.requestAnimationFrame(self.render.bind(self))}, 60);
};



module.exports = App;