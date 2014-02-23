var notes = new Array();
var pressedNotes = new Array();
var nextNote = 0;
var startTime;

function currentTime() {
	var d = new Date();
	return d.getTime();
}

function timeFromStart() {
	var currTime = currentTime();
	return currTime - startTime;
}

document.onkeyup = function(e) {
    e = e || window.event;
	var keyCode = e.keyCode;
    if (keyCode == 13 /*ENTER*/) {
        var d = new Date();
		startTime = currentTime();
		camera.position.z = 2;
    }
};

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

function Note(label, start, end) {
	this.label = label;
	this.start = start;
	this.end = end;
}

function isValidNote(char) {
	var isValid = false;
	if (char == "A") isValid = true;
	if (char == "B") isValid = true;
	if (char == "C") isValid = true;
	if (char == "D") isValid = true;
	if (char == "E") isValid = true;
	if (char == "F") isValid = true;
	return isValid;
}

function parseNotes(noteStr) {
	var noteLen = 1000;
	var currentTime = 0;
	for (var i=0;i<noteStr.length;i++) 
	{
		var currentChar = noteStr.charAt(i);
		if ( isValidNote(currentChar) ) 
		{
			notes.push(new Note(currentChar, currentTime, currentTime + noteLen));
		}
		currentTime += noteLen;
	}
}

function readSingleFile(evt) {
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
		parseNotes(contents);
	  }
	  r.readAsText(f);
	} else { 
	  alert("Failed to load file");
	}
}
document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

/*/var oRequest = new XMLHttpRequest();
var sURL = "\testi.txt";

oRequest.open("GET",sURL,false);
oRequest.setRequestHeader("User-Agent",navigator.userAgent);
oRequest.send(null);
if (oRequest.status==200) alert(oRequest.responseText);
else alert("Error executing XMLHttpRequest call!");/*/


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var render = function () {
	requestAnimationFrame(render);

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

		
	renderer.render(scene, camera);
};

render();
