import { MapGraphicsComponent } from '../components/graphics_components.js'


export class Map {
    constructor(){
	this.x = 0
	this.y = 0
	this.rot = 0
	this.graphics_component = new MapGraphicsComponent()
    }
}
