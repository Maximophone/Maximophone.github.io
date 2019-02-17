from .entity import Entity
from server.systems import position_system

class Debug(Entity):
    def __init__(self, type="debug", x=0, y=0, rot=0, size_x=1, size_y=1, position=None, parent=None, track=None):
        super().__init__()
        self.type = type
        self.lifetime = 1
        if position is None:
            self.position = position_system.get_position(self, x, y, rot, size_x, size_y)
        else:
            self.position = position
        if parent is not None:
            self.parent = parent
        if track is not None:
            self.track = track

    def update(self, world, dt):
        if self.track is not None:
            track_pos = self.track.position.get_absolute_pos()
            self.position.set_from(track_pos)
