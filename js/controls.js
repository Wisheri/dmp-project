function Controls() {
	this.buttonsDown = [false, false, false, false, false];	
}

Controls.prototype = {
	//labelToKeyMap: [112, 112, 114, 115, 116],
	labelToKeyMap: [49, 50, 51, 52, 53],
	
	keyPressed: function(label) {
		var closestNote = globals.song.getClosestNote(label);
		var timeDiff = Math.abs(globals.game.timeFromStart() - closestNote.start);
		if (timeDiff < globals.game.NOTE_ACCURACY) {
			if (globals.game.pressedNotes[label].isPressed) {
				globals.game.stopNote(label);
			}
			globals.game.pressedNotes[label] = closestNote;
			closestNote.mesh.material = globals.game.graphics.NOTE_MATERIAL_PRESSED.clone();
			closestNote.head_mesh.material = globals.game.graphics.NOTE_MATERIAL_PRESSED.clone();
			closestNote.isPressed = true;
		}
	}


}

function menukeydown(keyCode){
	if (keyCode == 13 /*ENTER*/ && globals.are_geometries_ready()) {
		var song_request = new XMLHttpRequest();
		song_request.open("get", "files/abc2.txt", false);
		song_request.send(null);

		if (song_request.status == 200){
			globals.started = true; //Signaling that the game has started.

			new Song(song_request.responseText);
		}
			
		else alert("Error executing XMLHttpRequest call!");
	}
}

document.onkeydown = function(e) {
	e = e || window.event;
	e.preventDefault();
	var keyCode = e.keyCode;
	if (globals.started == false){
		menukeydown(keyCode);
	}
	else if (keyCode == globals.controls.labelToKeyMap[0]) {
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
