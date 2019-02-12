from .systems import System
from server.components.input_components import input_components


class InputSystem(System):
    def __init__(self):
        super().__init__()
        self.components_dict = input_components


input_system = InputSystem()
