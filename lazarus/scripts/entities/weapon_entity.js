import { PlayerInputWeaponComponent, AIInputComponent } from '../components/input_components.js'
import { WeaponGraphicsComponent } from '../components/graphics_components.js'
import { Bullet } from './bullet_entity.js'

export class Weapon {
  constructor(ship, x, y, rot, ai=false){
    this.type = "weapon"
    this.x = x
    this.y = y
    this.rot = rot
    this.parent = ship
    this.firing = false
    if(!ai){
      this.input_component = new PlayerInputWeaponComponent()
    } else {
      this.input_component = new AIInputComponent()
    }
    this.graphics_component = new WeaponGraphicsComponent()
  }
}

export class Cannon extends Weapon {
  constructor(ship, x, y, rot, firing_rate, bullet_speed, ai=false){
    super(ship, x, y, rot, ai)
    this.firing_rate = firing_rate
    this.bullet_speed = bullet_speed
    this.timer = 0
  }
  update(world, dt){
    this.input_component.update(this, world, dt)
    if(this.firing){
      if(this.timer <= 0){
        var projectile = new Bullet(
          this.parent.id,
          this.parent.x+this.parent.size*this.x*Math.cos(-this.parent.rot)+this.parent.size*this.y*Math.sin(-this.parent.rot), 
          this.parent.y-this.parent.size*this.x*Math.sin(-this.parent.rot)+this.parent.size*this.y*Math.cos(-this.parent.rot),
          this.parent.rot+this.rot, 
          this.parent.v_dir+this.bullet_speed)
        world.entities.push(projectile)
        this.timer = this.firing_rate + this.timer
      } else {
        this.timer -= dt
      }
    }
  }
}
