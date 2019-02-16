from .entity import Entity
from .engine import Engine
from server.systems import position_system, physics_system, ai_system, collision_system

import math


class Missile(Entity):
    def __init__(self, world, ship, id, x, y, rot, v, size=15):
        super().__init__()
        self.type = "missile"
        self.ship = ship
        self.id = id
        self.lifetime = 10000
        self.trigger_time = 0.9*self.lifetime
        self.position = position_system.get_position(self, x, y, rot, size)
        self.physics_component = physics_system.get_component(self, "bullet")
        self.physics_component.vx = v*math.cos(rot)
        self.physics_component.vy = v*math.sin(rot)
        self.physics_component.v_rot = 0.3
        self.collider_component = collision_system.get_component(self, "circle")

        self.engine = Engine(self, 10, 1, 0.2, True)
        world.entities.append(self.engine)

    def update(self, world, dt):
        self.lifetime -= dt
        if self.lifetime < self.trigger_time:
            if not hasattr(self, "ai_component"):
                self.ai_component = ai_system.get_component(self, "missile", None)
                self.engine.accelerate = True
                self.physics_component.vx = 0
                self.physics_component.vy = 0
                self.physics_component.v_rot = 0
            colliding = False
            if self.collider_component.is_colliding:
                for collider in self.collider_component.colliding_with:
                    if collider.entity.type != "loot":
                        colliding = True
            if colliding or self.lifetime <= 0:
                world.entities.append(Explosion(self.id, self.position.x, self.position.y))
                self.lifetime = -1


class Explosion(Entity):
    def __init__(self, id, x, y, size=200, damage=20):
        super().__init__()
        self.type = "explosion"
        self.id = id
        self.lifetime = 1000
        self.init_lifetime = self.lifetime
        self.size_0 = size/20
        self.size_1 = size
        self.damage = damage
        self.position = position_system.get_position(self, x, y, 0, size)
        self.collider_component = collision_system.get_component(self, "circle")

    def update(self, world, dt):
        if self.collider_component.is_colliding:
            for collider in self.collider_component.colliding_with:
                if hasattr(collider.entity, "health"):
                    collider.entity.health -= self.damage

        t = 1 - self.lifetime/self.init_lifetime
        t = t**5
        self.position.size_x = self.position.size_y = t*self.size_1 + (1-t)*self.size_0
        self.lifetime -= dt
