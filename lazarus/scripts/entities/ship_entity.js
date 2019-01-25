import { physics_system } from '../systems/physics_system.js'
import { input_system } from '../systems/input_system.js'
import { collision_system } from '../systems/collision_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { Loot } from './loot_entity.js'

export class Ship {
    constructor(id, x, y, rot, size, engine, weapons=[]){
	this.type = "ship"
	this.id = id
	this.x = x
	this.y = y
	this.rot = rot
	this.size = size
	this.v_dir = 0
	this.v_rot = 0
	this.health = 100
	this.lifetime = 1
	this.weapons = weapons
	this.engine = engine
	this.physics_component = physics_system.get_component("ship", this)
	this.graphics_component = graphics_system.get_component("ship", this)
	this.collider_component = collision_system.get_component("circle", this)
	this.input_component = input_system.get_component("debug", this)
    }
    spawn_loot(world){
	var n_loot = 5
	var v_loot = 0.5
	for(var i = 0; i<n_loot; i++){
	    world.entities.push(new Loot(this.x, this.y, Math.random()*2*Math.PI, v_loot))
	}
    }
    update(world, dt){
	if(this.collider_component.is_colliding){
	    for(var collider of this.collider_component.colliding_with){
		switch(collider.entity.type){
		case "ship":
		case "bullet":
		    if(collider.entity.id && (collider.entity.id != this.id)){
			this.health -= dt
		    }
		    break
		case "loot":
		    this.size *= 1.05
		    this.health *= 1.05
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
	    this.spawn_loot(world)
	}
    }
}
