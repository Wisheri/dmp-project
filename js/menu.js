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

	var enter_text = "Press Enter to Start",

				height = 1,
				size = 10,
				hover = 1;

	var enter_text_geometry = new THREE.TextGeometry( enter_text, {
		height: height,
		size: size,
	});

	var enter_text_material = new THREE.MeshBasicMaterial({color: 0xff00ff});
	this.enter_text = new THREE.Mesh(enter_text_geometry, enter_text_material);
	this.enter_text.position.y = -40;
	this.enter_text.position.x = -15;
	this.scene.add(this.enter_text);

	var menu_light = new THREE.PointLight( 0xff0000, 10, 100);
	this.scene.add(menu_light);
	menu_light.position.set(45,5,10);
	globals.renderManager.add('menu', this.scene, this.camera, render_menu, {text: this.hello_text});
	globals.renderManager.setCurrent('menu');

	document.onkeydown = function(e) {
		e = e || window.event;
		e.preventDefault();
		var keyCode = e.keyCode;
		if (keyCode == 13 /*ENTER*/ && globals.started == false){

			var song_request = new XMLHttpRequest();
			song_request.open("get", "files/abc1.txt", false);
			song_request.setRequestHeader("User-Agent", navigator.userAgent);
			song_request.send(null);

			if (song_request.status == 200){
				globals.started = true; //Signaling that the game has started.

				new Song(song_request.responseText);
			}
			
			else alert("Error executing XMLHttpRequest call!");
		}
	}

	function render_menu(delta, renderer) {
		this.objects.text.rotation.x += delta;
		renderer.render(this.scene, this.camera);
	};

}
