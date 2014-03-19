function Controls(game) {
	this.game = game;
	
}

Controls.prototype = {
	//labelToKeyMap: [112, 112, 114, 115, 116],
	labelToKeyMap: [49, 50, 51, 52, 53],
	
	keyPressed: function(label) {
		var closestNote = globals.song.getClosestNote(label);
		var timeDiff = Math.abs(globals.game.timeFromStart() - closestNote.start);
		if (timeDiff < this.game.NOTE_ACCURACY) {
			this.game.pressedNotes.push(closestNote);
			var values = { color: new THREE.Color(0xffff00) };
			closestNote.mesh.material.setValues(values);
			closestNote.isPressed = true;
		}
	}


}

document.onkeydown = function(e) {
	e = e || window.event;
	e.preventDefault();
	var keyCode = e.keyCode;
	if (keyCode == globals.controls.labelToKeyMap[0]) {
		globals.controls.keyPressed(0);
	}
	else if (keyCode == globals.controls.labelToKeyMap[1]) {
		globals.controls.keyPressed(1);
	}
	else if (keyCode == globals.controls.labelToKeyMap[2]) {
		globals.controls.keyPressed(2);
	}
	else if (keyCode == globals.controls.labelToKeyMap[3]) {
		globals.controls.keyPressed(3);
	}
	else if (keyCode == globals.controls.labelToKeyMap[4]) {
		globals.controls.keyPressed(4);
	}
	return false;
}

