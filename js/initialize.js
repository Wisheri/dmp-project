var globals = new Object();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
globals.renderManager = new THREE.Extras.RenderManager(renderer);

globals.menu = new Menu();
animate();
function render_menu(delta, renderer) {
	this.objects.text.rotation.x += delta;
	renderer.render(this.scene, this.camera);
};

function render_game() {
	requestAnimationFrame(render_game);
	globals.renderer.render(globals.game.graphics.scene, globals.game.graphics.camera);
};

function startGame(song) {
	globals.game = new Game(song);
	render_game();
}

function animate() {
	requestAnimationFrame(animate);
	globals.renderManager.renderCurrent();
}