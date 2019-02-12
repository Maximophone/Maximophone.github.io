from .utils import garbage_filter
from .entities.ship import Ship


class World:
    def __init__(self):
        self.entities = []
        self.systems = []

    def update(self, dt):
        for system in self.systems:
            system.update(self, dt)
        for entity in self.entities:
            entity.update(self, dt)
        garbage_filter(self.entities, lambda x: x.to_delete)
