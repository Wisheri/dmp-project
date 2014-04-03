function Graphics(game) {
	this.game = game;
	this.keyMeshes = new Array();
	this.pointLights = new Array();
	this.emitterStartTimes = [0, 0, 0, 0, 0];
	this.keyPositions = new Array();
	this.LINE_POS = new Object();
	this.particleGroup = new Object();
	// Constants
	var NECK_WIDTH = 5;
	var NECK_LENGTH = 40;
	var NOTE_WIDTH = 1.0; // This depends on the shape of the note!	
	this.LENGTH_TO_LINE = 22;
	var NOTES_POS_0 = new THREE.Vector3(-NECK_WIDTH/2 + NECK_WIDTH / 10, -NECK_LENGTH/2 + this.LENGTH_TO_LINE,0); // Later rotated with neckRotation
	this.NOTES_POS_0 = NOTES_POS_0;
	// Later note positions can be initialized to NOTES_POS_0 + n*NOTES_POS_DELTA
	var NOTES_POS_DELTA = new THREE.Vector3(NECK_WIDTH / 5, 0, 0); // Later rotated with neckRotation 
	this.NOTES_POS_DELTA = NOTES_POS_DELTA;
	
	this.score3d = new Object();

	var notePoints = [];
	var noteMiddle = 0.5;
	notePoints.push( new THREE.Vector2 (   0,  0 ) );
	var notePath = new THREE.Path(notePoints);
	notePoints.push( new THREE.Vector2 (   0,  0.05 ) );
	notePoints.push( new THREE.Vector2 (   0.12,  0.07 ) );
	notePoints.push( new THREE.Vector2 (   0.22,  0.13 ) );
	notePoints.push( new THREE.Vector2 (   0.77,  0.13 ) );
	notePoints.push( new THREE.Vector2 (   0.87,  0.07 ) );
	notePoints.push( new THREE.Vector2 (   0.99,  0.05 ) );
	notePoints.push( new THREE.Vector2 (   0.99,  0 ) );
	notePath.splineThru(notePoints);

	var noteShape = notePath.toShapes(true)[0];
	var noteTranslationX = new THREE.Matrix4(1, 0, 0, noteMiddle,
						0, 1, 0, 0,
						0, 0, 1, 0,
						0, 0, 0, 1);
	var neckSide = new THREE.Vector3(1, 0, 0).normalize();
	var neckUp = new THREE.Vector3(0, 1, -1).normalize();
	this.neckUp = neckUp;
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

	var LINE_POS = new THREE.Vector3(0,-NECK_LENGTH/2 + this.LENGTH_TO_LINE,0);
	LINE_POS.applyEuler(neckEuler);
	this.LINE_POS = LINE_POS;

	this.notes = new Array();
	
	this.init_scene = function () {
		/* -------*/
		/*	Scene */
		/* -------*/

		this.scene = new THREE.Scene();
		this.scene.add(this.particleGroup.mesh);	
		/* -------*/
		/* Camera */
		/* -------*/

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		this.camera.lookAt(new THREE.Vector3(0, 0, -1));
		this.camera.position.z = 5;
		
		/* 
		Keys
		 */
		 
		for (var i = 0; i < 5; i++) {
			var geometry = new THREE.TorusGeometry(0.35, 0.1, 20, 40);
			var key = new THREE.Mesh( geometry, this.get_key_material(i, false) );
			key.rotation = neckEuler;
			key.position = NOTES_POS_0.clone();
			key.position.add(NOTES_POS_DELTA.clone().multiplyScalar(i));
			key.translateOnAxis(neckUp, this.KEY_HEIGHT);
			this.keyMeshes.push(key);
			this.scene.add( key );
		}
		 
		/* ----------- */
		/* Guitar neck */
		/* ----------- */

		var neck_material = new THREE.MeshPhongMaterial({map: globals.textures['neck']});	
		this.neck = new THREE.Mesh(globals.geometries.guitar_geometry, globals.materials.guitar_material);
		this.neck.castShadow = true;
		this.neck.receiveShadow = true;
		
		this.neck.geometry.applyMatrix(this.NECK_SCALE);
		this.neck.geometry.applyMatrix(this.NECK_SCALE_X);
		this.neck.rotation = neckEuler.clone();
		this.neck.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2);
		this.neck.translateOnAxis(new THREE.Vector3(0, 1, 0), -2.2);
		this.neck.translateOnAxis(new THREE.Vector3(0, 0, 1), -7);
		this.neck.translateOnAxis(new THREE.Vector3(1, 0, 0), 0.1);
		this.scene.add(this.neck);

		/* ----------- */
		/*    Light    */
		/* ----------- */
		if (renderer.shadowMapEnabled) {
			this.light = new THREE.SpotLight(0xffffff);
			this.light.castShadow = true;
			this.light.shadowMapWidth = 1024;
			this.light.shadowMapHeight = 1024;
			
			this.light.shadowCameraNear = 5;
			this.light.shadowCameraFar = -5;
			this.light.shadowCameraFov = 50;
			this.light.position.set(0, 10, 5);
		}
		else {
			this.light = new THREE.DirectionalLight(0xffffff, 0.6);
			this.light.position.set(0, 1, 0.5);
			/*this.light.shadowCameraVisible = true;
			this.light.shadowDarkness = 0.5;
			this.light.shadowCameraVisible = true;
			this.light.shadowCameraNear = -5;
			this.light.shadowCameraFar = 5;
			this.light.shadowCameraLeft = -5;
			this.light.shadowCameraRight = 5;
			this.light.shadowCameraTop = 5;
			this.light.shadowCameraBottom = -5;
			this.light.shadowMapWidth = 1000;
			this.light.shadowMapHeight = 1000;*/
		}

		this.scene.add(this.light);
		var ambientLight = new THREE.AmbientLight( 0x101010 ); // soft white light
		//this.scene.add( ambientLight );

		for (var i = 0; i < 5; i++) {
			//var pointLight = new THREE.PointLight( this.LABEL_TO_COLOR_MAP[i], 5, 1);
			var pointLight = new THREE.PointLight( 0xffffff, 5, 3);
			pointLight.position = NOTES_POS_0.clone().add(NOTES_POS_DELTA.clone().multiplyScalar(i));
			pointLight.translateOnAxis(neckUp, this.KEY_HEIGHT);
			pointLight.visible = false;
			this.pointLights.push(pointLight);
			this.scene.add( pointLight );
		}
		
		/* ------------ */
		/*  Background  */
		/* ------------ */

		this.backgroundMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(2,2,0),
			new THREE.MeshBasicMaterial({
				map: globals.textures['background']
			}));

		this.backgroundMesh.material.depthTest = false;
		this.backgroundMesh.material.depthWrite = false;

		this.backgroundScene = new THREE.Scene();
		this.backgroundCamera = new THREE.Camera();

		this.backgroundScene.add(this.backgroundCamera);
		this.backgroundScene.add(this.backgroundMesh);

	}
	
	
    /* ------------ */
	/*  RENDER  	*/
	/* ------------ */
	function render_game(delta, renderer) { 
		var deltaMs = delta * 1000;
		var game = this.objects.game;
		this.objects.particleGroup.tick(delta);
		// Rotate light
		this.objects.light.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta);		

		for (var i = globals.game.song.notes.lastDisappearedIndex; i <= globals.game.song.notes.lastShownIndex; i += 1) {
			if (i == -1) continue;
			var dir = this.objects.neckDir;
			var note = globals.game.song.notes[i];
			//note.mesh.translateOnAxis(dir, -game.NOTE_SPEED*deltaMs);
			/*var vecDelta = dir.clone();
			vecDelta.multiplyScalar(-game.NOTE_SPEED*deltaMs);
			note.head_mesh.position.add(vecDelta);
			note.mesh.position.add(vecDelta);*/
			globals.game.set_note_position(note, globals.game.timeFromStart());
		}
		
		globals.game.graphics.stopEmitters(globals.game.timeFromStart());
		
		/**
		*	The song has ended
		*/
		if ((globals.game.timeFromStart() / 1000) > document.getElementById('example_song').duration) {
			window.location = "../highscore?a=" + globals.game.score.toString();
		}		
		

		renderer.autoClear = false;
		renderer.clear();
		renderer.render(this.objects.backgroundScene, this.objects.backgroundCamera);
		renderer.render(this.scene, this.camera);
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
			amount: 0, curveSegments: 7,
			bevelEnabled: false,
			material: 0, extrudeMaterial: 1,
			extrudePath: notePath
		};
		var noteGeometry = new THREE.ExtrudeGeometry( noteShape, options );
		noteGeometry.applyMatrix(noteTranslationX);
		var noteMesh = new THREE.Mesh( noteGeometry, this.get_note_material(note.label, false) );
		var n = note.label;
		note.mesh = noteMesh;
		note.mesh.position.copy(NOTES_POS_DELTA);
		note.mesh.position.multiplyScalar(n);
		note.mesh.position.add(NOTES_POS_0);
		note.mesh.castShadow = true;
		note.mesh.receiveShadow = true;
		
		// Create the head mesh
		note.head_mesh = new THREE.Mesh( globals.geometries.note_head_geometry, this.get_note_material(note.label, false) );
		note.head_mesh.rotation = neckEuler.clone();
		note.head_mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2);
		note.head_mesh.position.copy(NOTES_POS_DELTA);
		note.head_mesh.position.multiplyScalar(n);
		note.head_mesh.position.add(NOTES_POS_0);
		note.head_mesh.castShadow = true;
		note.head_mesh.receiveShadow = true;
	}

	this.init_score3d = function() {
		this.scoreText = document.createElement('div');
		this.scoreText.style.position = 'absolute';
		this.scoreText.style.zIndex = 1;
		this.scoreText.style.width = 100;
		this.scoreText.style.height = 100;
		this.scoreText.style.color = "red";
		this.scoreText.style.fontSize = 70;
		this.scoreText.style.fontFamily = "Lucida Console";
		this.scoreText.innerHTML = "score: 0";
		this.scoreText.style.top = 50 + 'px';
		this.scoreText.style.left = 50 + 'px';
		document.body.appendChild(this.scoreText);
	}

	this.init_particle_system = function () {
		this.particleGroup = new SPE.Group({
			texture: THREE.ImageUtils.loadTexture('../files/testparticle2.png'),
			blending: THREE.AdditiveBlending,
			maxAge: 0.3
		});
		
		for (var i = 0; i < 5; i++) {
			var emitter = new SPE.Emitter({
				position: NOTES_POS_0.clone().add(NOTES_POS_DELTA.clone().multiplyScalar(i)),
				positionSpread: new THREE.Vector3(0, 0, 0),

				acceleration: new THREE.Vector3(0, 10, 0),
				accelerationSpread: new THREE.Vector3(0, 0, 0),

				velocity: new THREE.Vector3(0, 13, 0),
				velocitySpread: new THREE.Vector3(3, 0, 3),
				
				opacityStart: 0.5,
				opacityEnd: 0.0,
				
				colorStart: new THREE.Color('red'),
				colorEnd: new THREE.Color('white'),

				sizeStart: 0.5,
				sizeEnd: 2.5,

				particleCount: 50
			});

			this.particleGroup.addEmitter(emitter);
			emitter.disable(); // Emitters initially disabled, of course
		}
	}

	this.init_particle_system();
	this.init_scene();
	this.init_score3d();
	this.create_note_geometries(globals.song.notes);
	globals.renderManager.add('game', this.scene, this.camera, render_game, 
				{game: this.game, notes: this.game.song.notes, neckDir: this.neckDir, light: this.light, backgroundScene: this.backgroundScene, 
				backgroundCamera: this.backgroundCamera,
				particleGroup: this.particleGroup});
	globals.renderManager.setCurrent('game');
}

