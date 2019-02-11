import { System } from './systems.js'
import { ai_components } from '../components/ai_components.js'

class AISystem extends System {
    constructor(){
	super()
	this.components_dict = ai_components
    }
    get_component(type, entity, target){
	var component = new this.components_dict[type](entity, target)
	this.components.push(component)
	return component
    }
    update(dt){
	this.garbage_collect()
	for(var component of this.components){
	    component.update(dt)
	}
    }
}

export var ai_system = new AISystem()
