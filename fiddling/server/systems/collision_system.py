from .systems import System
from server.components.collider_components import collider_components
from server.cutils import collisions
from typing import NamedTuple

class Collider(NamedTuple):
    typ: str
    x: float
    y: float
    size: float
    r: float


class CollisionSystem(System):
    def __init__(self):
        super().__init__()
        self.components_dict = collider_components

    def update(self, world, dt):
        for collider in self.components:
            collider.colliding_with = []
            collider.is_colliding = False
        self.garbage_collect()

        colliders = []
        for component in self.components:
            absolute_pos = component.entity.position.get_absolute_pos()
            colliders.append(
                Collider(
                    typ=component.type.encode(),
                    x=absolute_pos.x,
                    y=absolute_pos.y,
                    size=absolute_pos.size,
                    r=component.radius
                )
            )

        collision_responses = collisions.solve(colliders)

        for collider, col_resp in zip(self.components, collision_responses):
            collider.is_colliding = bool(col_resp[0])
            for i in col_resp[1]:
                collider.colliding_with.append(self.components[i])
        # for i in range(len(self.components)):
        #     for j in range(i+1, len(self.components)):
        #         collider1 = self.components[i]
        #         collider2 = self.components[j]

        #         if collider1.collides_with(collider2):
        #             collider1.is_colliding = True
        #             collider2.is_colliding = True
        #             collider1.colliding_with.append(collider2)
        #             collider2.colliding_with.append(collider1)


collision_system = CollisionSystem()
