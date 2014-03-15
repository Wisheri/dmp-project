function Graphics() {
	// Constants
	var NECK_WIDTH = 8;
	var NECK_LENGTH = 15;
	var NOTE_WIDTH = 1.0; // This depends on the shape of the note!	
	var NOTES_POS_0 = new THREE.Vector3(-NECK_WIDTH/2 + NECK_WIDTH / 10, -NECK_LENGTH/2, 0); // Later rotated with neckRotation
	// Later note positions can be initialized to NOTES_POS_0 + n*NOTES_POS_DELTA
	var NOTES_POS_DELTA = new THREE.Vector3(NECK_WIDTH / 5, 0, 0); // Later rotated with neckRotation 

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
	var noteTranslationX = new THREE.Matrix4(1, 0, 0, noteMiddle,
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
	NOTES_POS_0.applyEuler(neckEuler);
	NOTES_POS_DELTA.applyEuler(neckEuler);

	this.notes = new Array();
	
	this.init_scene = function () {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		var geometry = new THREE.CubeGeometry(NECK_WIDTH,NECK_LENGTH,0);
		var material = new THREE.MeshPhongMaterial({color: 0x11ff11});
		
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.rotation = neckEuler;
		this.scene.add(this.cube);

		//this.light = new THREE.PointLight( 0xff0000, 10, 100);
		//this.light.position.set(5,5,10);
		this.light = new THREE.DirectionalLight(0xffffff, 0.5);
		this.light.position.set(0, 3.5,5);

		this.scene.add(this.light);
		//var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light useful for debugging
		//this.scene.add( ambientLight );
		
		this.camera.lookAt(new THREE.Vector3(0, 0, -1));
		this.camera.position.z = 5;
		globals.renderManager.add('game', this.scene, this.camera, render_game, {notes: this.notes, neckDir: neckDir});
		globals.renderManager.setCurrent('game');
	}

	function render_game(delta, renderer) {
		for (var i = 0; i < this.objects.notes.length; i += 1) {
			var dir = this.objects.neckDir;
			this.objects.notes[i].translateX(delta*dir.x);
			this.objects.notes[i].translateZ(delta*dir.y);
			this.objects.notes[i].translateY(delta*dir.z);
		}
		renderer.render(this.scene, this.camera);
	}

	this.create_note_geometries(notes) {
		for (var i = 0; i < notes.length; i++) {
			this.create_note_geometry(notes[i]);
		}
	}

	// Call this for each note after initializing graphics
	this.create_note_geometry = function(note) {
		var options = {
			amount: note.length, curveSegments: 3,
			bevelEnabled: false,
			material: 0, extrudeMaterial: 1,
			extrudePath: notePath
		};
		var noteGeometry = new THREE.ExtrudeGeometry( noteShape, options );
		noteGeometry.applyMatrix(noteTranslationX);
		var material = new THREE.MeshPhongMaterial({color: 0xff1111});
		var noteMesh = new THREE.Mesh( noteGeometry, material );
		var n = 0;
		switch(note.label)
		{
		case 'A':
			n = 0;
			break;
		case 'B':
			n = 1;
			break;
		case 'C':
			n = 2;
			break;
		case 'D':
			n = 3;
			break;
		case 'E':
			n = 4;
			break;
		default:
			note.position.set(-111,-111,-111);
		}
		note.position.copy(NOTES_POS_DELTA);
		note.position.multiplyScalar(n);
		note.position.add(NOTES_POS_0);
		
		note.mesh = noteMesh;
	}
}
