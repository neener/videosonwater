 var Ball = function(THREE, material, video, ctx, scene, settings){
    
    this.video = video;
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
 
    this.mesh.position.x = settings.position.x;
    this.mesh.position.y = settings.position.y;
    this.mesh.position.z = settings.position.z;
 
    this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = settings.scale;
    
    this.mesh.rotation.x = Math.PI;

  

    this.scale = settings.scale;
    this.miny = settings.minz;
    this.maxy = settings.maxz;
 
    this.currentDirection = settings.direction;

    this.mesh.receiveShadow = true;
 
    scene.add(this.mesh);
};

Ball.prototype.render = function(){
    this.ctx.drawImage( this.video, 0, 0 );
    this.material.map.needsUpdate = true;
};

Ball.prototype.move = function(){
  
  if(this.currentDirection === 1 && this.tooHigh()){ 
    this.currentDirection = -1;
  } else if(this.currentDirection === -1 && this.tooLow()){
    this.currentDirection = 1;
  }
 
  var moveBy = 0.5 * this.scale * this.currentDirection;
  this.mesh.position.z += moveBy;
};
 
Ball.prototype.tooHigh = function(){
    return (this.mesh.position.z >= this.maxy);
};

Ball.prototype.tooLow = function(){
    return (this.mesh.position.z <= this.miny);
};

module.exports = Ball;