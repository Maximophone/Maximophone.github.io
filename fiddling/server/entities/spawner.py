from .entity import Entity
from .engine import Engine
from .ship import Ship
from .weapon import Cannon

import math
from random import random


ENNEMY_HEALTH = 20
SPAWN_DIST = 800


class EnnemySpawner(Entity):
    def __init__(self, world, player, spawn_interval):
        super().__init__()
        self.type = "ennemy_spawner"
        self.world = world
        self.player = player
        self.spawn_interval = spawn_interval
        self.timeleft = 0
        self.intensity = 1

    def spawn(self, n):
        for i in range(n):
            angle = random()*math.pi*2
            x = self.player.position.x + SPAWN_DIST*math.cos(angle)
            y = self.player.position.y + SPAWN_DIST*math.sin(angle)

            ai = Ship(2, x, y, 0, 17, ENNEMY_HEALTH, None, True, self.player)
            engine = Engine(ai, 10, 0.01, 0.05, True)
            ai.engine = engine
            cannon = Cannon(ai, 1, 0, 0, 200, 10, True)
            ai.weapons.append(cannon)
            self.world.entities.extend([ai, engine, cannon])

    def update(self, world, dt):
        self.timeleft -= dt
        if self.timeleft < 0 and self.player.health>0:
            self.timeleft = self.spawn_interval
            # self.intensity += 1
            self.spawn(self.intensity)
