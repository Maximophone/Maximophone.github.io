class Pos:
    def __init__(self, x, y, rot, size_x, size_y):
        self.x = x
        self.y = y
        self.rot = rot
        self.size_x = size_x
        self.size_y = size_y


class PositionComponent:
    def __init__(self, entity, x, y, rot, size_x, size_y=None):
        self.entity = entity
        self.x = x
        self.y = y
        self.rot = rot
        self.size_x = size_x
        self.size_y = size_y if size_y is not None else size_x

    def get_absolute_pos(self):
        # TODO: this needs to take into account rotation and size as well
        abs_x = self.x
        abs_y = self.y
        size_x = self.size_x
        size_y = self.size_y
        entity = self.entity
        while hasattr(entity, "parent"):
            entity = entity.parent
            abs_x += entity.position.x
            abs_y += entity.position.y
            size_x *= entity.position.size_x
            size_y *= entity.position.size_y

        return Pos(abs_x, abs_y, self.rot, size_x, size_y)

    def __repr__(self):
        return f"(X:{self.x:.1f}, Y:{self.y:.1f})"
