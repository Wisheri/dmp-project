function Game(song) {
	this.controls = new Controls(this);
	globals.controls = this.controls;
	var example_song = document.getElementById('example_song');
	example_song.play();
	this.startTime = this.currentTime();
	this.graphics = new Graphics(this);
	this.timeToShow =  this.graphics.LENGTH_TO_LINE / this.NOTE_SPEED;
	this.song = song;
	this.pressedNotes = new Array();
	this.graphics.create_note_geometries(song.notes);
	var nextNote = 0;
	this.graphics.init_scene();
	this.song.notes.lastShownIndex = -1;	


}

Game.prototype = {
	NOTE_SPEED: 0.002, // 0.002 units/ms
	NOTE_ACCURACY: 300, // 300ms accuracy required for the player to hit the notes	

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
	},

	stopNote: function(label) {
		for (var i = 0; i < this.pressedNotes.length; i++) {
			if (this.pressedNotes[i].label == label) {
				this.pressedNotes[i].isPressed = false;
				var values = { color: new THREE.Color(0xff0000) };
				this.pressedNotes[i].mesh.material.setValues(values);
				this.pressedNotes.splice(i, 1);
			}
		}
	}
}
