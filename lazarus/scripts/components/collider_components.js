import { distance } from '../utils.js'

export class ColliderComponent{
    constructor(entity){
	this.entity = entity
	this.active = true
	this.is_colliding = false
	this.colliding_with = []
    }
}

export class CircleColliderComponent extends ColliderComponent {
    constructor(entity, r=1){
	super(entity)
	this.radius = r
	this.type = "circle"
    }
    collides_with(collider){
	if(!this.active){
	    return false
	}
	switch(collider.type){
	case "circle":
	    var pos_this = this.entity.position.get_absolute_pos()
	    var pos_other = collider.entity.position.get_absolute_pos()
	    return distance(pos_this, pos_other) < pos_this.size*this.radius + pos_other.size*collider.radius
            break
	}
    }
}

export var collider_components = {
    circle: CircleColliderComponent
}
