import * as player from "./player.js";
import { Rectangle } from "./rectangle.js";
import { Tile } from "./tiles.js"

let localPlayer;
let world = [];
const framerate = 60;
let connIp = "";
let connPort = 19293;
let currRMB = false;
let prevRMB = false;

// prevent right click menu
document.body.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});

if (localStorage.getItem("connect-ip") == null) {
	window.location.href = './main.html';
} else {
	connIp = localStorage.getItem("connect-ip");
	connPort = parseInt(localStorage.getItem("connect-port"));
	localStorage.removeItem("connect-ip");
}

function preload() {
	localPlayer = new player.Player(200, 200);
	player.preloadplayerjs();

	// ground
	world.push(new Tile(1, 6, 1));
	world.push(new Tile(2, 6, 2));
	world.push(new Tile(3, 6, 2));
	world.push(new Tile(4, 6, 2));
	world.push(new Tile(5, 6, 2));
	world.push(new Tile(6, 6, 2));
	world.push(new Tile(7, 6, 2));
	world.push(new Tile(8, 6, 2));
	world.push(new Tile(9, 6, 2));
	world.push(new Tile(10, 6, 2));
	world.push(new Tile(11, 6, 2));
	world.push(new Tile(12, 6, 2));
	world.push(new Tile(13, 6, 2));
	world.push(new Tile(14, 6, 3));

	// ground part 2
	world.push(new Tile(1, 7, 4));
	world.push(new Tile(2, 7, 5));
	world.push(new Tile(3, 7, 5));
	world.push(new Tile(4, 7, 5));
	world.push(new Tile(5, 7, 5));
	world.push(new Tile(6, 7, 5));
	world.push(new Tile(7, 7, 5));
	world.push(new Tile(8, 7, 5));
	world.push(new Tile(9, 7, 5));
	world.push(new Tile(10, 7, 5));
	world.push(new Tile(11, 7, 5));
	world.push(new Tile(12, 7, 5));
	world.push(new Tile(13, 7, 5));
	world.push(new Tile(14, 7, 6));
}

function setup() {
	createCanvas(1200, 600);
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

	// rmb clicked (not pressed)
	{
		currRMB = (mouseButton === RIGHT & mouseIsPressed);
		if (currRMB & !prevRMB) {
			localPlayer.jump();
		}
		prevRMB = (mouseButton === RIGHT & mouseIsPressed);
	}
}
function keyPressed(e) {
	localPlayer.jump(e);
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
window.keyPressed = keyPressed;

function leftClick() {
	console.log("todo add left clicks be attack (or pressing m/c would work too)");
}

document.addEventListener("click", (event) => {
	leftClick();
});

// server stuff
let conn = new WebSocket("ws://" + connIp + ":" + connPort);
let serverData;

function sendServerData(websock) {
	websock.send(JSON.stringify(
		{"position": localPlayer.position}
	)); // TODO: actually send something useful
}

conn.onopen = (() => {
	sendServerData(conn);
});
conn.onmessage = ((m) => {
	serverData = JSON.parse(m.data);
	console.log(serverData);
	sendServerData(conn);
});
conn.onerror = (() => {
	conn.close();
});
