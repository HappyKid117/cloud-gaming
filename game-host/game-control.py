import subprocess
import os
import time
import _thread
import websocket
import json
import base64
from types import SimpleNamespace

# key = "space"
name = "mari0"
url = "ws://129.159.21.84:3001/"


def on_message(ws, message):
    message = json.loads(message, object_hook=lambda d: SimpleNamespace(**d))
    message = "".join(map(chr, message.data))
    message = json.loads(message, object_hook=lambda d: SimpleNamespace(**d))

    window_id = int(subprocess.check_output(['xdotool', 'search', "--name", name]))

    key = chr(message.key)
    if(key == " "):
        key = "space"

    if(message.event == "keyup"):
        command = "xdotool keyup --window " + str(window_id) + " " + key
    else:
        command = "xdotool keydown --window " + str(window_id) + " " + key
    print(command)
    os.system(command)

def on_error(ws, error):
    print (error)

def on_close(ws):
    print ("### closed ###")

def on_open(ws):
    def run(*args):
        for i in range(3):
            time.sleep(1)
            ws.send("Hello %d" % i)
        time.sleep(1)
        ws.close()
        print ("thread terminating...")
    thread.start_new_thread(run, ())

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url,
                                on_message = on_message,
                                on_error = on_error,
                                on_close = on_close)
    ws.on_open = on_open

    ws.run_forever()
