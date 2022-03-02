import * as player from "./player.js";

let localPlayer;
const framerate = 60;

function preload() {
	localPlayer = new player.Player(43, 232);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(framerate);
}

function draw() {
	clear();
	localPlayer.draw();
}
function keyPressed() {
	localPlayer.image = "jump"
}

// makes it possible to resize the window properly
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// NOTE: p5 wants us to set the window stuff manually because this is a module file
// it is a module file so that we can import other module files
window.setup = setup;
window.draw = draw;
window.preload = preload;
window.windowResized = windowResized;
window.keyPressed = keyPressed;
