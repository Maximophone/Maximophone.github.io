from .entity import Entity
from server.systems import position_system, collision_system, particles_pool

import math


class LaserBeam(Entity):
    def __init__(self, laser, id, x, y, rot, length, dps):
        super().__init__()
        self.parent = laser
        self.type = "laser_beam"
        self.id = id
        self.dps = dps
        self.lifetime = 1
        self.length = length
        self.position = position_system.get_position(self, length, 0, 0, length, 10)
        self.collider_component = collision_system.get_component(self, "line", length)

    def update(self, world, dt):
        if self.parent.lifetime <= 0:
            self.lifetime = -1
        new_length = self.length
        if self.collider_component.is_colliding:
            for collider, penetration in zip(
                    self.collider_component.colliding_with,
                    self.collider_component.penetrations):
                if hasattr(collider.entity, "health") and collider.entity.id != self.id:
                    new_length = min(new_length, self.length*penetration)
                    pos_abs = self.position.get_absolute_pos()
                    particles_pool.create(
                        "fading_particle",
                        pos_abs.x + pos_abs.size_x*math.cos(pos_abs.rot)*(-1+2*penetration),
                        pos_abs.y + pos_abs.size_x*math.sin(pos_abs.rot)*(-1+2*penetration),
                        0, 0, 7, 7, 20
                    )   
                    collider.entity.health -= self.dps*dt
        self.position.x = new_length
        self.position.size_x = new_length
            
