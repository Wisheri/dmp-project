var globals = new Object();
globals.renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

globals.renderer = new THREE.WebGLRenderer();
globals.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(globals.renderer.domElement);
globals.menu = new Menu();
render_menu();
function render_menu() {
	requestAnimationFrame(render_menu);

	globals.menu.hello_text.rotation.x += 0.01;
	globals.renderer.render(globals.menu.scene, globals.menu.camera);
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

var renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

Menu();
