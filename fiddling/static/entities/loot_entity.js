import { graphics_system } from '../systems/graphics_system.js'
import { physics_system } from '../systems/physics_system.js'
import { collision_system } from '../systems/collision_system.js'
import { position_system } from '../systems/position_system.js'

export class Loot {
    constructor(x, y, rot, v, v_rot, size=12){
	this.type = "loot"
	this.id = 3
	this.lifetime = 1000000+Math.random()*50000
	this.health = 1

	this.position = position_system.get_position(this, x, y, rot, size)
	this.graphics_component = graphics_system.get_component("loot", this)
	this.collider_component = collision_system.get_component("circle", this)
	this.physics_component = physics_system.get_component("bullet", this)
	this.physics_component.vx = v*Math.cos(rot)
	this.physics_component.vy = v*Math.sin(rot)
	this.physics_component.v_rot = v_rot
    }
    update(world, dt){
	this.lifetime -= dt
	if(this.health < 0){
	    this.lifetime = -1
	}
    }
}
