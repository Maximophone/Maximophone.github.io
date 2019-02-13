class Pos:
    def __init__(self, x, y, rot, size):
        self.x = x
        self.y = y
        self.rot = rot
        self.size = size


class PositionComponent:
    def __init__(self, entity, x, y, rot, size):
        self.entity = entity
        self.x = x
        self.y = y
        self.rot = rot
        self.size = size

    def get_absolute_pos(self):
        # TODO: this needs to take into account rotation and size as well
        abs_x = self.x
        abs_y = self.y
        size = self.size
        entity = self.entity
        while hasattr(entity, "parent"):
            entity = entity.parent
            abs_x += entity.position.x
            abs_y += entity.position.y
            size *= entity.position.size

        return Pos(abs_x, abs_y, self.rot, size)

    def __repr__(self):
        return f"(X:{self.x:.1f}, Y:{self.y:.1f})"
