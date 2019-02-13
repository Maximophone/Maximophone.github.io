from .entity import Entity
from server.systems import physics_system, collision_system, position_system, particles_pool

import math

class Bullet(Entity):
    def __init__(self, id, x, y, rot, v, size=2, damage=10):
        self.type = "bullet"
        self.id = id
        self.damage = damage
        self.lifetime = 5000
        self.position = position_system.get_position(self, x, y, rot, size)
        self.physics_component = physics_system.get_component(self, "bullet")
        self.physics_component.vx = v*math.cos(rot)
        self.physics_component.vy = v*math.sin(rot)
        self.collider_component = collision_system.get_component(self, "circle")

    def update(self, world, dt):
        self.lifetime -= dt
        if self.collider_component.is_colliding:
            colliding_with_ennemy = False
            collided_entity = None
            for collider in self.collider_component.colliding_with:
                if hasattr(collider.entity, "id") and collider.entity.id != self.id:
                    colliding_with_ennemy = True
                    collided_entity = collider.entity
            if colliding_with_ennemy:
                self.hit(collided_entity)

    def hit(self, entity):
        if hasattr(entity, "health"):
            entity.health -= self.damage
        self.lifetime = -1
        particles_pool.create(
            "fading_particle",
            self.position.x,
            self.position.y,
            0, 0, 20, 20)
        particles_pool.create(
            "fading_particle",
            self.position.x,
            self.position.y,
            0, 0, 10, 50)
        particles_pool.create(
            "fading_particle",
            self.position.x,
            self.position.y,
            0, 0, 5, 50)
