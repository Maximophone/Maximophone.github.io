import math

V_FRICTION = 0.01


def cap_abs(x, abs_max):
    return min(max(x, -abs_max), abs_max)


class PhysicsComponent:
    def __init__(self, entity):
        self.entity = entity
        self.vx = 0
        self.vy = 0
        self.v_rot = 0

    def v(self):
        return math.sqrt(self.vx**2 + self.vy**2)


class BulletPhysicsComponent(PhysicsComponent):
    def update(self, dt):
        self.entity.position.x += self.vx
        self.entity.position.y += self.vy
        self.entity.position.rot += self.v_rot


class ShipPhysicsComponent(PhysicsComponent):
    def update(self, dt):
        engine = self.entity.engine
        position = self.entity.position
        cos = math.cos(position.rot)
        sin = math.sin(position.rot)
        cos_right = math.cos(position.rot + math.pi/2)
        sin_right = math.sin(position.rot + math.pi/2)
        cos_left = math.cos(position.rot - math.pi/2)
        sin_left = math.sin(position.rot - math.pi/2)

        if engine.accelerate:
            self.vx = cap_abs(self.vx + dt*engine.delta_v*cos, abs(engine.max_v*cos))
            self.vy = cap_abs(self.vy + dt*engine.delta_v*sin, abs(engine.max_v*sin))
        elif engine.deccelerate:
            self.vx = cap_abs(self.vx - dt*engine.delta_v*cos, abs(engine.max_v*cos))
            self.vy = cap_abs(self.vy - dt*engine.delta_v*sin, abs(engine.max_v*sin))
        if engine.strafe_right:
            self.vx = cap_abs(self.vx + dt*engine.delta_v*cos_left, abs(engine.max_v*cos_left))
            self.vy = cap_abs(self.vy + dt*engine.delta_v*sin_left, abs(engine.max_v*sin_left))
        elif engine.strafe_left:
            self.vx = cap_abs(self.vx + dt*engine.delta_v*cos_right, abs(engine.max_v*cos_right))
            self.vy = cap_abs(self.vy + dt*engine.delta_v*sin_right, abs(engine.max_v*sin_right))

        # FRICTION
        if not (engine.accelerate or engine.deccelerate or engine.strafe_left or engine.strafe_right):
            if self.v() > 0:
                if self.vx > 0:
                    self.vx = max(self.vx - dt*V_FRICTION, 0)
                else:
                    self.vx = min(self.vx + dt*V_FRICTION, 0)
                if self.vy > 0:
                    self.vy = max(self.vy - dt*V_FRICTION, 0)
                else:
                    self.vy = min(self.vy + dt*V_FRICTION, 0)

        if position.rot != engine.target_angle:
            delta = engine.target_angle - position.rot
            if delta > math.pi:
                delta -= math.pi*2
            if delta < -math.pi:
                delta += math.pi*2
            if delta > 0:
                self.entity.position.rot += engine.delta_rot
            else:
                self.entity.position.rot -= engine.delta_rot
            if abs(delta) < engine.delta_rot:
                self.entity.position.rot = engine.target_angle

        self.entity.position.x += self.vx
        self.entity.position.y += self.vy


physics_components = {
    "bullet": BulletPhysicsComponent,
    "ship": ShipPhysicsComponent
}
