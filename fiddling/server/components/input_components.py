from server.user_inputs import GameKeys, KeyCodes
from server.utils import angle_to

import math


class InputComponent:
    def __init__(self, entity):
        self.entity = entity

    def check_has_user(self):
        assert self.entity.user is not None, f"Trying to get user input on entity without user. Entity: {self.entity}"

    @property
    def user_inputs(self):
        self.check_has_user()
        return self.entity.user.inputs

    @property
    def camera(self):
        self.check_has_user()
        return self.entity.user.camera


class MouseInputComponent(InputComponent):
    def update(self, dt):
        mouse_target = self.user_inputs.get_mouse_target(self.camera)
        self.entity.position.x = mouse_target.x
        self.entity.position.y = mouse_target.y


class PlayerInputShipComponent(InputComponent):
    def update(self, dt):
        mouse_target = self.user_inputs.get_mouse_target(self.camera)
        self.entity.engine.target_angle = angle_to(self.entity.position, mouse_target)


class PlayerInputEngineComponent(InputComponent):
    def update(self, dt):
        user_inputs = self.user_inputs
        if user_inputs.pressed_key(GameKeys.ACCELERATE):
            self.entity.accelerate = True
            self.entity.deccelerate = False
            self.entity.position.rot = 0
            self.entity.position.x = -1
            self.entity.position.y = 0
        elif user_inputs.pressed_key(GameKeys.DECCELERATE):
            self.entity.deccelerate = True
            self.entity.accelerate = False
            self.entity.position.rot = math.pi
            self.entity.position.x = 1
            self.entity.position.y = 0
        else:
            self.entity.accelerate = False
            self.entity.deccelerate = False

        if user_inputs.pressed_key(GameKeys.RIGHT):
            self.entity.strafe_right = True
            self.entity.strafe_left = False
            self.entity.position.rot = -math.pi/2
            self.entity.position.x = 0
            self.entity.position.y = 1
        elif user_inputs.pressed_key(GameKeys.LEFT):
            self.entity.strafe_left = True
            self.entity.stafe_right = False
            self.entity.position.rot = math.pi/2
            self.entity.position.x = 0
            self.entity.position.y = -1
        else:
            self.entity.strafe_right = False
            self.entity.strafe_left = False


class PlayerInputWeaponComponent(InputComponent):
    def update(self, dt):
        self.entity.firing = self.user_inputs.pressed_key(GameKeys.FIRE)


class PlayerInputWeaponSecondaryComponent(InputComponent):
    def update(self, dt):
        self.entity.firing = self.user_inputs.pressed_key(GameKeys.FIRE_2)
    

class PlayerInputDebugComponent(InputComponent):
    def update(self, dt):
        if self.user_inputs.pressed_key(KeyCodes.LEFT):
            self.entity.position.size *= 1.1

        if self.user_inputs.pressed_key(KeyCodes.RIGHT):
            self.entity.position.size *= 0.9


input_components = {
    "engine": PlayerInputEngineComponent,
    "weapon": PlayerInputWeaponComponent,
    "weapon_secondary": PlayerInputWeaponSecondaryComponent,
    "ship": PlayerInputShipComponent,
    "mouse": MouseInputComponent,
    "debug": PlayerInputDebugComponent
}
