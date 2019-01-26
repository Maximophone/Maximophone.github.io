import { UserInputs, KeyCodes, GameKeys } from '../user_inputs.js'

class InputComponent {
    constructor(entity){
	this.entity = entity
    }
}

export class AIInputComponent extends InputComponent {
    update(){
	
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
	if(UserInputs.pressed_key(GameKeys.TURN_CW)){
	    this.entity.turn_cw = true
	    this.entity.turn_acw = false
	} else if(UserInputs.pressed_key(GameKeys.TURN_ACW)){
	    this.entity.turn_cw = false
	    this.entity.turn_acw = true
	} else {
	    this.entity.turn_cw = false
	    this.entity.turn_acw = false
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
    debug: PlayerInputDebugComponent
}
