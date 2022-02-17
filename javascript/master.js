import { printX } from "./player.js";

let img;

function preload() {
	img = loadImage('javascript/images/character/idle.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	clear();
	circle(windowWidth/2, windowHeight/2, 50);
	image(img, 0, 0);
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
