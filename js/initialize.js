var globals = new Object();
globals.labels = new Array();
globals.labels['A'] = 0;
globals.labels['B'] = 1;
globals.labels['C'] = 2;
globals.labels['D'] = 3;
globals.labels['E'] = 4;

globals.controls = new Controls();

globals.geometries = new Object();
globals.materials = new Object();
globals.loaded_geometries = {noteHead: false, guitar: false};

load_geometries();
globals.textures = new Array();
globals.textures['neck'] = THREE.ImageUtils.loadTexture('../images/metalbox_full.png');
globals.textures['neck'].wrapS = THREE.RepeatWrapping;
globals.textures['neck'].wrapT = THREE.RepeatWrapping;
globals.textures['neck'].repeat.set(4,4);

globals.textures['background'] = THREE.ImageUtils.loadTexture('../images/8886.jpg');

globals.started = false;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
globals.renderManager = new THREE.Extras.RenderManager(renderer);

globals.menu = new Menu();
animate();

function startGame(song) {
	globals.game = new Game(song);
	animate();
}

function animate() {
	requestAnimationFrame(animate);
	if (globals.started) {
		globals.game.update();
	}
	globals.renderManager.renderCurrent();
}

globals.are_geometries_ready = function() {
	for (var i in globals.loaded_geometries) {
		if (globals.loaded_geometries[i] == false) return false;
	}
	return true;
}

function guitar_geometry_ready() {
	globals.loaded_geometries.guitar = true;
}

function note_head_geometry_ready() {
	globals.loaded_geometries.noteHead = true;
}

function load_geometries() {
	var loader = new THREE.JSONLoader(true);
	loader.onLoadComplete = note_head_geometry_ready;
	loader.load( "../files/note_model.js", this.load_note_head_geometry );
	var guitarLoader = new THREE.JSONLoader(true);
	guitarLoader.onLoadComplete = guitar_geometry_ready;
	guitarLoader.load( "../files/hairok_stratocaster.js", this.load_guitar_geometry );
}

function load_note_head_geometry(geometry) {
	globals.geometries.note_head_geometry = geometry;
}

function load_guitar_geometry(geometry, materials) {
	geometry.mergeVertices();
	geometry.computeVertexNormals();
	globals.geometries.guitar_geometry = geometry;
	globals.materials.guitar_material = new THREE.MeshFaceMaterial( materials );
}
