function Game(song) {
	this.graphics = new Graphics();
	this.song = song;
	var pressedNotes = new Array();
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
			if (timeDiff > 500) camera.position.z = 10;
			else if (timeDiff < -500) camera-position.z = 1;
			else camera.position.z = 3;
			pressedNotes.push(note);
			nextNote++;
		}
		return false; // Suppress default event
	}
}
