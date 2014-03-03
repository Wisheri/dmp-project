function Graphics() {
	var neckDir = new THREE.Vector3( -70, 0, 0 );
	
	this.init_scene = function () {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

		var geometry = new THREE.CubeGeometry(4,10,0.1);
		var material = new THREE.MeshPhongMaterial({color: 0x11ff11});

		this.cube = new THREE.Mesh(geometry, material);
		this.cube.rotation = new THREE.Euler( neckDir.x, neckDir.y, neckDir.z, 'XYZ' );
		this.scene.add(this.cube);

		this.light = new THREE.PointLight( 0xff0000, 10, 100);
		this.light.position.set(45,5,10);

		this.scene.add(this.light);

		this.camera.position.z = 5;

		render();
	}

	function render() {
		requestAnimationFrame(render);
		globals.renderer.render(this.scene, this.camera);
	};

	

}
