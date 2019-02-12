import threading
import numpy as np
import time

from .world import World
from app import ping_users

last_dt = []


def fps(dt):
    N = 100
    last_dt.append(dt)
    if len(last_dt) >= N:
        mean_dt = np.mean(last_dt)
        # print(f"FPS: {1./mean_dt:.0f}")
        del last_dt[:]


class Gx(threading.Thread):
    def __init__(self):
        super().__init__()
        self.world = World()

    def update(self, dt):
        fps(dt)
        self.world.update(dt)

    def run(self):
        last_render = time.time()
        i = 0
        while True:
            i += 1
            timestamp = time.time()
            dt = timestamp - last_render
            last_render = timestamp

            self.update(dt)
            time.sleep(0.005)

            if i == 1000:
                print("Pinging users")
                ping_users()
