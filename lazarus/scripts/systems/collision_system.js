import { System } from './systems.js'
import { collider_components } from '../components/collider_components.js'
import { garbage_filter } from '../utils.js'

class CollisionSystem extends System {
    constructor(){
	super()
	this.components_dict = collider_components
    }
    update(){
	// clean up
	for(var collider of this.components){
	    collider.colliding_with = []
	    collider.is_colliding = false
	}
	this.garbage_collect()
	
	for(var i = 0; i<this.components.length; i++){
	    for(var j = i+1; j<this.components.length; j++){
		var collider1 = this.components[i]
		var collider2 = this.components[j]
		if(collider1.collides_with(collider2)){
		    collider1.is_colliding = true
		    collider2.is_colliding = true
		    collider1.colliding_with.push(collider2)
		    collider2.colliding_with.push(collider1)
		}
	    }
	}
    }
}

export var collision_system = new CollisionSystem()

