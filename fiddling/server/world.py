from .utils import garbage_filter
from .entities.ship import Ship
from .users import users
from .systems import physics_system, ai_system, collision_system, input_system, position_system, particles_pool

class World:
    def __init__(self):
        self.entities = []
        self.systems = [
            position_system,
            input_system,
            collision_system,
            physics_system,
            ai_system,
            particles_pool
        ]

    def update(self, dt):
        for system in self.systems:
            system.update(self, dt)
        for entity in self.entities:
            entity.update(self, dt)
        garbage_filter(self.entities, lambda x: x.to_delete)

        for user in users.connected.values():
            if not user.in_world:
                user.join_world(self)
            else:
                user.camera.update(dt)
