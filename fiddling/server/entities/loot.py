from .entity import Entity
from server.systems import position_system, collision_system, physics_system

from random import random
import math


class Loot(Entity):
    def __init__(self, x, y, rot, v, v_rot, size=12):
        self.type = "loot"
        self.id = 3
        self.lifetime = 1e6 + random()*5e4
        self.health = 1

        self.position = position_system.get_position(self, x, y, rot, size)
        self.collider_component = collision_system.get_component(self, "circle")
        self.physics_component = physics_system.get_component(self, "bullet")
        self.physics_component.vx = v * math.cos(rot)
        self.physics_component.vy = v * math.sin(rot)
        self.physics_component.v_rot = v_rot
