class Entity:
    @property
    def to_delete(self):
        return hasattr(self, "lifetime") and self.lifetime < 0
