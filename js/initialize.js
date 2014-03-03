var globals = new Object();
globals.renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

globals.renderer = new THREE.WebGLRenderer();
globals.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(globals.renderer.domElement);
var menu = new Menu();
menu_render();
function menu_render() {
	requestAnimationFrame(menu_render);

	menu.hello_text.rotation.x += 0.01;
	globals.renderer.render(menu.scene, menu.camera);
}

var renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

Menu();