Graphics.prototype = {
	NOTE_MATERIAL_NOT_PRESSED: new THREE.MeshPhongMaterial({color: 0xffff11, specular: 0xffff11, 
								shininess: 10, wrapAround: true, wrapRGB: new THREE.Vector3(1, 1 ,1)}),
								
	NOTE_MATERIAL_PRESSED: new THREE.MeshPhongMaterial({color: 0xffff11, specular: 0xffffff, emissive: 0x999999,
								 shininess: 100, wrapAround: true, wrapRGB: new THREE.Vector3(1, 1 ,1)}),
								 
	KEY_MATERIAL_NOT_PRESSED: new THREE.MeshPhongMaterial({color: 0x11ffff, specular: 0x11ffff, emissive: 0x117777, 
								shininess: 10, wrapAround: true, wrapRGB: new THREE.Vector3(1, 1 ,1),
								transparent: true, opacity: 0.5}),
								
	KEY_MATERIAL_PRESSED: new THREE.MeshPhongMaterial({color: 0x11ffff, specular: 0x11ffff, emissive: 0x999999,
								 shininess: 100, wrapAround: true, wrapRGB: new THREE.Vector3(1, 1 ,1)}),
								 
	NECK_SCALE: new THREE.Matrix4(5, 0, 0, 0,
								0, 5, 0, 0,
								0, 0, 5, 0,
								0, 0, 0, 0),
	NECK_SCALE_X: new THREE.Matrix4(1.6, 0, 0, 0,
								0, 1, 0, 0,
								0, 0, 1, 0,
								0, 0, 0, 0),
								
	POINTLIGHT_HEIGHT: 0.5,							
	
	KEY_HEIGHT: 0.22,
	KEY_HEIGHT_CHANGE: 0.12, // How much the height changes on keydown
	
	FLAME_EMITTER_AGE: 100, // How many milliseconds the flames will emit
	
	LABEL_TO_COLOR_MAP: [new THREE.Color(0x0000ff) /*blue*/, new THREE.Color(0x00ff00) /*green*/, new THREE.Color(0xff0000) /*red*/,
						new THREE.Color(0xffff00) /*yellow*/, new THREE.Color(0xff6600) /*orange*/],
	
	get_note_material: function(label, pressed) {
		var material = new Object();
		if (!pressed) {
			material = this.NOTE_MATERIAL_NOT_PRESSED.clone();
			material.color = this.LABEL_TO_COLOR_MAP[label];
			material.specular = this.LABEL_TO_COLOR_MAP[label];
		} else {
			material = this.NOTE_MATERIAL_PRESSED.clone();
			material.color = this.LABEL_TO_COLOR_MAP[label];
		}
		return material.clone();
	},
	
	get_key_material: function(label, pressed) {
		var material = new Object();
		if (!pressed) {
			material = this.KEY_MATERIAL_NOT_PRESSED.clone();
			material.color = this.LABEL_TO_COLOR_MAP[label];
			material.specular = this.LABEL_TO_COLOR_MAP[label];
		} else {
			material = this.KEY_MATERIAL_PRESSED.clone();
			material.color = this.LABEL_TO_COLOR_MAP[label];
			material.specular = this.LABEL_TO_COLOR_MAP[label];
		}
		return material.clone();
	},
	
	setScores: function(score) {
		var text = "score: " + score.toString();
		this.scoreText.innerHTML = text;
	},
	
	stopEmitters: function(timeFromStart) {
		for (var i = 0; i < 5; i++) {
			var t = this.emitterStartTimes[i];
			var diff = timeFromStart - t;
			if (diff > this.FLAME_EMITTER_AGE) {
				this.particleGroup.emitters[i].disable();
				this.pointLights[i].visible = false;
			}
		}
	}
}
