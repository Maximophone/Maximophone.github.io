import { input_system } from '../systems/input_system.js'

export class Engine {
    constructor(max_v, delta_v, delta_rot, ai=false){
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
    }
    update(world, dt){
    }
}
