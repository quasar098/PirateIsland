from _thread import start_new_thread
import socket
from json import loads, dumps
from typing import Any

HOST = "127.0.0.1"
PORT = 19293

server_data = {"message-type": "world-data"}
ips = {}


def enc(obj: Any) -> bytes:
    return bytes(dumps(obj), encoding="utf8")


def dec(obj: bytes) -> Any:
    return loads(str(obj)[2:-1])


def client(address, username, sock: socket.socket):
    server_data[username] = {
        "client-data":
        {
            "position": [],
            "image-name": "idle.png",
            "facing-right": True,
            "other-packets": []  # packet would look like {"dest": <player number>, "info": <info>}
        }
    }
    ips[username] = address
    print(f"User #{username} connected")
    while True:
        try:
            data = dec(sock.recv(2048))
            if not data:
                continue
            server_data[username]["client-data"]["position"] = data.get("position", (0, 0))
            server_data[username]["client-data"]["animation"] = data.get("animation", "idle.png")
            server_data[username]["client-data"]["position"] = data.get("facing-right", True)
            packets = data.get("other-packets", {})
            for packet in packets:
                sock.sendto(
                    enc(
                        {"message-type": "mail-from-player", 'data': packet.get('info')}
                    ), ips[packet.get('dest')]
                )
            sock.sendall(enc(server_data))
        except (ConnectionError, KeyError):
            server_data.pop(username)
            ips.pop(username)  # otherwise could be major security flaw by storing ips after dconn
            print(f"User #{username} disconnected")
            break


players_amount = 0
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as socks:
    socks.bind((HOST, PORT))
    socks.listen()
    while True:
        conn, addr = socks.accept()
        start_new_thread(client, (addr, players_amount, conn))
        players_amount += 1
