var Ball = function(material, scene, settings){

    this.geometry = new Three.SphereGeometry(100, 32, 32);
    this.mesh = new THREE.mesh(this.geometry, material)
 
    this.mesh.position.x = settings.x;
    this.mesh.position.y = settings.y;
    this.mesh.position.z = settings.z;
 
    this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = settings.scale;
 
    this.scale = settings.scale;
    this.miny = settings.minz;
    this.maxy = settings.maxz;
 
    this.currentDirection = settings.direction;
 
    scene.add(this.mesh)
}
 
Ball.prototype.move = function(){
  
  if(this.currentDirection === 1 && this.tooHigh()){ 
    this.currentDirection = -1;
  } else if(this.currentDirection === -1 && this.tooLow()){
    this.currentDirection = 1;
  }
 
  var moveBy = 0.5 * this.scale * this.currentDirection;
  this.mesh.postion.z += moveBy;
};
 
Ball.prototype.tooHigh = function(){
    return (this.mesh.position.z >= this.maxy);
};

Ball.prototype.tooLow = function(){
    return (this.mesh.position.z <= this.miny);
};

module.exports = Ball;