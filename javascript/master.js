import * as player from "./player.js";
import { Rectangle } from "./rectangle.js";
import { Tile } from "./tiles.js"

let localPlayer;
let world = [];
const framerate = 60;

function preload() {
	localPlayer = new player.Player(200, 200);
	world.push(new Tile(1, 6, 1));
	world.push(new Tile(2, 6, 2));
	world.push(new Tile(3, 6, 2));
	world.push(new Tile(4, 6, 2));
	world.push(new Tile(5, 6, 2));
	world.push(new Tile(6, 6, 3));
}

function setup() {
	createCanvas(1200, 700);
	frameRate(framerate);
}

function draw() {
	clear();
	localPlayer.draw(worldRectangles());
	for (var _ in world) {
		world[_].draw();
	}
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
