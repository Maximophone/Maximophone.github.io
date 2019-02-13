from flask import Flask, render_template, request
from flask_socketio import SocketIO

from server.users import users

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connection")
def handle_connection(json):
    print(f"New connection: {json}")
    print(f"Session id: {request.sid}")
    users.new_user(request.sid)


@socketio.on("disconnect")
def handle_disconnection():
    print(f"Session id: {request.sid} disconnected")
    users.disconnect_user(request.sid)


def ping_users():
    socketio.emit("ping", "ping")


@socketio.on("input")
def handle_input(json):
    user = users.get_user(request.sid)
    #print(f"Received input: {json}")
    if json["type"] == "keydown":
        print(f"Received input")
        user.inputs.press_key(json["key"])
    elif json["type"] == "keyup":
        user.inputs.release_key(json["key"])
    elif json["type"] == "mousemove":
        pass
        #user.inputs.move_mouse(json["x"], json["y"])
