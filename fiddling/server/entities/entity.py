import itertools


class Entity:
    
    _id_gen = itertools.count()
    
    def __init__(self):
        self.type = "entity"
        self._id = next(Entity._id_gen)
        self.lifetime = 1

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

    def _serialise(self):
        ret = {
            "_id": self._id,
            "type": self.type
        }
        if hasattr(self, "parent"):
            ret["parent_id"] = self.parent._id
        if hasattr(self, "position"):
            ret.update({
                "x": self.position.x,
                "y": self.position.y,
                "rot": self.position.rot,
                "size": self.position.size
                })
        if hasattr(self, "lifetime"):
            ret["lifetime"] = self.lifetime
        if hasattr(self, "serialise"):
            ret.update(self.serialise())
        return ret
            
