from .systems import System
from server.components.collider_components import collider_components


class CollisionSystem(System):
    def __init__(self):
        super().__init__()
        self.components_dict = collider_components

    def update(self, world, dt):
        for collider in self.components:
            collider.colliding_with = []
            collider.is_colliding = False
        self.garbage_collect()

        for i in range(len(self.components)):
            for j in range(i+1, len(self.components)):
                collider1 = self.components[i]
                collider2 = self.components[j]

                if collider1.collides_with(collider2):
                    collider1.is_colliding = True
                    collider2.is_colliding = True
                    collider1.colliding_with.append(collider2)
                    collider2.colliding_with.append(collider1)


collision_system = CollisionSystem()
