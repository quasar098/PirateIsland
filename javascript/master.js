import * as player from "./player.js";
import { Rectangle } from "./rectangle.js";
import { Tile } from "./tiles.js"

let localPlayer;
let world = [];
const framerate = 60;
let connIp = "";

if (localStorage.getItem("connect-ip") == null) {
	window.location.href = './main.html';
} else {
	connIp = localStorage.getItem("connect-ip");
	localStorage.removeItem("connect-ip");
	console.log(connIp)
}

function preload() {
	localPlayer = new player.Player(200, 200);
	player.preloadplayerjs();

	// ground
	world.push(new Tile(1, 8, 1));
	world.push(new Tile(2, 8, 2));
	world.push(new Tile(3, 8, 2));
	world.push(new Tile(4, 8, 2));
	world.push(new Tile(5, 8, 2));
	world.push(new Tile(6, 8, 2));
	world.push(new Tile(7, 8, 2));
	world.push(new Tile(8, 8, 2));
	world.push(new Tile(9, 8, 2));
	world.push(new Tile(10, 8, 2));
	world.push(new Tile(11, 8, 2));
	world.push(new Tile(12, 8, 2));
	world.push(new Tile(13, 8, 2));
	world.push(new Tile(14, 8, 3));

	// ground part 2
	world.push(new Tile(1, 9, 4));
	world.push(new Tile(2, 9, 5));
	world.push(new Tile(3, 9, 5));
	world.push(new Tile(4, 9, 5));
	world.push(new Tile(5, 9, 5));
	world.push(new Tile(6, 9, 5));
	world.push(new Tile(7, 9, 5));
	world.push(new Tile(8, 9, 5));
	world.push(new Tile(9, 9, 5));
	world.push(new Tile(10, 9, 5));
	world.push(new Tile(11, 9, 5));
	world.push(new Tile(12, 9, 5));
	world.push(new Tile(13, 9, 5));
	world.push(new Tile(14, 9, 6));
}

function setup() {
	createCanvas(1200, 700);
	frameRate(framerate);
}

function draw() {
	clear();
	background(81, 187, 254);
	scale(0.75, 0.75); // camera zoom
	localPlayer.draw(worldRectangles());
	for (var _ in world) {
		world[_].draw(localPlayer);
	}
}
function keyPressed(e) {
	localPlayer.jump(e);
}

// makes it possible to resize the window properly
function windowResized() {
	resizeCanvas(1200, 700);
}

function worldRectangles() {
	let rects = [];
	for (var tile in world) {
		rects.push(world[tile].rect);
	}
	return rects;
}

// NOTE: p5 wants us to set the window stuff manually because this is a module file
// it is a module file so that we can import other module files
window.setup = setup;
window.draw = draw;
window.preload = preload;
window.windowResized = windowResized;
window.keyPressed = keyPressed;
