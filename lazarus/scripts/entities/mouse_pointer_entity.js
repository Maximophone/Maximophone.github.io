import { graphics_system } from '../systems/graphics_system.js'
import { position_system } from '../systems/position_system.js'
import { input_system } from '../systems/input_system.js'

export class MousePointer {
    constructor(camera){
	this.camera = camera
	this.graphics_component = graphics_system.get_component("pointer", this)
	this.position = position_system.get_position(this, 0, 0, 0, 5)
	this.input_component = input_system.get_component("mouse", this)
    }
}
