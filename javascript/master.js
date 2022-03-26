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
let username = "NaN"
let sendPackets = {};
let incomingMail = [];

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
	username = localStorage.getItem("username");
}

function preload() {
	player.preloadplayerjs();
	localPlayer = new player.Player(200, 200);
	localPlayer.username = username;

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

	// real drawing
	for (var _ in world) {
		world[_].draw(localPlayer);
	}
	for (var otherPlayer in allPlayers) {
		allPlayers[otherPlayer].draw([], false);
	}
	localPlayer.draw(worldRectangles(), true, true);

	// rmb clicked testings
	{
		currRMB = (mouseButton === RIGHT & mouseIsPressed);
		if (currRMB & !prevRMB) {
			localPlayer.jump();
		}
		prevRMB = (mouseButton === RIGHT & mouseIsPressed);
	}
	text(incomingMail.toString(), 10, 10);
}
function keyPressed(e) {
	localPlayer.jump(e);
	localPlayer.attack(e);
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
	localPlayer.attack();
	sendPackets = {2: 2};
}

document.addEventListener("click", (event) => {
	leftClick();
});

// server stuff
let conn = new WebSocket("ws://" + connIp + ":" + connPort);
let serverData;
let allPlayers = {};
let createdPlayer;

function sendServerData(websock) {
	websock.send(JSON.stringify(
		{"player-data":
			{
				"position": localPlayer.position,
				"frame": localPlayer.images.frame,
				"state": localPlayer.images.state,
				"facing_right": localPlayer.facing_right*1,
				"username": username
			},
		"mail": sendPackets
	}
	));
	sendPackets = {};
}

conn.onopen = (() => {
	sendServerData(conn);
});
conn.onmessage = ((m) => {
	function setPlayerInfo(playerObject, serverPlayerInfo) {
		playerObject.images.frame = serverPlayerInfo.frame;
		playerObject.images.state = serverPlayerInfo.state;
		playerObject.x = serverPlayerInfo.position[0];
		playerObject.y = serverPlayerInfo.position[1];
		playerObject.facing_right = serverPlayerInfo.facing_right;
		playerObject.username = serverPlayerInfo.username;
	}
	serverData = (JSON.parse(m.data));
	incomingMail = serverData.mail;
	serverData = serverData.clients;
	for (let playerId in serverData) {
    	let playerData = serverData[playerId];
		if (allPlayers.hasOwnProperty(playerId)) { // just updating player object
			setPlayerInfo(allPlayers[playerId], playerData);
		} else {
			if (playerData.username != username) {
				allPlayers[playerId] = new player.Player(0, 0);
				setPlayerInfo(allPlayers[playerId], playerData); // can rework this area
			}
		}
	}
	// for each in allplayers if player is not in serverdataclients
	allPlayers = Object.fromEntries(Object.entries(allPlayers).filter(([pId, player]) => serverData.hasOwnProperty(pId)));

	sendServerData(conn);
});
conn.onerror = (() => {
	conn.close();
});
