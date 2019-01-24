import { PlayerInputEngineComponent, AIInputComponent } from '../components/input_components.js'

export class Engine {
  constructor(max_v, delta_v, max_v_rot, delta_v_rot, ai=false){
    this.type = "engine"
    this.max_v = max_v
    this.delta_v = delta_v
    this.max_v_rot = max_v_rot
    this.delta_v_rot = delta_v_rot
    if(!ai){
      this.input_component = new PlayerInputEngineComponent()
    } else {
      this.input_component = new AIInputComponent()
    }
  }
  update(world, dt){
    this.input_component.update(this, world, dt)
  }
}
