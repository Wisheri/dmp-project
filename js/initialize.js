var globals = new Object();
globals.labels = new Array();
globals.labels['A'] = 0;
globals.labels['B'] = 1;
globals.labels['C'] = 2;
globals.labels['D'] = 3;
globals.labels['E'] = 4;

globals.textures = new Array();
globals.textures['neck'] = THREE.ImageUtils.loadTexture('../images/metalbox_full.png');
globals.textures['neck'].wrapS = THREE.RepeatWrapping;
globals.textures['neck'].wrapT = THREE.RepeatWrapping;
globals.textures['neck'].repeat.set(4,4);

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
	globals.renderManager.renderCurrent();
}
