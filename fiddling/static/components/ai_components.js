import { angle_to, distance } from '../utils.js'
import { UserInputs } from '../user_inputs.js'


function track(pos, target_pos, turn_rate, speed){
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
	    pos.rot += turn_rate
	} else {
	    pos.rot -= turn_rate
	}
	if(Math.abs(delta) < turn_rate){
	    pos.rot = target_angle
	}
    }
    pos.x += speed*Math.cos(pos.rot)
    pos.y += speed*Math.sin(pos.rot)
}

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
	track(pos, target_pos, TURN_RATE, SPEED)
	// var target_angle = angle_to(pos, target_pos)
	// if(pos.rot != target_angle){
	//     var delta = target_angle - pos.rot
	//     if(delta > Math.PI){
	// 	delta -= Math.PI*2
	//     }
	//     if(delta < -Math.PI){
	// 	delta += Math.PI*2
	//     }
	//     if(delta > 0){
	// 	pos.rot += TURN_RATE
	//     } else {
	// 	pos.rot -= TURN_RATE
	//     }
	//     if(Math.abs(delta) < TURN_RATE){
	// 	pos.rot = target_angle
	//     }
	// }
	if(distance(pos, target_pos)< 500){
	    for(var weapon of this.entity.weapons){
		weapon.firing = true
	    }
	}
	// pos.x += SPEED*Math.cos(pos.rot)
	// pos.y += SPEED*Math.sin(pos.rot)
    }
}


class MissileAIComponent extends AIComponent {
    update(){
	var SPEED = 10.
	var TURN_RATE = 0.15
	var pos = this.entity.position
	var target_pos = UserInputs.get_mouse_target()
	track(pos, target_pos, TURN_RATE, SPEED)
    }
}
    
export var ai_components = {
    ship: ShipAIComponent,
    missile: MissileAIComponent
}
