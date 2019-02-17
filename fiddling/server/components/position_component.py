import numpy as np
import math

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

    @property
    def mat(self):
        return np.array([
            [self.size_x*math.cos(self.rot), -self.size_y*math.sin(self.rot), self.x],
            [self.size_x*math.sin(self.rot), self.size_y*math.cos(self.rot), self.y],
            [0, 0, 1]
        ])

    def get_absolute_pos(self):
        mat = self.mat

        entity = self.entity
        while hasattr(entity, "parent"):
            entity = entity.parent
            mat = np.matmul(entity.position.mat, mat)

        x = mat[0,2]
        y = mat[1,2]
        size_x = np.linalg.norm(mat[0:2,0])
        size_y = np.linalg.norm(mat[0:2,1])
        rot = math.atan2(mat[1,0], mat[0,0])

        return Pos(x, y, rot, size_x, size_y)

    def set_from(self, position):
        self.x = position.x
        self.y = position.y
        self.rot = position.rot
        self.size_x = position.size_x
        self.size_y = position.size_y

    def __repr__(self):
        return f"(X:{self.x:.1f}, Y:{self.y:.1f})"
