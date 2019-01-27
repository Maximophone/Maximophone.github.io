import { UserInputs, KeyCodes, GameKeys } from '../user_inputs.js'
import { angle_to } from '../utils.js'

class InputComponent {
    constructor(entity){
	this.entity = entity
    }
}

export class AIInputComponent extends InputComponent {
    update(){
	
    }
}

export class MouseInputComponent extends InputComponent {
    update(){
	var mouse_target = UserInputs.get_mouse_target(true)
	this.entity.position.x = mouse_target.x
	this.entity.position.y = mouse_target.y
    }
}

class PlayerInputShipComponent extends InputComponent {
    update(){
	var mouse_target = UserInputs.get_mouse_target(true)
	this.entity.engine.target_angle = angle_to(this.entity.position, mouse_target)
    }
}

export class PlayerInputEngineComponent extends InputComponent {
    update(){
	if(UserInputs.pressed_key(GameKeys.ACCELERATE)){
	    this.entity.accelerate = true
	    this.entity.deccelerate = false
	} else if (UserInputs.pressed_key(GameKeys.DECCELERATE)){
	    this.entity.deccelerate = true
	    this.entity.accelerate = false
	} else {
	    this.entity.accelerate = false
	    this.entity.deccelerate = false
	}	
    }
}

export class PlayerInputWeaponComponent extends InputComponent {
    update(){
	if(UserInputs.pressed_key(GameKeys.FIRE)){
	    this.entity.firing = true
	} else {
	    this.entity.firing = false
	}
    }
}

export class PlayerInputDebugComponent extends InputComponent {
    update(){
	if(UserInputs.pressed_key(KeyCodes.LEFT)){
	    this.entity.position.size*=1.1
	}
	if(UserInputs.pressed_key(KeyCodes.RIGHT)){
	    this.entity.position.size*=0.9
	}
    }
}

export var input_components = {
    ai: AIInputComponent,
    engine: PlayerInputEngineComponent,
    weapon: PlayerInputWeaponComponent,
    ship: PlayerInputShipComponent,
    mouse: MouseInputComponent,
    debug: PlayerInputDebugComponent
}
