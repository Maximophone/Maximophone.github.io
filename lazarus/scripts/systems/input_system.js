import { System } from './systems.js'
import { input_components } from '../components/input_components.js'

class InputSystem extends System {
    constructor(){
	super()
	this.components_dict = input_components
    }
    update(){
	this.garbage_collect()
	for(var component of this.components){
	    component.update()
	}
    }
}

export var input_system = new InputSystem()	    
