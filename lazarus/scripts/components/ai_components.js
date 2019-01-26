class AIComponent {
    constructor(entity){
	this.entity = entity
    }
}

class ShipAIComponent extends AIComponent {
    constructor(entity, target){
	super(entity)
	this.target = target
    }
    update(){
	this.entity.x += 0.5*Math.sign(this.target.x-this.entity.x)
	this.entity.y += 0.5*Math.sign(this.target.y-this.entity.y)
    }
}

    
export var ai_components = {
    ship: ShipAIComponent
}
