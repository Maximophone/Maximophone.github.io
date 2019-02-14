from .entity import Entity
from .bullet import Bullet
from .missile import Missile
from server.systems import position_system, input_system

import math


def get_pos_bullet(weapon):
    pos = weapon.position
    pos_parent = weapon.parent.position
    x = pos_parent.x + pos_parent.size*(pos.x*math.cos(-pos_parent.rot) + pos.y*math.sin(-pos_parent.rot))
    y = pos_parent.y - pos_parent.size*(pos.x*math.sin(-pos_parent.rot) + pos.y*math.cos(-pos_parent.rot))
    return x, y


class Weapon(Entity):
    def __init__(self, ship, x, y, rot, ai=False, input="weapon"):
        super().__init__()
        self.type = "weapon"
        self.parent = ship
        self.firing = False
        self.position = position_system.get_position(self, x, y, rot, 0.2)
        if not ai:
            self.input_component = input_system.get_component(self, input)


class Cannon(Weapon):
    def __init__(self, ship, x, y, rot, firing_rate, bullet_speed, ai=False):
        super().__init__(ship, x, y, rot, ai)
        self.firing_rate = firing_rate
        self.bullet_speed = bullet_speed
        self.timer = 0

    def update(self, world, dt):
        self.timer -= dt
        if self.firing and self.timer <= 0:
            x, y = get_pos_bullet(self)
            projectile = Bullet(
                self.parent.id,
                x,
                y,
                self.parent.position.rot + self.position.rot,
                self.parent.physics_component.v() + self.bullet_speed)
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
