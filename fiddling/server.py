from app import socketio, app
from server.game import Gx

def start_game():
    gx = Gx()
    gx.start()

if __name__ == "__main__":
    start_game()
    socketio.run(app, host="0.0.0.0", port=80)
