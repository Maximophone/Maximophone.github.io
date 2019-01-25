import { garbage_filter } from '../utils.js'
import { physics_components } from '../components/physics_components.js'

class PhysicsSystem {
    constructor(){
	this.components = []
    }
    get_component(type, entity){
	var component = new physics_components[type](entity)
	this.components.push(component)
	return component
    }
    update(dt){
	garbage_filter(this.components, component => component.entity.lifetime<=0)
	for(var component of this.components){
	    component.update(dt)
	}
    }
}

export var physics_system = new PhysicsSystem()
