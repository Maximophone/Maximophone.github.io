from .entity import Entity
from .loot import Loot
from server.systems import position_system, physics_system, input_system, ai_system, collision_system, particles_pool

from random import random
import math
import ipdb


class Ship(Entity):
    def __init__(self, id, x, y, rot, size, health, engine, weapons=[], ai=False, target=None):
        super().__init__()
        self.type = "ship"
        self.id = self._id+5
        self.health = health
        self.max_health = health
        self.lifetime = 1
        self.weapons = weapons
        self.engine = engine
        self.shield = None
        self.position = position_system.get_position(self, x, y, rot, size)
        if not ai:
            self.physics_component = physics_system.get_component(self, "ship")
            self.input_component = input_system.get_component(self, "ship")
        else:
            self.physics_component = physics_system.get_component(self, "bullet")
            self.ai_component = ai_system.get_component(self, "ship", target)
        self.collider_component = collision_system.get_component(self, "circle")

    def spawn_loot(self, world):
        n_loot = 5
        v_loot = 0.5
        for i in range(n_loot):
            world.entities.append(Loot(self.position.x, self.position.y, random()*2*math.pi, v_loot, (random()*2 - 1)*0.1))

    def update(self, world, dt):
        if self.shield:
            self.shield.update(world, dt)

        if self.collider_component.is_colliding:
            for collider in self.collider_component.colliding_with:
                if collider.entity.type == "ship":
                    if hasattr(collider.entity, "id") and collider.entity.id != self.id:
                        self.health -= dt
                elif collider.entity.type == "loot":
                    self.position.size *= 1.001
                    self.health *= 1.001
                    collider.entity.lifetime = -1

        if self.health <= 0:
            #ipdb.set_trace()
            self.lifetime = -1
            self.engine.lifetime = -1
            for weapon in self.weapons:
                weapon.lifetime = -1
            particles_pool.create(
                "fading_particle",
                self.position.x,
                self.position.y,
                0,
                0,
                100,
                25
            )
            particles_pool.create(
                "fading_particle",
                self.position.x,
                self.position.y,
                0,
                0,
                50,
                50
            )
            self.spawn_loot(world)

    def serialise(self):
        return {
            "health": self.health,
            "max_health": self.max_health
        }
        
