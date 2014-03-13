function Graphics() {
	var notePoints = [];
	var noteMiddle = 0.5;
	notePoints.push( new THREE.Vector2 (   0,  0 ) );
	notePoints.push( new THREE.Vector2 (   0,  0.11 ) );
	notePoints.push( new THREE.Vector2 (   0.12,  0.14 ) );
	notePoints.push( new THREE.Vector2 (   0.22,  0.26 ) );
	notePoints.push( new THREE.Vector2 (   0.77,  0.26 ) );
	notePoints.push( new THREE.Vector2 (   0.87,  0.14 ) );
	notePoints.push( new THREE.Vector2 (   0.99,  0.11 ) );
	notePoints.push( new THREE.Vector2 (   0.99,  0 ) );
	
	var noteShape = new THREE.Shape( notePoints );
	var noteTranslationX = new THREE.Matrix4(1, 0, 0, -noteMiddle,
						0, 1, 0, 0,
						0, 0, 1, 0,
						0, 0, 0, 1);
	var neckSide = new THREE.Vector3(1, 0, 0).normalize();
	var neckUp = new THREE.Vector3(0, 1, -1).normalize();
	var neckCross = new THREE.Vector3();
	neckCross.crossVectors( neckUp, neckSide );
	var neckRotation = new THREE.Matrix4(neckSide.x, neckUp.x, neckCross.x, 0,
						neckSide.y, neckUp.y, neckCross.y, 0,
						neckSide.z, neckUp.z, neckCross.z, 0,
						0, 0, 0, 1);
	var neckEuler = new THREE.Euler().setFromRotationMatrix(neckRotation);
	var neckDir = neckUp;
	var notePath = new THREE.LineCurve(new THREE.Vector3(0, 0, 0), neckDir);

	this.balls = new Array();
	this.notes = new Array();
	
	this.noteMesh = new Object();
	
	this.init_scene = function () {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		var geometry = new THREE.CubeGeometry(7,15,0);
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
		globals.renderManager.add('game', this.scene, this.camera, render_game, {notes: this.notes, neckDir: neckDir});
		globals.renderManager.setCurrent('game');
	}

	this.create_ball = function(key) {
		var ball_geometry = new THREE.SphereGeometry(0.5,0,0.5,Math.PI/2, Math.PI*2, 0, Math.PI);
		var ball_material = new THREE.MeshPhongMaterial({color: 0x00FFFF});

		ball = new THREE.Mesh(ball_geometry, ball_material);

		switch(key)
		{
		case 'A':
			ball.position.set(-1,2,2);
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
			ball.position.set(1,0,0);
			break;
		default:
			ball.position.set(-111,-111,-111);
		}
		this.balls.push(ball);
		this.scene.add(ball);
	}
	
	this.create_note = function(label, length) {
		var options = {
			amount: length, curveSegments: 3,
			bevelEnabled: false,
			material: 0, extrudeMaterial: 1,
			extrudePath: notePath
		};
		var noteGeometry = new THREE.ExtrudeGeometry( noteShape, options );
		noteGeometry.applyMatrix(noteTranslationX);
		//noteGeometry.applyMatrix(noteRotationX);
		//noteGeometry.applyMatrix(noteRotationY);
		var material = new THREE.MeshPhongMaterial({color: 0xff1111});
		var note = new THREE.Mesh( noteGeometry, material );
		switch(label)
		{
		case 'A':
			note.position.set(0,1,0);
			break;
		case 'B':
			note.position.set(-0.5,2,-1);
			break;
		case 'C':
			note.position.set(0,2,-1);
			break;
		case 'D':
			note.position.set(0.5,2,-1);
			break;
		case 'E':
			note.position.set(1,0,0);
			break;
		default:
			note.position.set(-111,-111,-111);
		}
		//note.rotation = neckEuler;
		this.scene.add(note);
		this.notes.push(note);
		
	}
	
	function render_game(delta, renderer) {
		for (var i = 0; i < this.objects.notes.length; i += 1) {
			var dir = this.objects.neckDir;
			this.objects.notes[i].translateX(0.01*dir.x);
			this.objects.notes[i].translateZ(0.01*dir.y);
			this.objects.notes[i].translateY(0.01*dir.z);
		}
		renderer.render(this.scene, this.camera);
	}
}
