from .entity import Entity
from server.systems import position_system, collision_system


class LaserBeam(Entity):
    def __init__(self, id, x, y, rot, length, dps):
        self.type = "laser_beam"
        self.id = id
        self.dps = dps
        self.lifetime = 1
        self.position = position_system.get_position(x, y, rot, length)
        self.collider_component = collision_system.get_component(self, "line", length)

    def update(self, world, dt):
        if self.collider_component.is_colliding:
            for collider in self.collider_component.colliding_with:
                if hasattr(collider.entity, "health") and collider.entity.id != self.id:
                    collider.entity.health -= self.dps*dt
