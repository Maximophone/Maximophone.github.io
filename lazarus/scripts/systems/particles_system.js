class Particle {
    constructor(){
	this.graphics = null
	this.type = ""
	this.position = {
	    x: 0,
	    y: 0,
	    rot: 0,
	    size: 1
	}
	this.v = 0
	this.lifetime = 0
	this.max_lifetime = 0
	this.next = null
    }
    init(graphics, type, x, y, rot, v, size, lifetime){
	this.graphics = graphics
	this.type = type
	this.position.x = x
	this.position.y = y
	this.position.rot = rot
	this.v = v
	this.position.size = size
	this.lifetime = lifetime
	this.max_lifetime = lifetime
    }
    in_use(){
	return this.lifetime > 0
    }
    update(dt){
	if(!this.in_use()){
	    return false
	}
	// Movement?
	this.lifetime -= dt
	return this.lifetime <= 0
    }
}

class ParticlesPool {
    constructor(pool_size){
	this.particles = []
	this.pool_size = pool_size
	for(var i = 0; i<pool_size; i++){
	    this.particles.push(new Particle())
	}
	this.first_available = this.particles[0]
	for(var i = 0; i<pool_size-1; i++){
	    this.particles[i].next = this.particles[i+1]
	}
    }
    create(graphics, type, x, y, rot, v, size, lifetime){
	if(this.first_available === null){
	    console.log("particle pool is full")
	    return
	}

	var new_particle = this.first_available
	this.first_available = new_particle.next

	new_particle.init(graphics, type, x, y, rot, v, size, lifetime)
    }
    update(dt){
	for(var particle of this.particles){
	    if(particle.update(dt)){ // particle is dead
		particle.next = this.first_available
		this.first_available = particle
	    }
	}
    }
}
	    
	
export var particles_pool = new ParticlesPool(1000)
