from .user_inputs import GameKeys


class Camera:
    def __init__(self, x, y, scale, target, user_inputs):
        self.x = x
        self.y = y
        self.scale = scale
        self.target = target
        self.user_inputs = user_inputs
        self.size_x = 1
        self.size_y = 1

    def update(self, dt):
        if self.user_inputs.pressed_key(GameKeys.ZOOM_IN):
            self.scale *= 0.99
        elif self.user_inputs.pressed_key(GameKeys.ZOOM_OUT):
            self.scale *= 1.01

        self.size_x = self.target.position.size_x * self.scale
        self.size_y = self.target.position.size_y * self.scale
        self.x = self.target.position.x
        self.y = self.target.position.y
