import { System } from './systems.js'
import { physics_components } from '../components/physics_components.js'

class PhysicsSystem extends System {
    constructor(){
	super()
	this.components_dict = physics_components
    }
    update(dt){
	this.garbage_collect()
	for(var component of this.components){
	    component.update(dt)
	}
    }
}

export var physics_system = new PhysicsSystem()
