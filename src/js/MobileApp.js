var MobileApp = function (){
	 this.urls = ["https://www.youtube.com/embed/xR8FivNkypw", "https://www.youtube.com/embed/P0d70ExQAdY", "https://www.youtube.com/embed/TbZmVfs7MiM", "https://www.youtube.com/embed/tp-XIvCAwCk", "https://www.youtube.com/embed/iKdyVfT26eo", "https://www.youtube.com/embed/iMrZT8z_avg", "https://www.youtube.com/embed/KGinfh-FDs4", "https://www.youtube.com/embed/BOo2Qx_SWp0"];
	 this.images = ["/textures/mobile/groundunderwater.jpg", "/textures/mobile/freakudown.jpg", "/textures/mobile/givemeskin.jpg", "/textures/mobile/illbemyownreflection.jpg", "/textures/mobile/matchbook.jpg", "/textures/mobile/twentyone.jpg", "/textures/mobile/donttellme.jpg", "/textures/mobile/onlygirlintheworld.jpg"];
	 for (var i = 0; i < this.urls.length; i++){
	 	var link = document.createElement('a');
	 	link.href = this.urls[i];
	 	var div = document.createElement('div');
	 	div.setAttribute("style", "background-image: url(" + this.images[i] + ");");
	 	div.setAttribute("class", "ball ball" + (i + 1));
	 	document.body.appendChild(link);
	 	link.appendChild(div);
	 }

};

module.exports = MobileApp;