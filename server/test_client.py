import asyncio
import websockets
from time import sleep, perf_counter

async def hello():
	async with websockets.connect('ws://localhost:13254') as websocket:
		while True:  # continuously sends amogos, then waits for message, then sends amogos again
			name = "amogos"
			s = perf_counter()
			await websocket.send(name)
			print(perf_counter()-s)

			greeting = await websocket.recv()
			print(f"the server sent {greeting}")
			sleep(0.5)

asyncio.get_event_loop().run_until_complete(hello())
