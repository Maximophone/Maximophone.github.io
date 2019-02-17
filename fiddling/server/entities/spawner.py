from server.utils import garbage_filter
from .entity import Entity
from .engine import Engine
from .ship import Ship
from .weapon import Cannon, Laser

import math
from random import random


ENNEMY_HEALTH = 20
SPAWN_DIST = 800

def random_color_laser():
    x = random()
    if x < 0.25:
        return "#aa0000"
    elif x < 0.5:
        return "#00aa00"
    elif x < 0.75:
        return "#0000aa"
    else:
        return "#aaaa00"

def random_color_bullet():
    x = random()
    if x < 0.33:
        return "#ffaaaa"
    elif x < 0.66:
        return "#aaffaa"
    else:
        return "#aaaaff"

class EnnemySpawner(Entity):
    def __init__(self, world, player, spawn_interval):
        super().__init__()
        self.type = "ennemy_spawner"
        self.world = world
        self.player = player
        self.spawn_interval = spawn_interval
        self.timeleft = 0
        self.intensity = 0
        self.ennemies = []

    def spawn(self, n):
        for i in range(n):
            angle = random()*math.pi*2
            x = self.player.position.x + SPAWN_DIST*math.cos(angle)
            y = self.player.position.y + SPAWN_DIST*math.sin(angle)

            ai = Ship(2, x, y, 0, 17, ENNEMY_HEALTH, None, True, self.player)
            engine = Engine(ai, 10, 0.01, 0.05, True)
            ai.engine = engine
            if random() > 0.2:
                weapon = Cannon(ai, 1, 0, 0, 200, 10, True, color=random_color_bullet())
            else:
                weapon = Laser(ai, 1, 0, 0, dps=0.01, ai=True, color=random_color_laser())
            ai.weapons.append(weapon)
            self.world.entities.extend([ai, engine, weapon])
            self.ennemies.extend([ai, engine, weapon])

    def update(self, world, dt):
        garbage_filter(self.ennemies, lambda x: x.to_delete)
        if len(self.ennemies) == 0:
            self.timeleft -= dt
            if self.timeleft < 0 and self.player.health>0:
                self.timeleft = self.spawn_interval
                self.intensity += 1
                self.spawn(self.intensity)
