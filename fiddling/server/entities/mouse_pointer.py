from .entity import Entity
from server.systems import position_system, input_system


class MousePointer(Entity):
    def __init__(self, camera, user):
        super().__init__()
        self.type = "pointer"
        self.set_user(user)
        self.camera = camera
        self.position = position_system.get_position(self, 0, 0, 0, 5)
        self.input_component = input_system.get_component(self, "mouse")
