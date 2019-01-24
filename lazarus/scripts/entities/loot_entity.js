import { LootGraphicsComponent } from '../components/graphics_components.js'
import { PhysicsComponent } from '../components/physics_components.js'
import { collision_system } from '../systems/collision_system.js'

export class Loot {
  constructor(x, y, rot, v, size=3){
    this.type = "loot"
    this.x = x
    this.y = y
    this.rot = rot
    this.v_dir = v
    this.v_rot = 0
    this.size = size
    this.lifetime = 5000+Math.random()*5000
    
    this.graphics_component = new LootGraphicsComponent()
    this.collider_component = collision_system.get_circle_collider(this, 1)
    this.physics_component = new PhysicsComponent()
  }
  update(world, dt){
    this.physics_component.update(this, world, dt)
    this.lifetime -= dt
  }
}
