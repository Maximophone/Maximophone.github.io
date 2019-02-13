class Entity:
    @property
    def to_delete(self):
        return hasattr(self, "lifetime") and self.lifetime < 0

    def set_user(self, user):
        self._user = user

    @property
    def user(self):
        if not hasattr(self, "_user"):
            if hasattr(self, "parent"):
                self._user = self.parent.user
                return self._user
            else:
                self._user = None
                return
        else:
            return self._user
