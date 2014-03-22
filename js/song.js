function Song(text) {
	this.notes = new Array();
	this.parseNotes(text);	
	globals.song = this;
	startGame(this);
}

Song.prototype = {
	parseNotes: function(noteStr) {
		var noteLen = 1000;
		var currentTime = 0;
		for (var i=0;i<noteStr.length;i++) 
		{
			var currentChar = noteStr.charAt(i);
			if ( ['A', 'B', 'C', 'D', 'E'].indexOf(currentChar) >= 0 ) 
			{
				var DBG_label = globals.labels[currentChar];
				this.notes.push(new Note(globals.labels[currentChar], currentTime, currentTime + noteLen));
				currentTime += noteLen;
			}
		}
	},
	
	getClosestNote: function(label) {
		var minTimeDiff = Number.MAX_VALUE;
		var currentClosest;
		for (var i = 0; i < this.notes.length; i++) {
			var timeDiff = Math.abs(globals.game.timeFromStart() - this.notes[i].start);
			if (this.notes[i].label == label && timeDiff < minTimeDiff) {
				minTimeDiff = timeDiff;
				currentClosest = this.notes[i];
			}
		}
		return currentClosest;
	}
}

function Note(label, start, end) {
	this.label = label;
	this.start = start;
	this.end = end;
	this.length = end-start;
	this.isShown = false;	
	this.isPressed = false;
}

/*/var oRequest = new XMLHttpRequest();
	var sURL = "\testi.txt";

	oRequest.open("GET",sURL,false);
	oRequest.setRequestHeader("User-Agent",navigator.userAgent);
	oRequest.send(null);
	if (oRequest.status==200) alert(oRequest.responseText);
	else alert("Error executing XMLHttpRequest call!");/*/

