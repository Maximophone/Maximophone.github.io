from server.utils import garbage_filter


class System:
    def __init__(self):
        self.components = []
        self.components_dict = None

    def get_component(self, entity, type, *args, **kwargs):
        component = self.components_dict[type](entity, *args, **kwargs)
        self.components.append(component)
        return component

    def garbage_collect(self):
        garbage_filter(self.components, lambda c: c.entity.to_delete)

    def update(self, world, dt):
        self.garbage_collect()
        for component in self.components:
            component.update(dt)
