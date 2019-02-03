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
	var SPEED = 2.5
	var TURN_RATE = 0.04
	var pos = this.entity.position
	var target_pos = this.target.position
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
	if(distance(pos, target_pos)< 500){
	    for(var weapon of this.entity.weapons){
		weapon.firing = true
	    }
	}
	pos.x += SPEED*Math.cos(pos.rot)
	pos.y += SPEED*Math.sin(pos.rot)
    }
}

    
export var ai_components = {
    ship: ShipAIComponent
}
