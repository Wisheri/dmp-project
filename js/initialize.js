var globals = new Object();
globals.renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

globals.renderer = new THREE.WebGLRenderer();
globals.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(globals.renderer.domElement);
globals.menu = new Menu();

function render_menu() {
	requestAnimationFrame(render_menu);

	globals.menu.hello_text.rotation.x += 0.01;
	globals.renderer.render(globals.menu.scene, globals.menu.camera);
};

function render_game() {
	requestAnimationFrame(render_game);
	globals.renderer.render(globals.game.graphics.scene, globals.game.graphics.camera);
};

var renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

Menu();
