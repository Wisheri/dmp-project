function readfile(evt) {
	//Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0]; 

	if (f) {
	  var r = new FileReader();
	  r.onload = function(e) { 
		var contents = e.target.result;
		var lines = contents.split(/\r\n|\r|\n/); 
		alert( "Got the file\n" 
			  + "name: " + f.name + "\n"
			  + "type: " + f.type + "\n"
			  + "size: " + f.size + " bytes\n"
			  + "starts with: " + lines[0]
		);
		return new Song(contents);
	  }
	  r.readAsText(f);
	} else { 
	  alert("Failed to load file");
	}
}
document.getElementById('fileinput').addEventListener('change', readfile, false);

function Song(text) {
	this.notes = new Array();
	
	function parseNotes(noteStr) {
		var noteLen = 1000;
		var currentTime = 0;
		for (var i=0;i<noteStr.length;i++) 
		{
			var currentChar = noteStr.charAt(i);
			if ( ['A', 'B', 'C', 'D', 'E'].indexOf(currentChar) >= 0 ) 
			{
				this.notes.push(new Note(currentChar, currentTime, currentTime + noteLen));
			}
			currentTime += noteLen;
		}
	}
	globals.game = new Game(this);
}

function Note(label, start, end) {
	this.label = label;
	this.start = start;
	this.end = end;
}

/*/var oRequest = new XMLHttpRequest();
	var sURL = "\testi.txt";

	oRequest.open("GET",sURL,false);
	oRequest.setRequestHeader("User-Agent",navigator.userAgent);
	oRequest.send(null);
	if (oRequest.status==200) alert(oRequest.responseText);
	else alert("Error executing XMLHttpRequest call!");/*/

