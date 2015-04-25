var MobileApp = function (){
	 this.urls = ["https://www.youtube.com/embed/xR8FivNkypw", "https://www.youtube.com/embed/P0d70ExQAdY", "https://www.youtube.com/embed/TbZmVfs7MiM", "https://www.youtube.com/embed/tp-XIvCAwCk", "https://www.youtube.com/embed/iKdyVfT26eo", "https://www.youtube.com/embed/iMrZT8z_avg", "https://www.youtube.com/embed/KGinfh-FDs4", "https://www.youtube.com/embed/BOo2Qx_SWp0"];
	 this.images = ["/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg", "/textures/mobile/groundunderwater.jpg"];
	 for (var i = 0; i < this.urls.length; i++){
	 	// make a div element
	 	var link = document.createElement('a');
	 	link.href = this.urls[i];
	 	var div = document.createElement('div');
	 	// set its heigth and width so its a square
	 	div.setAttribute("style", "background-image: url(" + this.images[i] + ");")
	 	// set that div to have that class
	 	div.setAttribute("class", "ball");
	 	// set its style attribute to use the appropriate image as a background image
	 	// set up css class that makes the div a circle

	 	// use class to give it absolute positioning

	 	// give it top and left value you want it to start with

	 	// add the div to the body element
	 	document.body.appendChild(link);
	 	link.appendChild(div);
	 	// call animate function that moves 
	 	//  animateBall (div element, minimum y, max y)
	 }

}

module.exports = MobileApp