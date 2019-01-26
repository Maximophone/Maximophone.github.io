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
	var pos = this.entity.position
	var target_pos = this.target.position
	pos.x += 0.5*Math.sign(target_pos.x-pos.x)
	pos.y += 0.5*Math.sign(target_pos.y-pos.y)
    }
}

    
export var ai_components = {
    ship: ShipAIComponent
}
