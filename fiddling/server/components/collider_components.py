from server.utils import distance


class ColliderComponent:
    def __init__(self, entity):
        self.entity = entity
        self.active = True
        self.is_colliding = False
        self.colliding_with = []


class CircleColliderComponent(ColliderComponent):
    def __init__(self, entity, r=1):
        super().__init__(self, entity)
        self.radius = r
        self.type = "circle"

    def collides_with(self, collider):
        if not self.active:
            return False
        if collider.type == "circle":
            pos_self = self.entity.position.get_absolute_pos()
            pos_other = collider.entity.position.get_absolute_pos()
            return distance(pos_self, pos_other) < pos_self.size*self.radius + pos_other.size*collider.radius


collider_components = {
    "circle": CircleColliderComponent
}
