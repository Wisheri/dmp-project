function Song(text) {
	this.notes = new Array();
	this.notes.lastShownIndex = -1;
	this.notes.lastDisappearedIndex = 0;
	this.parseNotes(text);	
	globals.song = this;
	startGame(this);
}

Song.prototype = {
	parseNotes: function(noteStr) {
		var lines = noteStr.split("\n");
		var tempo = parseInt(lines[0]);
		var standardLen = parseFloat(lines[1]) * 1000 * (60 / tempo);

		var startIndex = lines[0].length + lines[1].length + 1;	
		var isInsideParentheses = false;
		var currentCoefficient = 1;
		var currentTime = 0;
		for (var i = startIndex; i < noteStr.length; i++) {
			var currentChar = noteStr.charAt(i);
			if (currentChar == '(') {
				isInsideParentheses = true;
			}
			else if (['A', 'B', 'C', 'D', 'E'].indexOf(currentChar) >= 0) {
				note = new Note(globals.labels[currentChar], currentTime, currentTime + standardLen * currentCoefficient);
				this.notes.push(note);
			}
			else if (['0', '1', '2', '2', '4', '5', '6', '7', '8', '9'].indexOf(currentChar) >= 0) {
				var prevchar = noteStr.charAt(i-1);
				if (['0', '1', '2', '2', '4', '5', '6', '7', '8', '9'].indexOf(prevchar) >= 0) {
					currentCoefficient = (parseInt(prevchar) * 10) + parseInt(currentChar);
				}
				else {
					currentCoefficient = parseInt(currentChar);
				}
			}

			if (noteStr.charAt(i+1) == ')'){
				isInsideParentheses = false;
			}

			// We don't want to do this when inside parentheses to allow simultaneous notes
			/*
			if (!isInsideParentheses && currentChar != '\n' && currentChar != ' ') {
				currentTime += standardLen * currentCoefficient;
			}
			*/

			if (currentChar == '_' || ['A', 'B', 'C', 'D', 'E'].indexOf(currentChar) >= 0){
				if (!isInsideParentheses) {
					currentTime += standardLen * currentCoefficient;
					currentCoefficient = 1;
				}
			}
			
		}
		

	},
	
	getClosestNote: function(label) {
		var minTimeDiff = Number.MAX_VALUE;
		var noteFound = false;
		var currentClosest;
		for (var i = 0; i < this.notes.length; i++) {
			var timeDiff = Math.abs(globals.game.timeFromStart() - this.notes[i].start);
			if (this.notes[i].label == label && timeDiff < minTimeDiff && timeDiff < globals.game.NOTE_ACCURACY) {
				minTimeDiff = timeDiff;
				currentClosest = this.notes[i];
				noteFound = true;
			}
		}
		if (noteFound) return currentClosest;
		else return false;
	}
}

function Note(label, start, end) {
	this.label = label;
	this.start = Math.round(start);
	this.end = Math.round(end);
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

