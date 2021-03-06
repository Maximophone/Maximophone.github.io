from .entity import Entity
from server.systems import input_system, position_system


class Engine(Entity):
    def __init__(self, ship, max_v, delta_v, delta_rot, ai=False):
        super().__init__()
        self.parent = ship
        self.type = "engine"
        self.max_v = max_v
        self.delta_v = delta_v
        self.delta_rot = delta_rot
        self.lifetime = 1
        self.accelerate = False
        self.deccelerate = False
        self.strafe_right = False
        self.strafe_left = False
        self.target_angle = 0
        if not ai:
            self.input_component = input_system.get_component(self, "engine")
        self.position = position_system.get_position(self, -1, 0, 0, 15)

    def update(self, world, dt):
        if self.parent.lifetime < 0:
            self.lifetime = -1

    def serialise(self):
        return {
            "accelerate": self.accelerate,
            "deccelerate": self.deccelerate,
            "strafe_right": self.strafe_right,
            "strafe_left": self.strafe_left
        }
