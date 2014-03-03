var globals = new Object();
globals.renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

globals.renderer = new THREE.WebGLRenderer();
globals.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(globals.renderer.domElement);
var menu = new Menu();

var renderManager = new THREE.Extras.RenderManager(new THREE.WebGLRenderer());

Menu();
