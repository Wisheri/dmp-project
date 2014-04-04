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
	this.lastUpdateTime = 0;
	this.lastScore = 0;


}

Game.prototype = {
	NOTE_SPEED: 0.004, // 0.004 units/ms
	NOTE_ACCURACY: 150, // 300ms accuracy required for the player to hit the notes	

	show_note: function(note) {
		var timeDiff = note.start - this.timeFromStart();
		//note.mesh.translateOnAxis(this.graphics.neckDir, timeDiff * this.NOTE_SPEED);
		
		var vecDelta = this.graphics.neckDir.clone();
		vecDelta.multiplyScalar(timeDiff * this.NOTE_SPEED);
		note.head_mesh.position.add(vecDelta);
		note.mesh.position.add(vecDelta);

		this.graphics.scene.add(note.mesh);
		this.graphics.scene.add(note.head_mesh);
		//this.graphics.notes.push(note);
	},
	
	set_note_positions: function(timeFromStart) {
		for (var i = this.song.notes.lastShownIndex; i > this.song.notes.lastDisappearedIndex; i--) {
			var note = this.song.notes[i];
			this.set_note_position(note, timeFromStart);
		}
	},
	
	set_note_position: function(note, timeFromStart) {
		var buffer = 1000; // Wait 1 sec before removing the note to make sure it's already out of view
		var endTimeDiff = note.end - timeFromStart;
		if (endTimeDiff < 0 - buffer) {
			this.graphics.scene.remove(note.mesh);
			this.graphics.scene.remove(note.head_mesh);
			if (endTimeDiff < 5000) {
				this.song.notes.lastDisappearedIndex = this.song.notes.indexOf(note); // TODO: really define the last disappeared note
			}
		}
	
	
		var timeDiff = note.start - timeFromStart;
	
		var pos = this.graphics.NOTES_POS_0.clone();
		pos.add(this.graphics.NOTES_POS_DELTA.clone().multiplyScalar(note.label));
		
		var vecDelta = this.graphics.neckDir.clone();
		vecDelta.multiplyScalar(timeDiff * this.NOTE_SPEED);
		
		pos.add(vecDelta);
		note.mesh.position = pos;
		note.head_mesh.position = pos;
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
			this.pressedNotes[label].mesh.material = globals.game.graphics.get_note_material(label, false);
			this.pressedNotes[label].head_mesh.material = globals.game.graphics.get_note_material(label, false);
			globals.game.graphics.pointLights[label].visible = false;
		}
	},
	
	update: function() {
		var timeFromStart = this.timeFromStart();
		
		if (timeFromStart / 1000 > document.getElementById('example_song').duration) {
			/**
			*	The song has ended
			*/
			cancelAnimationFrame(animate);
			window.location = "../highscore?a=" + globals.game.score.toString();
		}
		
		this.updateScores(timeFromStart);
		this.lastUpdateTime = timeFromStart;
		
		this.getNotesToShow();
		this.stopNotes(timeFromStart);
		//this.set_note_positions(timeFromStart);
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
		//if (Math.floor(this.lastScore / 20) < Math.floor(this.score / 20)) {
			this.graphics.setScores(this.score);
		//}
		this.lastScore = this.score;
	},
	
	getNotesToShow: function() {
			var i = this.song.notes.lastShownIndex + 1;
			var bufferTime = 300;
			while (i < this.song.notes.length) {
				var note = this.song.notes[i];
				var timeToNote = note.start - this.timeFromStart();
				if (timeToNote > this.timeToShow - bufferTime) break;
				i++;
			}
			// Push all the notes to be shown to the renderer's list and show them
			for (var j = this.song.notes.lastShownIndex + 1; j < i; j++) {
				var note = this.song.notes[j];
				this.show_note(note);
			}
			this.song.notes.lastShownIndex = i-1;
		}
}
