import { System } from './systems.js'
import { PositionComponent } from '../components/position_component.js'

class PositionSystem extends System {
    get_position(entity, x, y, rot=0, size=1){
	var component = new PositionComponent(entity, x, y, rot, size)
	this.components.push(component)
	return component
    }
    update(){
	this.garbage_collect()
    }
}

export var position_system = new PositionSystem()
