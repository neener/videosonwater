 var Ball = function(THREE, material, image, ctx, scene, settings, url){
    
    this.image = image;
    this.ctx = ctx;

    this.material = material;

    this.geometry = new THREE.SphereGeometry(100, 32, 32);
    
    var faceVertexUvs = this.geometry.faceVertexUvs[ 0 ];

    for ( i = 0; i < faceVertexUvs.length; i ++ ) {

      var uvs = faceVertexUvs[ i ];
      var face = this.geometry.faces[ i ];

        for ( var j = 0; j < 3; j ++ ) {

          uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
          uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;

        }
      }


    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.url = url;
 
    this.mesh.position.x = settings.position.x;
    this.mesh.position.y = settings.position.y;
    this.mesh.position.z = settings.position.z;
 
    this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = settings.scale;
    
    this.mesh.rotation.x = Math.PI / 2.50;
    this.mesh.rotation.y = Math.PI / 1;

    this.scale = settings.scale;
    this.miny = settings.minz;
    this.maxy = settings.maxz;
 
    this.currentDirection = settings.direction;

    // this.mesh.receiveShadow = true;
 
    scene.add(this.mesh);
};

Ball.prototype.render = function(){

    this.counter = this.counter || 0;
    var row = Math.floor(this.counter / 12);
    var column = this.counter - (12 * row);
    this.ctx.drawImage( this.image, column * 256, row * 256, 256, 256, 0, 0, 256, 256 );
    this.material.map.needsUpdate = true;

    this.counter = this.counter < 120 ? this.counter + 1 : 0;
};

Ball.prototype.move = function(){
  
  if(this.currentDirection === 1 && this.tooHigh()){ 
    this.currentDirection = -1;
  } else if(this.currentDirection === -1 && this.tooLow()){
    this.currentDirection = 1;
  }
 
  var moveBy = 2 * this.scale * this.currentDirection;
  this.mesh.position.z += moveBy;
};
 
Ball.prototype.tooHigh = function(){
    return (this.mesh.position.z >= this.maxy);
};

Ball.prototype.tooLow = function(){
    return (this.mesh.position.z <= this.miny);
};

module.exports = Ball;