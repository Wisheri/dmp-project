function Game(song) {
	this.graphics = new Graphics();
	this.song = song;
	var pressedNotes = new Array();
	this.graphics.greate_note_geometries(song.notes);
	var nextNote = 0;
	var startTime;
	this.graphics.init_scene();

	function currentTime() {
		var d = new Date();
		return d.getTime();
	}

	function timeFromStart() {
		var currTime = currentTime();
		return currTime - startTime;
	}

	document.onkeydown = function(e) {
		e = e || window.event;
		e.preventDefault();
		var keyCode = e.keyCode;
		if (keyCode == 112 /*F1*/) {
			var note = notes[nextNote];
			var timeDiff = timeFromStart() - note.start;
			if (timeDiff > 500) graphics.camera.position.z = 10;
			else if (timeDiff < -500) graphics.camera.position.z = 1;
			else camera.position.z = 3;
			pressedNotes.push(note);
			nextNote++;
		}
		return false; // Suppress default event
	}

	document.onkeydown = function(e) {
		var len = 3;
		e = e || window.event;
		e.preventDefault();
		var keyCode = e.keyCode;
		if (keyCode == 49) {
			globals.game.graphics.create_note('A', len);
		}
		else if (keyCode == 50) {
			globals.game.graphics.create_note('B', len);
		}
		else if (keyCode == 51) {
			globals.game.graphics.create_note('C', len);
		}
		else if (keyCode == 52) {
			globals.game.graphics.create_note('D', len);
		}
		else if (keyCode == 53) {
			globals.game.graphics.create_note('E', len);
		}
		return false;
	}
}
