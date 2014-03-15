var globals = new Object();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
globals.renderManager = new THREE.Extras.RenderManager(renderer);

globals.menu = new Menu();
animate();

function startGame(song) {
	globals.game = new Game(song);
	var example_song = document.getElementById('example_song');
	example_song.play();
	animate();
}

function animate() {
	requestAnimationFrame(animate);
	globals.renderManager.renderCurrent();
}