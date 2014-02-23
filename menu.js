	
function menu_render() {
	requestAnimationFrame(menu_render);

	hello_text.rotation.x += 0.01;
	renderer.render(scene, camera);
}

