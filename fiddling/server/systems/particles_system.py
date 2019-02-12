class PartPos:
    def __init__(self, x, y, rot, size):
        self.x = x
        self.y = y
        self.rot = rot
        self.size = size


class Particle:
    def __init__(self):
        self.type = ""
        self.position = PartPos(0, 0, 0, 1)
        self.v = 0
        self.lifetime = 0
        self.max_lifetime = 0
        self.next = None

    def init(self, type, x, y, rot, v, size, lifetime):
        self.type = type
        self.position.x = x
        self.position.y = y
        self.position.rot = rot
        self.v = v
        self.position.size = size
        self.lifetime = lifetime
        self.max_lifetime = lifetime

    def in_use(self):
        return self.lifetime > 0

    def update(self, dt):
        if not self.in_use():
            return False

        # Movement??
        self.lifetime -= dt
        return self.lifetime <= 0


class ParticlesPool:
    def __init__(self, pool_size):
        self.particles = []
        self.pool_size = pool_size
        for i in range(pool_size):
            self.particles.append(Particle())
        self.first_available = self.particles[0]
        for i in range(pool_size - 1):
            self.particles[i].next = self.particles[i+1]

    def create(self, type, x, y, rot, v, size, lifetime):
        if self.first_available is None:
            print("Particle pool is full")
            return

        new_particle = self.first_available
        self.first_available = new_particle.next

        new_particle.init(type, x, y, rot, v, size, lifetime)

    def update(self, world, dt):
        for particle in self.particles:
            if particle.update(dt):
                # particle is dead
                particle.next = self.first_available
                self.first_available = particle


particles_pool = ParticlesPool(1000)
