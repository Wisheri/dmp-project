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

	var neckDir = new THREE.Vector3( -70, 0, 0 );
	for (var i = 0; i < globals.game.graphics.balls.length; i += 1) {
		globals.game.graphics.balls[i].translateZ(0.01);
		globals.game.graphics.balls[i].translateX(0);
		globals.game.graphics.balls[i].translateY(-0.01);
	}
	
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
