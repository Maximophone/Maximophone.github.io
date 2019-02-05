import { input_system } from '../systems/input_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { position_system } from '../systems/position_system.js'

export class Engine {
    constructor(ship, max_v, delta_v, delta_rot, ai=false){
	this.parent = ship
	this.type = "engine"
	this.max_v = max_v
	this.delta_v = delta_v
	this.delta_rot = delta_rot
	this.accelerate = false
	this.deccelerate = false
	this.target_angle = 0
	if(!ai){
	    this.input_component = input_system.get_component("engine", this)
	}
	this.graphics_component = graphics_system.get_component("engine", this)
	this.position = position_system.get_position(this, -1, 0, 0., 15);
    }
    update(world, dt){
    }
}
