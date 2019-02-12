from .systems import System
from server.components.position_component import PositionComponent


class PositionSystem(System):
    def get_position(self, entity, x, y, rot=0, size=1):
        position = PositionComponent(entity, x, y, rot, size)
        self.components.append(position)
        return position

    def update(self):
        self.garbage_collect()


position_system = PositionSystem()
