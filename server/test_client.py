import asyncio
import websockets
from time import sleep

async def hello():
	async with websockets.connect('ws://localhost:13254') as websocket:

		while True:  # continuously sends amogos, then waits for message, then sends amogos again
			name = "amogos"
			print("sending name")
			await websocket.send(name)
			print(name)

			greeting = await websocket.recv()
			print("< {}".format(greeting))
			sleep(0.1)

asyncio.get_event_loop().run_until_complete(hello())
