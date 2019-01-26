import { angle_to, distance } from '../utils.js'

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
	var TURN_RATE = 0.04
	var pos = this.entity.position
	var target_pos = this.target.position
	pos.x += 0.5*Math.sign(target_pos.x-pos.x)
	pos.y += 0.5*Math.sign(target_pos.y-pos.y)
	var target_angle = angle_to(pos, target_pos)
	if(pos.rot != target_angle){
	    var delta = target_angle - pos.rot
	    if(delta > Math.PI){
		delta -= Math.PI*2
	    }
	    if(delta < -Math.PI){
		delta += Math.PI*2
	    }
	    if(delta > 0){
		pos.rot += TURN_RATE
	    } else {
		pos.rot -= TURN_RATE
	    }
	    if(Math.abs(delta) < TURN_RATE){
		pos.rot = target_angle
	    }
	}
// 	pos.rot += 0.01*Math.sign(pos.rot - angle_to(pos, target.pos))
	if(distance(pos, target_pos)< 500){
	    for(var weapon of this.entity.weapons){
		weapon.firing = true
	    }
	}
    }
}

    
export var ai_components = {
    ship: ShipAIComponent
}
