from .entity import Entity
from .bullet import Bullet
from .missile import Missile
from .laser_beam import LaserBeam
from .debug_entity import Debug
from server.systems import position_system, input_system

import math


def get_pos_bullet(weapon):
    pos = weapon.position
    pos_parent = weapon.parent.position
    x = pos_parent.x + pos_parent.size_x*(pos.x*math.cos(-pos_parent.rot) + pos.y*math.sin(-pos_parent.rot))
    y = pos_parent.y - pos_parent.size_y*(pos.x*math.sin(-pos_parent.rot) + pos.y*math.cos(-pos_parent.rot))
    return x, y


class Weapon(Entity):
    def __init__(self, ship, x, y, rot, ai=False, input="weapon"):
        super().__init__()
        self.type = "weapon"
        self.parent = ship
        self.firing = False
        self.position = position_system.get_position(self, x, y, rot, 0.4, 0.2)
        if not ai:
            self.input_component = input_system.get_component(self, input)


class Cannon(Weapon):
    def __init__(self, ship, x, y, rot, firing_rate, bullet_speed, ai=False, color="#ffffee"):
        super().__init__(ship, x, y, rot, ai)
        self.firing_rate = firing_rate
        self.bullet_speed = bullet_speed
        self.timer = 0
        self.color = color

    def update(self, world, dt):
        self.timer -= dt
        if self.firing and self.timer <= 0:
            x, y = get_pos_bullet(self)
            projectile = Bullet(
                self.parent.id,
                x,
                y,
                self.parent.position.rot + self.position.rot,
                self.parent.physics_component.v() + self.bullet_speed,
                color = self.color)
            world.entities.append(projectile)
            self.timer = self.firing_rate


class MissileLauncher(Weapon):
    def __init__(self, ship, x, y, rot, firing_rate, missile_speed):
        super().__init__(ship, x, y, rot, False, "weapon_secondary")
        self.firing_rate = firing_rate
        self.missile_speed = 4
        self.timer = 0

    def update(self, world, dt):
        self.timer -= dt
        if self.firing and self.timer <= 0:
            x, y = get_pos_bullet(self)
            projectile = Missile(
                world,
                self.parent,
                self.parent.id,
                x,
                y,
                self.parent.position.rot + self.position.rot,
                self.parent.physics_component.v() + self.missile_speed)
            world.entities.append(projectile)
            self.timer = self.firing_rate


class Laser(Weapon):
    def __init__(self, ship, x, y, rot, length=75, dps=0.02, color="#00aa00", ai=False):
        super().__init__(ship, x, y, rot, ai, "weapon_secondary")
        self.dps = dps
        self.length = length
        self.beam = None
        self.color = color

    def update(self, world, dt):
        if self.firing and self.beam is None:
            self.beam = LaserBeam(
                self,
                self.parent.id,
                self.position.x,
                self.position.y,
                self.position.rot,
                self.length,
                self.dps,
                color = self.color
            )
            world.entities.append(self.beam)
        elif not self.firing and self.beam is not None:
            self.beam.lifetime = -1
            self.beam = None
        
