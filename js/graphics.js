function Graphics() {
	var neckSide = new THREE.Vector3(1, 0, 0).normalize();
	var neckUp = new THREE.Vector3(0, 1, -1).normalize();
	var neckCross = new THREE.Vector3();
	neckCross.crossVectors( neckUp, neckSide );
	var neckRotation = new THREE.Matrix4(neckSide.x, neckUp.x, neckCross.x, 0,
										neckSide.y, neckUp.y, neckCross.y, 0,
										neckSide.z, neckUp.z, neckCross.z, 0,
										0, 0, 0, 1);
	var neckEuler = new THREE.Euler();
	neckEuler.setFromRotationMatrix(neckRotation);

	this.balls = new Array();
	
	this.init_scene = function () {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

		var geometry = new THREE.CubeGeometry(4,10,0.1);
		var material = new THREE.MeshPhongMaterial({color: 0x11ff11});

		this.cube = new THREE.Mesh(geometry, material);
		this.cube.rotation = neckEuler;
		//this.cube.applyMatrix(neckRotation);
		this.scene.add(this.cube);

		//this.light = new THREE.PointLight( 0xff0000, 10, 100);
		//this.light.position.set(5,5,10);
		this.light = new THREE.DirectionalLight(0xffffff, 0.5);
		this.light.position.set(0, 3.5,5);

		this.scene.add(this.light);
		//var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light useful for debugging
		//this.scene.add( ambientLight );
		
		//var ball_geometry = new THREE.SphereGeometry(0.5,0.5,0.5,Math.PI/2, Math.PI*2, 0, Math.PI);
		//var ball_material = new THREE.MeshPhongMaterial({color: 0x00FFFF});
		//ball_material.side = THREE.BackSide;

		//this.ball = new THREE.Mesh(ball_geometry, ball_material);
		//this.ball.position.set(-1,2,-1); 
		//this.scene.add(this.ball);

		this.camera.position.z = 5;
		globals.renderManager.add('game', this.scene, this.camera, render_game, {balls: this.balls, neckDir: neckUp});
		globals.renderManager.setCurrent('game');
	}

	this.create_ball = function(key) {
		var ball_geometry = new THREE.SphereGeometry(0.5,0,0.5,Math.PI/2, Math.PI*2, 0, Math.PI);
		var ball_material = new THREE.MeshPhongMaterial({color: 0x00FFFF});

		ball = new THREE.Mesh(ball_geometry, ball_material);

		switch(key)
		{
		case 'A':
			ball.position.set(-1,2,-1);
			break;
		case 'B':
			ball.position.set(-0.5,2,-1);
			break;
		case 'C':
			ball.position.set(0,2,-1);
			break;
		case 'D':
			ball.position.set(0.5,2,-1);
			break;
		case 'E':
			ball.position.set(1,2,-1);
			break;
		default:
			ball.position.set(-111,-111,-111);
		}
		this.balls.push(ball);
		this.scene.add(ball);
	}
	
	function render_game(delta, renderer) {
		for (var i = 0; i < globals.game.graphics.balls.length; i += 1) {
			var dir = this.objects.neckDir;
			this.objects.balls[i].translateX(0.01*dir.x);
			this.objects.balls[i].translateZ(0.01*dir.y);
			this.objects.balls[i].translateY(0.01*dir.z);
		}
		renderer.render(this.scene, this.camera);
	}
}
