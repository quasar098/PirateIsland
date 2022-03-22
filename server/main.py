from websocket_server import WebsocketServer
from json import dumps, loads
from time import sleep
# https://github.com/Pithikos/python-websocket-server

data = {"clients": {}}

def new_client(client, server):
	print(f"new connection!")

def message_received(client, server, message):
	global data
	try:
		if message == "SERVER-CHECK":
			server.send_message(client, "SERVER-VALID")
		else:
			data["clients"][client["id"]] = loads(message)
			server.send_message(client, dumps(data));
			sleep(0.1);
	except Exception as error:
		print(error)
		data["clients"].pop(client["id"])

def lost_client(client, server):
	print(f"a client has disconnected")
	data["clients"].pop(client["id"])

server = WebsocketServer(host='127.0.0.1', port=19293)
print(f"starting the server with ip {server.host} and port {server.port}")

server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(lost_client)
server.run_forever()
