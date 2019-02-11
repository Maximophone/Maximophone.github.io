import { garbage_filter } from '../utils.js'

export class System {
    constructor(){
	this.components = []
	this.components_dict = null
    }
    get_component(type, entity){
	var component = new this.components_dict[type](entity)
	this.components.push(component)
	return component
    }
    garbage_collect(){
	garbage_filter(this.components, component => component.entity.lifetime <= 0)
    }
}
	
