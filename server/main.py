from websocket_server import WebsocketServer
from json import dumps, loads
from time import sleep, time as time_
# https://github.com/Pithikos/python-websocket-server

data = {"clients": {}, "mail": {}}


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
			else:
				server.send_message(client, "USERNAME-TAKEN")
		else:
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
				"mail": willsendmail
			}))
			if len(willsendmail):
				data["mail"][id] = []

			# for every client that exists, if any are 2000 ms late, then remove their client (sucks for 2000ms ppl i guess,,,)
			data["clients"] = {name: client_data for (name, client_data) in data["clients"].items() if client_data["timestamp"]+2000 > millis()}
			sleep(0.01)
	except Exception as error:
		print(error, "ERROR!")
		if id in data["clients"]:
			data["clients"].pop(id)

def lost_client(client, server):
	pass

server = WebsocketServer(host='127.0.0.1', port=19293)
print(f"starting the server with ip {server.host} and port {server.port}")

server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(lost_client)
server.run_forever()
