function Menu() {
	this.scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.z = 70;
	camera.position.x = 45;
	camera.position.y = -20;
	this.camera = camera;
	
	var text = "DMP-PROJECT",

			height = 1,
			size = 10,
			hover = 1,

			curveSegments = 2,

			bevelThickness = 1,
			bevelSize = 1,
			bevelSegments = 2,
			bevelEnabled = true;

	var hello_text_geometry = new THREE.TextGeometry( text, {
		size: size,
		height: height,
		curveSegments: curveSegments,
		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled, 
	});

	var hello_text_material = new THREE.MeshPhongMaterial({color: 0x11ff11});
	this.hello_text = new THREE.Mesh(hello_text_geometry, hello_text_material);
	this.scene.add(this.hello_text);

	var menu_light = new THREE.PointLight( 0xff0000, 10, 100);
	this.scene.add(menu_light);
	menu_light.position.set(45,5,10);
	
	document.onkeyup = function(e) {
		e = e || window.event;
		var keyCode = e.keyCode;
	    	if (keyCode == 13 /*ENTER*/) {
			Game();
	    	}
	};
}
