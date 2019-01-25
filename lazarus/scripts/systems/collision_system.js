import { CircleColliderComponent } from '../components/collider_components.js'
import { garbage_filter } from '../utils.js'

class CollisionSystem{
    constructor(){
	this.colliders = []
    }
    get_circle_collider(entity, r){
	var circle_collider = new CircleColliderComponent(entity, r)
	this.colliders.push(circle_collider)
	return circle_collider
    }
    update(){
	// clean up
	for(var collider of this.colliders){
	    collider.colliding_with = []
	    collider.is_colliding = false
	}
	garbage_filter(this.colliders, item => item.entity.lifetime < 0)
	
	for(var i = 0; i<this.colliders.length; i++){
	    for(var j = i+1; j<this.colliders.length; j++){
		var collider1 = this.colliders[i]
		var collider2 = this.colliders[j]
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

