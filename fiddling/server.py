from app import socketio, app
from server.game import Gx

if __name__ == "__main__":
    gx = Gx()

    gx.start()
    socketio.run(app)
