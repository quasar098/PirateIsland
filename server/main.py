from websocket_server import WebsocketServer
from json import dumps, loads
# https://github.com/Pithikos/python-websocket-server

def new_client(client, server):
	print(f"new connection!")

def message_received(client, server, message):
	try:
		if message == "SERVER-CHECK":
			server.send_message(client, "SERVER-VALID")
		else:
			data = loads(data)
	except Exception:
		print("what is this stuff man" + message)

def lost_client(client, server):
	print(f"a client has disconnected")

server = WebsocketServer(host='127.0.0.1', port=19293)
print(f"starting the server with ip {server.host} and port {server.port}")

server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(lost_client)
server.run_forever()
