from websocket_server import WebsocketServer
from json import dumps, loads
from time import sleep, time as time_
# https://github.com/Pithikos/python-websocket-server

data = {"clients": {}, "mail": {}, "world": [
	[2, 3, 2], [1, 3, 1], [3, 3, 3], [1, 4, 7], [2, 4, 8], [3, 4, 9]
]};
username_database = {};
game_is_going = False;

def send_message_to_all(message):
	for client in data["clients"]:
		if client not in data["mail"]:
			data["mail"][client] = []
		data["mail"][client].append(message)

def millis():
    return round(time_() * 1000)

def new_client(client, server):
	pass

def message_received(client, server, message):
	global data
	loads_message = {};
	id = username = "<undefined name>"
	try:
		if len(message) == 0:
			pass
		elif message[0] == "!":
			if message[1:] not in [user["username"] for (id, user) in data["clients"].items()]:
				server.send_message(client, "SERVER-VALID")
				print(f"{message[1:]} has joined")
				username_database[client["id"]+1] = message[1:]
			else:
				server.send_message(client, "USERNAME-TAKEN")
		else:
			if game_is_going:
				loads_message = loads(message)
				id = username = loads_message["player-data"]["username"]
				data["clients"][id] = loads_message["player-data"]
				data["mail"][id] = data["mail"].get(id, [])
				for (dest, mail) in loads_message["mail"].items():
					if dest not in data["mail"]:
						data["mail"][dest] = []
					data["mail"][dest].append(mail)
				willsendmail = data["mail"].get(id, [])
				server.send_message(client, dumps({
					"clients": data["clients"],
					"mail": willsendmail,
					"world": data["world"],
					"youInGame": True,
					"broadcast": ""
				}));
			else:
				broadcast = "game will start soon..."
				server.send_message(client, dumps({
					"clients": data["clients"],
					"mail": [],
					"world": data["world"],
					"youInGame": False,
					"broadcast": broadcast
				}));
	except Exception as error:
		print(error, "ERROR!")
		if id in data["clients"]:
			data["clients"].pop(id)

def lost_client(client, server):
	if client["id"] in username_database:
		if username_database.get(client["id"], 0) in data["clients"]:
			data["clients"].pop(username_database[client["id"]])
		if username_database[client["id"]] in data["mail"]:
			data["mail"].pop(username_database[client["id"]])
		print(username_database[client["id"]], "has disconnected")

server = WebsocketServer(host='127.0.0.1', port=19293)
print(f"starting the server with ip {server.host} and port {server.port}")

server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(lost_client)
server.run_forever()
