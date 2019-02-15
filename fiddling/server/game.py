import threading
import numpy as np
import time

from .world import World
from app import ping_users, send_state
from .users import users
from .systems.particles_system import particles_pool

last_dt = []


def fps(dt):
    N = 100
    last_dt.append(dt)
    if len(last_dt) >= N:
        mean_dt = np.mean(last_dt)
        print(f"FPS: {1000./mean_dt:.0f}")
        del last_dt[:]


class Gx(threading.Thread):
    def __init__(self):
        super().__init__()
        self.world = World()

    def update(self, dt):
        fps(dt)
        self.world.update(dt)

    def broadcast(self):
        entities_data = {
            entity._id: entity._serialise() for entity in self.world.entities
            }
        users_data = {id: user._serialise() for id, user in users.connected.items()}
        data = {
            "entities": entities_data,
            "users": users_data,
            "particles": particles_pool._serialise()
        }   
        send_state(data)

    def run(self):
        last_render = time.time()
        i = 0
        while True:
            i += 1
            timestamp = time.time()
            dt = (timestamp - last_render)*1000.
            last_render = timestamp

            self.update(dt)
            time.sleep(0.02)
            self.broadcast()

            if i == 1000:
                print("Pinging users")
                ping_users()

            if i%1000 == 0:
                pass
                # print([entity._serialise() for entity in self.world.entities])
                # print([getattr(entity, "position") for entity in self.world.entities])
                
