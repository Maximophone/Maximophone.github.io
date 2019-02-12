class Users:
    def __init__(self):
        self.connected = {}

    def new_user(self, sid):
        self.connected[sid] = User(sid)

    def disconnect_user(self, sid):
        user = self.connected.pop(sid)
        user.disconnect()
        del user


class User:
    def __init__(self, sid):
        self.sid = sid

    def disconnect(self):
        pass


users = Users()
