from typing import NamedTuple


class MousePos(NamedTuple):
    x: float
    y: float


class UserInputs:
    def __init__(self):
        self._pressed_keys = {}
        self._mouse_target = MousePos(0, 0)
        self._mouse_clicked = False

    def pressed_key(self, k):
        return self._pressed_keys.get(k, False)

    def press_key(self, k):
        self._pressed_keys[k] = True

    def release_key(self, k):
        self._pressed_keys[k] = False

    def move_mouse(self, x, y):
        self._mouse_target = MousePos(x, y)

    def click_mouse(self):
        self._mouse_clicked = True

    def release_mouse(self):
        self._mouse_clicked = False

    def clicked_mouse(self):
        return self._mouse_clicked

    def get_mouse_target(self, camera=None):
        if camera is not None:
            return MousePos(
                self._mouse_target.x * camera.size_x + camera.x,
                self._mouse_target.y * camera.size_y + camera.y
            )
        else:
            return self._mouse_target


class KeyCodes:
    SPACE = 32
    W = 87
    A = 65
    S = 83
    D = 68
    E = 69
    UP = 38
    DOWN = 40
    LEFT = 37
    RIGHT = 39


class GameKeys:
    FIRE = KeyCodes.SPACE
    FIRE_2 = KeyCodes.E
    ACCELERATE = KeyCodes.W
    DECCELERATE = KeyCodes.S
    TURN_CW = KeyCodes.A
    TURN_ACW = KeyCodes.D
    UP = KeyCodes.W
    DOWN = KeyCodes.S
    RIGHT = KeyCodes.D
    LEFT = KeyCodes.A
    ZOOM_IN = KeyCodes.UP
    ZOOM_OUT = KeyCodes.DOWN
