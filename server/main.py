from websocket_server import WebsocketServer
# https://github.com/Pithikos/python-websocket-server
from json import dumps, loads
from time import sleep, time as time_

# config
config = {"max_dashes": 1, "gravity": 0.75}
try:
	with open("config.json", 'r') as f:
		config = loads(f.read())
except Exception as e:
	print("config file not found! creating one for you...")
	with open("config.json", 'w') as f:
		f.write(dumps(config))

data = {"clients": {}, "mail": {}, "world": [
	[1, 6, 1], [2, 6, 2], [3, 6, 2], [4, 6, 2], [5, 6, 2], [6, 6, 2], [7, 6, 2], [8, 6, 2], [9, 6, 2], [10, 6, 2], [11, 6, 2],  [12, 6, 2], [13, 6, 2], [14, 6, 2], [15, 6, 2], [16, 6, 2], [17, 6, 2], [18, 6, 3],
	[1, 7, 7], [2, 7, 8], [3, 7, 8], [4, 7, 8], [5, 7, 8], [6, 7, 8], [7, 7, 8], [8, 7, 8], [9, 7, 8], [10, 7, 8], [11, 7, 8], [12, 7, 8], [13, 7, 8], [14, 7, 8], [15, 7, 8], [16, 7, 8], [17, 7, 8], [18, 7, 9]
]};
username_database = {};
game_is_going = True;

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
					if dest == "%server%":
						# todo do this
						continue
					data["mail"][dest].append(mail)
				willsendmail = data["mail"].get(id, [])
				server.send_message(client, dumps({
					"clients": data["clients"],
					"mail": willsendmail,
					"world": data["world"],
					"youInGame": True,
					"broadcast": "todo do broadcast",
					"config": config
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
	if client["id"] in username_database:  # todo fix this NOW FGIXME
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
