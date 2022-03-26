from websocket_server import WebsocketServer
from json import dumps, loads
from time import sleep
# https://github.com/Pithikos/python-websocket-server

data = {"clients": {}, "mail": {}}

def new_client(client, server):
	print(f"new connection!")

def message_received(client, server, message):
	global data
	try:
		if message[0] == "!":
			if message[1:] not in [user["username"] for (id, user) in data["clients"].items()]:
				server.send_message(client, "SERVER-VALID")
			else:
				server.send_message(client, "USERNAME-TAKEN")
		else:
			loads_message = loads(message)
			data["clients"][client["id"]] = loads_message["player-data"]
			data["mail"][client["id"]] = data["mail"].get(client["id"], [])
			for (dest, mail) in loads_message["mail"].items():
				data["mail"][dest].append(mail)
			# TODO: figure out why this breaks when packets (it is not client side)
			willsendmail = data["mail"].get(client["id"], [])
			server.send_message(client, dumps({
				"clients": data["clients"],
				"mail": data["mail"][client["id"]]
			}))
			data["mail"][client["id"]] = []
	except Exception as error:
		print(error)
		if client["id"] in data["clients"]:
			data["clients"].pop(client["id"])

def lost_client(client, server):
	print(f"a client has disconnected")
	if client["id"] in data["clients"]:
		data["clients"].pop(client["id"])

server = WebsocketServer(host='127.0.0.1', port=19293)
print(f"starting the server with ip {server.host} and port {server.port}")

server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(lost_client)
server.run_forever()
