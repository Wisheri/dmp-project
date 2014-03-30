function Controls() {
	this.buttonsDown = [false, false, false, false, false];	
}

Controls.prototype = {
	//labelToKeyMap: [112, 112, 114, 115, 116],
	labelToKeyMap: [49, 50, 51, 52, 53],
	
	keyPressed: function(label) {
		var closestNote = globals.song.getClosestNote(label);
		if (closestNote != false) {
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

function gamekeydown(keyCode){
	if (keyCode == 13) { //ENTER
		for (var i = 0; i < globals.controls.buttonsDown.length; i++) {
			var isDown = globals.controls.buttonsDown[i];
			if (isDown) {
				globals.controls.keyPressed(i);
			}
		}
	} else {
		for (var i = 0; i < 5; i++) {
			if (globals.controls.labelToKeyMap[i] == keyCode) {
				if (globals.controls.buttonsDown[i] == false) {
					// Prevent continuous stroke
					globals.controls.buttonsDown[i] = true;
					var keyMesh = globals.game.graphics.keyMeshes[i];
					keyMesh.material = globals.game.graphics.KEY_MATERIAL_PRESSED.clone();
					keyMesh.translateOnAxis(globals.game.graphics.neckUp, -globals.game.graphics.KEY_HEIGHT_CHANGE);
				}
			}
		}
	}
}

document.onkeydown = function(e) {
	e = e || window.event;
	e.preventDefault();
	var keyCode = e.keyCode;
	if (globals.started == false){
		menukeydown(keyCode);
	} else {
		gamekeydown(keyCode);
	}
	return false;
}

document.onkeyup = function(e) {
	e = e || window.event;
	e.preventDefault();
	var keyCode = e.keyCode;
	for (var i = 0; i < 5; i++) {
		if (globals.controls.labelToKeyMap[i] == keyCode) {
			if (globals.controls.buttonsDown[i]) {
				globals.controls.buttonsDown[i] = false;
				var keyMesh = globals.game.graphics.keyMeshes[i];
				keyMesh.material = globals.game.graphics.KEY_MATERIAL_NOT_PRESSED.clone();
				globals.game.stopNote(i);
				keyMesh.translateOnAxis(globals.game.graphics.neckUp, globals.game.graphics.KEY_HEIGHT_CHANGE);
			}
		}
	}
	return false;
}
