function Controls(game) {
	this.game = game;
	this.buttonsDown = [false, false, false, false, false];	
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
	if (global.started == false) { //Menu
		return false;
	}
	if (keyCode == globals.controls.labelToKeyMap[0]) {
		globals.controls.buttonsDown[0] = true;
	}
	else if (keyCode == globals.controls.labelToKeyMap[1]) {
		globals.controls.buttonsDown[1] = true;
	}
	else if (keyCode == globals.controls.labelToKeyMap[2]) {
		globals.controls.buttonsDown[2] = true;
	}
	else if (keyCode == globals.controls.labelToKeyMap[3]) {
		globals.controls.buttonsDown[3] = true;
	}
	else if (keyCode == globals.controls.labelToKeyMap[4]) {
		globals.controls.buttonsDown[4] = true;
	}
	else if (keyCode == 13) { //ENTER
		for (var i = 0; i < globals.controls.buttonsDown.length; i++) {
			var isDown = globals.controls.buttonsDown[i];
			if (isDown) {
				globals.controls.keyPressed(i);
			}
		}
	}
	return false;
}

document.onkeyup = function(e) {
	e = e || window.event;
	e.preventDefault();
	var keyCode = e.keyCode;
	if (keyCode == globals.controls.labelToKeyMap[0]) {
		globals.controls.buttonsDown[0] = false;
		globals.game.stopNote(0);
	}
	else if (keyCode == globals.controls.labelToKeyMap[1]) {
		globals.controls.buttonsDown[1] = false;
		globals.game.stopNote(1);
	}
	else if (keyCode == globals.controls.labelToKeyMap[2]) {
		globals.controls.buttonsDown[2] = false;
		globals.game.stopNote(2);
	}
	else if (keyCode == globals.controls.labelToKeyMap[3]) {
		globals.controls.buttonsDown[3] = false;
		globals.game.stopNote(3);
	}
	else if (keyCode == globals.controls.labelToKeyMap[4]) {
		globals.controls.buttonsDown[4] = false;
		globals.game.stopNote(4);
	}
	return false;
}