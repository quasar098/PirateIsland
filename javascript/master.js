
function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	clear()
	circle(windowWidth/2, windowHeight/2, 50)
}

// makes it possible to resize the window properly
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
