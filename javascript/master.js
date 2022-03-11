import * as player from "./player.js";
import { Rectangle } from "./rectangle.js";

let localPlayer;
const framerate = 60;

function preload() {
	localPlayer = new player.Player(43, 232);
}

function setup() {
	createCanvas(1200, 700);
	frameRate(framerate);
}

function draw() {
	clear();
	localPlayer.draw();
}
function keyPressed(e) {
	// TODO: change this so that it uses the localplayer move function if it is not
	// existing then making it now!11!11
	localPlayer.jump(e);
}

// makes it possible to resize the window properly
function windowResized() {
	resizeCanvas(1200, 700);
}

// NOTE: p5 wants us to set the window stuff manually because this is a module file
// it is a module file so that we can import other module files
window.setup = setup;
window.draw = draw;
window.preload = preload;
window.windowResized = windowResized;
window.keyPressed = keyPressed;
