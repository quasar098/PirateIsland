
let img;

function preload() {
	img = loadImage('javascript/images/hat.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	image(img, 0, 0)
}

function draw() {
	clear();
	circle(windowWidth/2, windowHeight/2, 50);
}

// makes it possible to resize the window properly
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

}
