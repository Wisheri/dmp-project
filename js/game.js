function Game(song) {
	this.controls = globals.controls; 
	this.score = 0;
	var example_song = document.getElementById('example_song');
	example_song.play();
	this.startTime = this.currentTime();
	this.song = song;
	this.graphics = new Graphics(this);
	this.timeToShow =  this.graphics.LENGTH_TO_LINE / this.NOTE_SPEED;
	this.pressedNotes = new Array();
	// Initialize array to avoid errors
	for (var i = 0; i < 5; i++) {
		this.pressedNotes[i] = new Note(0, 0, 0);
	}
	var nextNote = 0;
	//this.graphics.init_scene();
	this.song.notes.lastShownIndex = -1;
	this.lastUpdateTime = new Object();
	this.lastScore = 0;


}

Game.prototype = {
	NOTE_SPEED: 0.004, // 0.004 units/ms
	NOTE_ACCURACY: 150, // 300ms accuracy required for the player to hit the notes	

	show_note: function(note) {
		var timeDiff = note.start - this.timeFromStart();
		note.mesh.translateOnAxis(this.graphics.neckDir, timeDiff * this.NOTE_SPEED);
		
		var vecDelta = this.graphics.neckDir.clone();
		vecDelta.multiplyScalar(timeDiff * this.NOTE_SPEED);
		note.head_mesh.position.add(vecDelta);

		this.graphics.scene.add(note.mesh);
		this.graphics.scene.add(note.head_mesh);
		this.graphics.notes.push(note);
	},	

	currentTime: function() {
		var d = new Date();
		return d.getTime();
	},

	timeFromStart: function() {
		var currTime = this.currentTime();
		return currTime - this.startTime;
	},

	stopNote: function(label) {
		if (this.pressedNotes[label].isPressed) {
			this.pressedNotes[label].isPressed = false;
			this.pressedNotes[label].mesh.material = globals.game.graphics.NOTE_MATERIAL_NOT_PRESSED.clone();
			this.pressedNotes[label].head_mesh.material = globals.game.graphics.NOTE_MATERIAL_NOT_PRESSED.clone();
		}
	},
	
	update: function() {
		var timeFromStart = this.timeFromStart();
		this.updateScores(timeFromStart);
		this.stopNotes(timeFromStart);
		this.lastUpdateTime = timeFromStart;
	},

	stopNotes: function(timeFromStart) {
		for (var i = 0; i < this.pressedNotes.length; i++) {
			var note = this.pressedNotes[i];
			if (note.end <= timeFromStart && note.isPressed) {
				this.stopNote(i);
			}
		}
	},

	updateScores: function(timeFromStart) {
		for (var i = 0; i < this.pressedNotes.length; i++) {
			if (this.pressedNotes[i].isPressed) {
				var afterEnd = Math.max(0, timeFromStart - Math.round(this.pressedNotes[i].end));
				var afterLastUpdate = Math.max(0, timeFromStart - this.lastUpdateTime);
				var beforeStart = Math.max(0, Math.min(Math.round(this.pressedNotes[i].start)
					 - this.lastUpdateTime, afterLastUpdate));
				this.score += afterLastUpdate - afterEnd - beforeStart;
			}
		}
		if (Math.floor(this.lastScore / 150) < Math.floor(this.score / 150)) {
			this.graphics.setScores(this.score);
		}
		this.lastScore = this.score;
	}
}
