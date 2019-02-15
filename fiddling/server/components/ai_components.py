from server.utils import angle_to, distance

import math


def track(pos, target_pos, turn_rate, speed):
    target_angle = angle_to(pos, target_pos)
    if pos.rot != target_angle:
        delta = target_angle - pos.rot
        if delta > math.pi:
            delta -= math.pi*2
        if delta < -math.pi:
            delta += math.pi*2
        if delta > 0:
            pos.rot += turn_rate
        else:
            pos.rot -= turn_rate
        if abs(delta) < turn_rate:
            pos.rot = target_angle

    pos.x += speed*math.cos(pos.rot)
    pos.y += speed*math.sin(pos.rot)


class AIComponent:
    def __init__(self, entity, *args):
        self.entity = entity


class ShipAIComponent(AIComponent):
    def __init__(self, entity, target):
        super().__init__(entity)
        self.target = target

    def update(self, dt):
        SPEED = 2.5
        TURN_RATE = 0.04
        pos = self.entity.position
        target_pos = self.target.position
        track(pos, target_pos, TURN_RATE, SPEED)

        if distance(pos, target_pos) < 500:
            for weapon in self.entity.weapons:
                weapon.firing = True


class MissileAIComponent(AIComponent):
    def update(self, dt):
        user_inputs = self.entity.ship.user.inputs
        SPEED = 10
        TURN_RATE = 0.15
        pos = self.entity.position
        target_pos = user_inputs.get_mouse_target(self.entity.ship.user.camera)
        track(pos, target_pos, TURN_RATE, SPEED)


ai_components = {
    "ship": ShipAIComponent,
    "missile": MissileAIComponent
}
