from .systems import System
from server.components.collider_components import collider_components
from server.cutils import collisions
from typing import NamedTuple

class Collider(NamedTuple):
    typ: str
    x: float
    y: float
    rot: float
    size_x: float
    size_y: float
    r: float
    l: float


class CollisionSystem(System):
    def __init__(self):
        super().__init__()
        self.components_dict = collider_components

    def update(self, world, dt):
        for collider in self.components:
            collider.colliding_with = []
            collider.is_colliding = False
            collider.penetrations = []
        self.garbage_collect()

        colliders = []
        for component in self.components:
            absolute_pos = component.entity.position.get_absolute_pos()
            colliders.append(
                Collider(
                    typ=component.type.encode(),
                    x=absolute_pos.x,
                    y=absolute_pos.y,
                    rot=absolute_pos.rot,
                    size_x=absolute_pos.size_x,
                    size_y=absolute_pos.size_y,
                    r=component.radius if hasattr(component, "radius") else 0,
                    l=component.length if hasattr(component, "length") else 0
                )
            )

        collision_responses = collisions.solve(colliders)

        for collider, col_resp in zip(self.components, collision_responses):
            collider.is_colliding = bool(col_resp[0])
            for i, p in zip(col_resp[1], col_resp[2]):
                collider.colliding_with.append(self.components[i])
                collider.penetrations.append(p)


collision_system = CollisionSystem()
