function Game(song) {
	var example_song = document.getElementById('example_song');
	example_song.play();
	this.startTime = this.currentTime();
	this.graphics = new Graphics(this);
	this.timeToShow =  this.graphics.LENGTH_TO_LINE / this.NOTE_SPEED;
	this.song = song;
	var pressedNotes = new Array();
	this.graphics.create_note_geometries(song.notes);
	var nextNote = 0;
	this.graphics.init_scene();
	this.song.notes.lastShownIndex = 0;	


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
	NOTE_SPEED: 0.002, // 0.002 units/ms
	

	show_note: function(note) {
		var timeDiff = note.start - this.timeFromStart();
		note.mesh.translateOnAxis(this.graphics.neckDir, timeDiff * this.NOTE_SPEED);
		this.graphics.scene.add(note.mesh);
		this.graphics.notes.push(note);
	},	

	currentTime: function() {
		var d = new Date();
		return d.getTime();
	},

	timeFromStart: function() {
		var currTime = this.currentTime();
		return currTime - this.startTime;
	}
}
