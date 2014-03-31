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

	var enter_text_material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.enter_text = new THREE.Mesh(enter_text_geometry, enter_text_material);
	this.enter_text.position.y = -60;
	this.enter_text.position.x = -15;
	this.scene.add(this.enter_text);

	var help_text = "Hit the right key (F1, F2, F3, F4 or F5)",

					height = 1,
					size = 3,
					hover = 1;

	var help_text_geometry = new THREE.TextGeometry( help_text, {
		height: height,
		size: size,
	});

	var help_text_material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.help_text = new THREE.Mesh(help_text_geometry, help_text_material);
	this.help_text.position.y = -30;
	this.help_text.position.x = 10;
	this.scene.add(this.help_text);

	var help_text2 = "and Enter to rock!",

					height = 1,
					size = 3,
					hover = 1;

	var help_text_geometry2 = new THREE.TextGeometry( help_text2, {
		height: height,
		size: size,
	});

	var help_text_material2 = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.help_text2 = new THREE.Mesh(help_text_geometry2, help_text_material2);
	this.help_text2.position.y = -35;
	this.help_text2.position.x = 25;
	this.scene.add(this.help_text2);

	var help_text3 = "Pres M to switch the keys to (1,2,3,4 and 5)",

					height = 1,
					size = 3,
					hover = 1;

	var help_text_geometry3 = new THREE.TextGeometry( help_text3, {
		height: height,
		size: size,
	});

	var help_text_material3 = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.help_text3 = new THREE.Mesh(help_text_geometry3, help_text_material3);
	this.help_text3.position.y = -40;
	this.help_text3.position.x = 5;
	this.scene.add(this.help_text3);


	var menu_light = new THREE.PointLight( 0xff0000, 10, 100);
	this.scene.add(menu_light);
	menu_light.position.set(45,5,10);
	globals.renderManager.add('menu', this.scene, this.camera, render_menu, {text: this.hello_text});
	globals.renderManager.setCurrent('menu');

	function render_menu(delta, renderer) {
		this.objects.text.rotation.x += delta;
		renderer.render(this.scene, this.camera);
	};

}
