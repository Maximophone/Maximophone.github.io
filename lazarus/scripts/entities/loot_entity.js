import { graphics_system } from '../systems/graphics_system.js'
import { physics_system } from '../systems/physics_system.js'
import { collision_system } from '../systems/collision_system.js'
import { position_system } from '../systems/position_system.js'

export class Loot {
    constructor(x, y, rot, v, size=3){
	this.type = "loot"
	// this.x = x
	// this.y = y
	// this.rot = rot
	this.v_dir = v
	this.v_rot = 0
	// this.size = size
	this.lifetime = 5000+Math.random()*5000

	this.position = position_system.get_position(this, x, y, rot, size)
	this.graphics_component = graphics_system.get_component("loot", this)
	this.collider_component = collision_system.get_component("circle", this)
	this.physics_component = physics_system.get_component("bullet", this)
    }
    update(world, dt){
	this.lifetime -= dt
    }
}
