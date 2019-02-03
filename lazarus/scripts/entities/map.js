import { graphics_system } from '../systems/graphics_system.js'
import { position_system } from '../systems/position_system.js'

export class Map {
    constructor(){
	// this.x = 0
	// this.y = 0
	// this.rot = 0
	this.position = position_system.get_position(this, 0, 0, 0, 100)
	this.graphics_component = graphics_system.get_component("map", this)
    }
}
