import { physics_system } from '../systems/physics_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { collision_system } from '../systems/collision_system.js'
import { particles_pool } from '../systems/particles_system.js'
import { graphics_components } from '../components/graphics_components.js'
import { position_system } from '../systems/position_system.js'
import { ai_system } from '../systems/ai_system.js'
import { Engine } from './engine_entity.js'

export class Missile {
    constructor(world, id, x, y, rot, v, size=15){
	this.type = "missile"
	this.id = id
	this.lifetime = 10000
	this.trigger_time = 0.9*this.lifetime
	this.position = position_system.get_position(this, x, y, rot, size)
	//this.physics_component = physics_system.get_component("ship", this)
	this.physics_component = physics_system.get_component("bullet", this)
	this.physics_component.vx = v*Math.cos(rot)
	this.physics_component.vy = v*Math.sin(rot)
	this.physics_component.v_rot = 0.3
	this.graphics_component = graphics_system.get_component("missile", this)
	this.collider_component = collision_system.get_component("circle", this)
	
	this.engine = new Engine(this, 10, 1, 0.2, true)
	world.entities.push(this.engine)
    }
    update(world, dt){
	this.lifetime -= dt
	if(this.lifetime < this.trigger_time){
	    if(!this.ai_component){
		this.ai_component = ai_system.get_component("missile", this)
		this.engine.accelerate = true
		this.physics_component.vx = 0
		this.physics_component.vy = 0
		this.physics_component.v_rot = 0
	    }
	    var colliding = false
	    if(this.collider_component.is_colliding){
		for(var collider of this.collider_component.colliding_with){
		    if(collider.entity.id == 1 || collider.entity.id == 2){
			colliding = true
		    }
		}
	    }
	    if(colliding || this.lifetime <= 0){
		world.entities.push(new Explosion(this.id, this.position.x, this.position.y))
		this.lifetime = -1
	    }
	}
    }
}

export class Explosion {
    constructor(id, x, y, size=200, damage = 20){
	this.type="explosion"
	this.id = id
	this.lifetime = 1000
	this.init_lifetime = this.lifetime
	this.size_0 = size/20
	this.size_1 = size
	this.damage = damage
	this.position = position_system.get_position(this, x, y, 0, size)
	this.grahics_component = graphics_system.get_component("explosion", this)
	//this.graphics_component = graphics_system.get_component("light_circle", this)
	this.debug_graphics = graphics_system.get_component("circle", this)
	this.collider_component = collision_system.get_component("circle", this)
    }
    update(world, dt){
	if(this.collider_component.is_colliding){
	    for(var collider of this.collider_component.colliding_with){
		if(collider.entity.health){
		    collider.entity.health -= this.damage
		}
	    }
	}
	var t = 1-this.lifetime/this.init_lifetime
	t = t**5
	this.position.size = t*this.size_1 + (1-t)*this.size_0
	this.lifetime -= dt
    }
}
	
