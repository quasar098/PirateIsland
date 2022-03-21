from websocket_server import WebsocketServer
# https://github.com/Pithikos/python-websocket-server

# maybe i should delete server/main.py and write everything in here?? probably lol

def new_client(client, server):
	print("new connection from somewhere i guess")

def message_received(client, server, message):
	print(message)
	server.send_message_to_all("Among us!! the server is sus")

def lost_client(client, server):
	print("noo!! a client left...")

server = WebsocketServer(host='127.0.0.1', port=13254)
server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(lost_client)
server.run_forever()
