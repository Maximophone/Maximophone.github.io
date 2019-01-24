import { UserInputs, KeyCodes, GameKeys } from '../user_inputs.js'

class InputComponent {
}

export class AIInputComponent extends InputComponent {
  constructor(){
    super()
  }
  update(ship, world, dt){
    
  }
}

export class PlayerInputEngineComponent extends InputComponent {
  update(engine, world, dt){
    if(UserInputs.pressed_key(GameKeys.ACCELERATE)){
      engine.accelerate = true
      engine.deccelerate = false
    } else if (UserInputs.pressed_key(GameKeys.DECCELERATE)){
      engine.deccelerate = true
      engine.accelerate = false
    } else {
      engine.accelerate = false
      engine.deccelerate = false
    }
    if(UserInputs.pressed_key(GameKeys.TURN_CW)){
      engine.turn_cw = true
      engine.turn_acw = false
    } else if(UserInputs.pressed_key(GameKeys.TURN_ACW)){
      engine.turn_cw = false
      engine.turn_acw = true
    } else {
      engine.turn_cw = false
      engine.turn_acw = false
    }
    
  }
}

export class PlayerInputWeaponComponent extends InputComponent {
  update(weapon, world, dt){
    if(UserInputs.pressed_key(GameKeys.FIRE)){
      weapon.firing = true
    } else {
      weapon.firing = false
    }
  }
}

export class PlayerInputDebugComponent extends InputComponent {
  update(ship, world, dt){
    if(UserInputs.pressed_key(KeyCodes.LEFT)){
      ship.size*=1.1
    }
    if(UserInputs.pressed_key(KeyCodes.RIGHT)){
      ship.size*=0.9
    }
  }
}
