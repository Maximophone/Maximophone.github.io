import { physics_system } from '../systems/physics_system.js'
import { input_system } from '../systems/input_system.js'
import { collision_system } from '../systems/collision_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { position_system } from '../systems/position_system.js'
import { ai_system } from '../systems/ai_system.js'
import { Loot } from './loot_entity.js'
import { particles_pool } from '../systems/particles_system.js'
import { graphics_components } from '../components/graphics_components.js'

export class Ship {
    constructor(id, x, y, rot, size, health, engine, weapons=[], ai=false, target=null){
	this.type = "ship"
	this.id = id
	this.health = health
	this.lifetime = 1
	this.weapons = weapons
	this.engine = engine
	this.shield = null
	this.position = position_system.get_position(this, x, y, rot, size)
	if (!ai){
	    this.physics_component = physics_system.get_component("ship", this)
	    this.input_component = input_system.get_component("ship", this)
	} else {
	    this.physics_component = physics_system.get_component("bullet", this)
	    this.ai_component = ai_system.get_component("ship", this, target)
	}
	this.graphics_component = graphics_system.get_component("ship", this)
	this.collider_component = collision_system.get_component("circle", this)
    }
    spawn_loot(world){
	var n_loot = 5
	var v_loot = 0.5
	for(var i = 0; i<n_loot; i++){
	    world.entities.push(new Loot(this.position.x, this.position.y, Math.random()*2*Math.PI, v_loot, (Math.random()*2 - 1.)*0.1))
	}
    }
    update(world, dt){
	if(this.shield){
	    this.shield.update(world, dt)
	}
	if(this.collider_component.is_colliding){
	    for(var collider of this.collider_component.colliding_with){
		switch(collider.entity.type){
		case "ship":
		    for(var collider of this.collider_component.colliding_with){
			if(collider.entity.id && (collider.entity.id != this.id)){
			    this.health -= dt
			}
		    }
		    break
		case "loot":
		    this.position.size *= 1.01
		    this.health *= 1.01
		    collider.entity.lifetime = -1
		}
	    }
	}
	if(this.health<=0){
	    this.lifetime = -1
	    this.engine.lifetime = -1
	    for(var weapon of this.weapons){
		weapon.lifetime = -1
	    }
	    particles_pool.create(
		graphics_components.fading_particle,
		"fading_particle",
		this.position.x,
		this.position.y,
		0,
		0,
		200,
		25
	    )
	    particles_pool.create(
		graphics_components.fading_particle,
		"fading_particle",
		this.position.x,
		this.position.y,
		0,
		0,
		75,
		50
	    )
	    this.spawn_loot(world)
	}
    }
}
