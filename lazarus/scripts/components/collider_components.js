export class ColliderComponent{
    constructor(entity){
	this.entity = entity
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
	switch(collider.type){
	case "circle":
            // TODO: careful, only works for entities with no parent ATM
            return Math.sqrt((this.entity.x-collider.entity.x)**2 + (this.entity.y-collider.entity.y)**2) < this.entity.size*this.radius + collider.entity.size*collider.radius
            break
	}
    }
}

export var collider_components = {
    circle: CircleColliderComponent
}
