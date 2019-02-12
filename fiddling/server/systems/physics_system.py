from .systems import System
from server.components.physics_components import physics_components


class PhysicsSystem(System):
    def __init__(self):
        super().__init__()
        self.components_dict = physics_components


physics_system = PhysicsSystem()
