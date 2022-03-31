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
var sendPackets = {};
let incomingMail = [];
let readPacketIds = [];
let secondsSinceReq = 0;
let youInGame = false;
let tmp;
const disconnectHeader = document.getElementById('disconnected');

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
}

function setup() {
	createCanvas(1200, 600);
	frameRate(framerate);
	window.localPlayer = localPlayer; // for debuging
}

function draw() {
	clear();
	background(81, 187, 254);
	scale(0.6, 0.6); // camera zoom

	// real drawing
	for (var _ in world) {
		world[_].draw(localPlayer);
	}
	for (var otherPlayer in allPlayers) {
		allPlayers[otherPlayer].draw([], false);
	}
	if (youInGame) {
		localPlayer.draw(worldRectangles(), true, true);
	}

	// rmb clicked testings
	{
		currRMB = (mouseButton === RIGHT & mouseIsPressed);
		if (currRMB & !prevRMB) {
			localPlayer.jump();
		}
		prevRMB = (mouseButton === RIGHT & mouseIsPressed);
	}
	for (var count in incomingMail) {
		if (!readPacketIds.includes(incomingMail[count].id)) {
			localPlayer.reactToMail(incomingMail[count]);
			readPacketIds.push(incomingMail[count].id);
		}
	}
	textAlign(LEFT, TOP);
	if (secondsSinceReq > 0.4) {
		localPlayer.x = localPlayer.lastSentPos[0];
		localPlayer.y = localPlayer.lastSentPos[1];
		sendServerData(conn);
		if (secondsSinceReq > 0.5) {
			disconnectHeader.style.display = "block";
			disconnectHeader.style.position = "fixed";
			disconnectHeader.innerHTML = "you've been disconnected for " + Math.round(secondsSinceReq*10)/10 + "seconds";
		}
	} else {
		disconnectHeader.style.display = "none";
	}
	secondsSinceReq += 1/60;
}
function keyPressed(e) {
	localPlayer.jump(e);
	tmp = localPlayer.attack(e, allPlayers);
	if (tmp) {
		sendPackets = tmp;
	}
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
window.mouseClicked = mouseClicked;

function mouseClicked() {
	tmp = localPlayer.attack(undefined, allPlayers);
	if (tmp) {
		sendPackets = tmp;
	}
}

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
				"username": username,
				"timestamp": Date.now(),
				"slice": localPlayer.slice
			},
		"mail": sendPackets
	}
	));
	localPlayer.lastSentPos = localPlayer.position;
	if (Object.keys(sendPackets).length >= 1) {
		sendPackets = {};
	}
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
		playerObject.slice = serverPlayerInfo.slice;
	}
	serverData = (JSON.parse(m.data));
	incomingMail = serverData.mail;
	if (world.length == 0) {
		for (var index in serverData.world) {
			world.push(new Tile(serverData.world[index][0], serverData.world[index][1], serverData.world[index][2]));
		}
	}
	serverData = serverData.clients;
	for (let playerId in serverData) {
    	let playerData = serverData[playerId];
		if (allPlayers.hasOwnProperty(playerId)) { // just updating player object
			setPlayerInfo(allPlayers[playerId], playerData);
		} else {
			if (playerData.username != username) {
				allPlayers[playerId] = new player.Player(0, 0);
				setPlayerInfo(allPlayers[playerId], playerData);
			}
		}
	}

	// remove players which are not being sent data for anymore
	allPlayers = Object.fromEntries(Object.entries(allPlayers).filter(([pId, player]) => serverData.hasOwnProperty(pId)));

	youInGame = serverData.youInGame;

	secondsSinceReq = 0;
	sendServerData(conn);
});
conn.onerror = (() => {
	conn.close();
	console.log("uh oh stinky");
	window.location.href = "./main.html";
});
conn.onclose = ((e) => {
	console.log("server is gone");
	try {
		CWNCLog(e);
	} catch {

	}
});
