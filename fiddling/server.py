from flask import Flask, render_template
from flask_socketio import SocketIO
import threading
import time

from user_inputs import UserInputs

inputs = UserInputs()

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("my event")
def handle_custom_event(json):
    print(f"received: {json}")


@socketio.on("input")
def handle_input(json):
    print(f"Received input: {json}")
    if json["type"] == "keydown":
        inputs.press_key(json["key"])
    elif json["type"] == "keyup":
        inputs.release_key(json["key"])
    elif json["type"] == "mousemove":
        inputs.move_mouse(json["x"], json["y"])


class Game(threading.Thread):
    def run(self):
        i = 0
        while True:
            i += 1
            socketio.emit("some event", {"data": i})
            time.sleep(1)


if __name__ == "__main__":
    game = Game()

    # game.start()
    socketio.run(app)
