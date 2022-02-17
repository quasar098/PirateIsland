
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
