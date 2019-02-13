from .entity import Entity
from server.systems import collision_system, position_system

import math


class Shield(Entity):
    def __init__(self, ship, size, health, regen_rate=0, downtime=1000):
        self.parent = ship
        self.type = "shield"
        self.id = ship.id
        self.health = health
        self.max_health = health
        self.regen_rate = regen_rate
        self.downtime = downtime
        self.downtime_left = downtime
        self.position = position_system.get_position(self, 0, 0, 0, size)
        self.collider_component = collision_system.get_component(self, "circle")

    def update(self, world, dt):
        if self.health <= 0:
            if self.downtime_left <= 0:
                self.collider_component.active = True
                self.health = 1
                self.downtime_left = self.downtime
            else:
                self.collider_component.active = False
                self.downtime_left -= dt
        else:
            self.health = min(self.max_health, self.health + self.regen_rate*dt)
