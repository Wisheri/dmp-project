function Game(song) {
	var example_song = document.getElementById('example_song');
	example_song.play();
	var startTime = currentTime();
	this.graphics = new Graphics(this);
	this.timeToShow = this.NOTE_SPEED * this.graphics.LENGTH_TO_LINE;
	this.song = song;
	var pressedNotes = new Array();
	this.graphics.create_note_geometries(song.notes);
	var nextNote = 0;
	this.graphics.init_scene();
	this.song.notes.lastShownIndex = 0;	

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
			globals.game.graphics.show_note('A', len);
		}
		else if (keyCode == 50) {
			globals.game.graphics.show_note('B', len);
		}
		else if (keyCode == 51) {
			globals.game.graphics.show_note('C', len);
		}
		else if (keyCode == 52) {
			globals.game.graphics.show_note('D', len);
		}
		else if (keyCode == 53) {
			globals.game.graphics.show_note('E', len);
		}
		return false;
	}
}

Game.prototype = {
	NOTE_SPEED: 2,
	

	show_note: function(note) {
		var timeDiff = note.start - timeFromStart();
		note.mesh.translateOnAxis(new THREE.Vector3(0, 0, 1), timeDiff * NOTE_SPEED);
		this.scene.add(note);
		this.notes.push(note);
	}	
}
