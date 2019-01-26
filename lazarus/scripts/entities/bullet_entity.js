import { physics_system } from '../systems/physics_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { collision_system } from '../systems/collision_system.js'
import { particles_pool } from '../systems/particles_system.js'
import { graphics_components } from '../components/graphics_components.js'

export class Bullet {
    constructor(id, x, y, rot, v, size=2, damage=10){
	this.type = "bullet"
	this.id = id
	this.x = x
	this.y = y
	this.rot = rot
	this.v_dir = v
	this.v_rot = 0
	this.size = size
	this.damage = damage
	this.lifetime = 5000
	this.physics_component = physics_system.get_component("bullet", this)
	this.graphics_component = graphics_system.get_component("bullet", this)
	this.collider_component = collision_system.get_component("circle", this)
    }
    update(world, dt){
	this.lifetime -= dt
	if(this.collider_component.is_colliding){
	    var colliding_with_ennemy = false
	    var collided_entity = null
	    for(var collider of this.collider_component.colliding_with){
		if(collider.entity.id && (collider.entity.id != this.id)){
		    colliding_with_ennemy = true
		    collided_entity = collider.entity
		}
	    }
	    if(colliding_with_ennemy){ 
		this.hit(collided_entity)
	    }
	}
    }
    hit(entity){
	if(entity.health){
	    entity.health -= this.damage
	}
	this.lifetime = -1
	particles_pool.create(
	    graphics_components.fading_particle,
	    "fading_particle",
	    this.x,
	    this.y,
	    0,
	    0,
	    50,
	    25
	)
	particles_pool.create(
	    graphics_components.fading_particle,
	    "fading_particle",
	    this.x,
	    this.y,
	    0,
	    0,
	    20,
	    50
	)
	particles_pool.create(
	    graphics_components.fading_particle,
	    "fading_particle",
	    this.x,
	    this.y,
	    0,
	    0,
	    10,
	    50
	)
    }
}
