function Graphics(game) {
	this.game = game;
	// Constants
	var NECK_WIDTH = 8;
	var NECK_LENGTH = 15;
	var NOTE_WIDTH = 1.0; // This depends on the shape of the note!	
	this.LENGTH_TO_LINE = NECK_LENGTH / 2 + NECK_LENGTH / 10;
	var NOTES_POS_0 = new THREE.Vector3(-NECK_WIDTH/2 + NECK_WIDTH / 10, -NECK_LENGTH/2 + this.LENGTH_TO_LINE,0); // Later rotated with neckRotation
	// Later note positions can be initialized to NOTES_POS_0 + n*NOTES_POS_DELTA
	var NOTES_POS_DELTA = new THREE.Vector3(NECK_WIDTH / 5, 0, 0); // Later rotated with neckRotation 
	
	this.score3d = new Object();

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
	this.neckDir = neckUp;
	NOTES_POS_0.applyEuler(neckEuler);
	NOTES_POS_DELTA.applyEuler(neckEuler);

	this.notes = new Array();
	
	this.init_scene = function () {
		/* -------*/
		/*	Scene */
		/* -------*/

		this.scene = new THREE.Scene();
		
		/* -------*/
		/* Camera */
		/* -------*/

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		
		/* ----------- */
		/* Guitar neck */
		/* ----------- */

		var neck_geometry = new THREE.CubeGeometry(NECK_WIDTH,NECK_LENGTH,0);
		//var neck_material = new THREE.MeshPhongMaterial({color: 0x11ff11});
		//var neck_material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('../images/metalbox_full.png')});

		var neck_material = new THREE.MeshPhongMaterial({map: globals.textures['neck']});	

		this.neck = new THREE.Mesh(neck_geometry, neck_material);
		this.neck.rotation = neckEuler;
		this.scene.add(this.neck);

		/* ----------- */
		/*    Line     */
		/* ----------- */

		var line_geometry = new THREE.CubeGeometry(NECK_WIDTH, 0.5, 0.5);
		var line_material = new THREE.MeshPhongMaterial({color: 0x0000ff});
		this.line = new THREE.Mesh(line_geometry, line_material);

		var LINE_POS = new THREE.Vector3(0,-NECK_LENGTH/2 + this.LENGTH_TO_LINE,0);
		LINE_POS.applyEuler(neckEuler);

		this.line.position.copy(LINE_POS);
		this.scene.add(this.line);

		/* ------------ */
		/*  Background  */
		/* ------------ */

		var background_geometry = new THREE.CubeGeometry(15,10,-10);
		var background_material = new THREE.MeshBasicMaterial({map: globals.textures['background']});

		this.background = new THREE.Mesh(background_geometry, background_material);
		this.scene.add(this.background);	

		/* ----------- */
		/*    Light    */
		/* ----------- */

		//this.light = new THREE.PointLight( 0xff0000, 10, 100);
		//this.light.position.set(5,5,10);
		this.light = new THREE.DirectionalLight(0xffffff, 0.5);
		this.light.position.set(0, 3.5,5);

		this.scene.add(this.light);
		//var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light useful for debugging
		//this.scene.add( ambientLight );
		
		this.camera.lookAt(new THREE.Vector3(0, 0, -1));
		this.camera.position.z = 5;
		globals.renderManager.add('game', this.scene, this.camera, render_game, {game: this.game, notes: this.notes, neckDir: this.neckDir});
		globals.renderManager.setCurrent('game');
	}

	function render_game(delta, renderer) {
		var deltaMs = delta * 1000;
		var game = this.objects.game;
		getNotesToShow();
		for (var i = 0; i < this.objects.notes.length; i += 1) {
			var dir = this.objects.neckDir;
			var note = this.objects.notes[i];
			note.mesh.translateOnAxis(dir, -game.NOTE_SPEED*deltaMs);
		}
		renderer.render(this.scene, this.camera);

		function getNotesToShow() {
			var i = game.song.notes.lastShownIndex + 1;
			while (i < game.song.notes.length) {
				var note = game.song.notes[i];
				var timeToNote = note.start - game.timeFromStart();
				if (timeToNote > game.timeToShow) break;
				i++;
			}
			// Push all the notes to be shown to the renderer's list and show them
			for (var j = game.song.notes.lastShownIndex + 1; j < i; j++) {
				note = game.song.notes[j];
				game.show_note(note);
			}
			game.song.notes.lastShownIndex = i-1;
		}
	}

	this.create_note_geometries = function(notes) {
		for (var i = 0; i < notes.length; i++) {
			this.create_note_geometry(notes[i]);
		}
	}

	// Call this for each note after initializing graphics
	this.create_note_geometry = function(note) { 
		var pathVec2 = this.neckDir.clone().multiplyScalar(this.game.NOTE_SPEED * note.length);
		var notePath = new THREE.LineCurve(new THREE.Vector3(0, 0, 0), pathVec2);
		//notePath.v2.multiplyScalar(this.game.NOTE_SPEED * note.length);
		var options = {
			amount: 0, curveSegments: 3,
			bevelEnabled: false,
			material: 0, extrudeMaterial: 1,
			extrudePath: notePath
		};
		var noteGeometry = new THREE.ExtrudeGeometry( noteShape, options );
		noteGeometry.applyMatrix(noteTranslationX);
		var material = new THREE.MeshPhongMaterial({color: 0xff1111});
		var noteMesh = new THREE.Mesh( noteGeometry, material );
		var n = note.label;
		note.mesh = noteMesh;
		note.mesh.position.copy(NOTES_POS_DELTA);
		note.mesh.position.multiplyScalar(n);
		note.mesh.position.add(NOTES_POS_0);
		
	}

	this.init_score3d = function() {		
		var text = "0",

				height = 0.1,
				size = 0.5,
				hover = 1,

				curveSegments = 2,

				bevelThickness = 0.01,
				bevelSize = 0.01,
				bevelSegments = 2,
				bevelEnabled = true;

		var text_geometry = new THREE.TextGeometry( text, {
			size: size,
			height: height,
			curveSegments: curveSegments,
			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: bevelEnabled, 
		});

		var text_material = new THREE.MeshPhongMaterial({color: 0x11ff11});
		this.score3d = new THREE.Mesh(text_geometry, text_material);
		this.score3d.position = new THREE.Vector3(-6, 2.5, 0);
		this.scene.add(this.score3d);
	}
	this.init_scene();
	this.init_score3d();
}

Graphics.prototype = {
	setScores: function(score) {
		var text = score.toString(),

				height = 0.1,
				size = 0.5,
				hover = 1,

				curveSegments = 2,

				bevelThickness = 0.01,
				bevelSize = 0.01,
				bevelSegments = 2,
				bevelEnabled = true;

		var text_geometry = new THREE.TextGeometry( text, {
			size: size,
			height: height,
			curveSegments: curveSegments,
			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: bevelEnabled, 
		});

		this.scene.remove(this.score3d);

		var text_material = new THREE.MeshPhongMaterial({color: 0x11ff11});
		this.score3d = new THREE.Mesh(text_geometry, text_material);
		this.score3d.position = new THREE.Vector3(-6, 2.5, 0);
		this.scene.add(this.score3d);

	}
}
