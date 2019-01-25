import { graphics_system } from '../systems/graphics_system.js'


export class Map {
    constructor(){
	this.x = 0
	this.y = 0
	this.rot = 0
	this.graphics_component = graphics_system.get_component("map", this)
    }
}
