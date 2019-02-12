from .systems import System
from server.components.ai_components import ai_components


class AISystem(System):
    def __init__(self):
        super().__init__()
        self.components_dict = ai_components

    def get_component(self, entity, type, target):
        component = self.components_dict[type](entity, target)
        self.components.append(component)
        return component


ai_system = AISystem()
