from .camera import Camera
from .entities.ship import Ship
from .entities.weapon import Cannon, MissileLauncher
from .entities.engine import Engine
from .entities.shield import Shield
from .user_inputs import UserInputs

PLAYER_HEALTH = 200

class Users:
    def __init__(self):
        self.connected = {}

    def new_user(self, sid):
        self.connected[sid] = User(sid)

    def disconnect_user(self, sid):
        user = self.connected.pop(sid)
        user.disconnect()
        del user

    def get_user(self, sid):
        assert sid in self.connected, f"Cannot find user with sid: {sid}"
        return self.connected[sid]


class User:
    def __init__(self, sid):
        self.sid = sid
        self.inputs = UserInputs()
        self.camera = None
        self.entities = []
        self.in_world = False

    def disconnect(self):
        for entity in self.entities:
            entity.lifetime = -1

    def join_world(self, world):
        ship = Ship(1, 100, 100, 0, 20, PLAYER_HEALTH, None)
        engine = Engine(ship, 10, 0.01, 0.05)
        ship.engine = engine
        weapon1 = Cannon(ship, 1, 0.5, 0.05, 100, 15)
        weapon2 = Cannon(ship, 1, -0.5, -0.05, 100, 15)
        weapon3 = MissileLauncher(ship, 1, 0., 0., 5000, 5)
        shield = Shield(ship, 3, 100, 0.01, 5000)
        ship.weapons.extend([weapon1, weapon2, weapon3])
        ship.shield = shield

        ship.set_user(self)

        world.entities.extend([ship, engine, weapon1, weapon2, weapon3, shield])
        self.entities.extend([ship, engine, weapon1, weapon2, weapon3, shield])
        
        self.camera = Camera(0, 0, 50, ship, self.inputs)
        self.in_world = True

    def _serialise(self):
        if self.in_world:
            ret = {
                "id": self.sid,
                "entities": [entity._id for entity in self.entities],
                "camera": {
                    "x": self.camera.x,
                    "y": self.camera.y,
                    "size": self.camera.size
                }
            }
        else:
            ret = {"id": self.sid}
        return ret
                


users = Users()
