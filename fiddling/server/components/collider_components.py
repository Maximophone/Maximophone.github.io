from server.utils import distance


class ColliderComponent:
    def __init__(self, entity):
        self.entity = entity
        self.active = True
        self.is_colliding = False
        self.colliding_with = []
        self.penetrations = []


class CircleColliderComponent(ColliderComponent):
    def __init__(self, entity, r=1):
        super().__init__(entity)
        self.radius = r
        self.type = "circle"


class LineColliderComponent(ColliderComponent):
    def __init__(self, entity, length):
        super().__init__(entity)
        self.length = length
        self.type = "line"
        
collider_components = {
    "circle": CircleColliderComponent,
    "line": LineColliderComponent
}
