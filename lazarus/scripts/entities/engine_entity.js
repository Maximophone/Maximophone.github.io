import { input_system } from '../systems/input_system.js'

export class Engine {
    constructor(max_v, delta_v, max_v_rot, delta_v_rot, ai=false){
	this.type = "engine"
	this.max_v = max_v
	this.delta_v = delta_v
	this.max_v_rot = max_v_rot
	this.delta_v_rot = delta_v_rot
	this.accelerate = false
	this.deccelerate = false
	this.turn_cw = false
	this.turn_acs = false
	if(!ai){
	    this.input_component = input_system.get_component("engine", this)
	}
    }
    update(world, dt){
    }
}
