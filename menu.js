function menu() {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	camera.position.z = 70;
	camera.position.x = 45;
	camera.position.y = -20;
	
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
	var hello_text = new THREE.Mesh(hello_text_geometry, hello_text_material);
	scene.add(hello_text);

	var menu_light = new THREE.PointLight( 0xff0000, 10, 100);
	menu_light.position.set(45,5,10);
	scene.add(menu_light);
	
	document.onkeyup = function(e) {
		e = e || window.event;
		var keyCode = e.keyCode;
	    	if (keyCode == 13 /*ENTER*/) {
			game();
	    	}
	};

	function menu_render() {
		requestAnimationFrame(menu_render);

		hello_text.rotation.x += 0.01;
		renderer.render(scene, camera);
	}

	menu_render();
}
