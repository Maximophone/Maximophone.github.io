from .systems import System
from server.components.position_component import PositionComponent


class PositionSystem(System):
    def get_position(self, entity, x, y, rot=0, size_x=1, size_y=None):
        position = PositionComponent(entity, x, y, rot, size_x, size_y)
        self.components.append(position)
        return position

    def update(self, world, dt):
        self.garbage_collect()


position_system = PositionSystem()
