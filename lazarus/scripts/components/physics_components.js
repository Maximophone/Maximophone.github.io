var V_FRICTION = 0.01
var V_FRICTION_ROT = 0.01

class PhysicsComponent {
    constructor(entity){
	this.entity = entity
    }
}

class BulletPhysicsComponent extends PhysicsComponent {
  update(dt){
    this.entity.position.x += this.entity.v_dir*Math.cos(this.entity.position.rot)
    this.entity.position.y += this.entity.v_dir*Math.sin(this.entity.position.rot)
    this.entity.position.rot += this.entity.v_rot
  }
}

class ShipPhysicsComponent extends PhysicsComponent {
  update(dt){
    if(this.entity.engine.accelerate){
      this.entity.v_dir = Math.min(this.entity.v_dir+dt*this.entity.engine.delta_v, this.entity.engine.max_v)
    } else if (this.entity.engine.deccelerate){
      this.entity.v_dir = Math.max(this.entity.v_dir-dt*this.entity.engine.delta_v, -this.entity.engine.max_v)
    } else {
      if(this.entity.v_dir > 0){
        this.entity.v_dir = Math.max(this.entity.v_dir-dt*V_FRICTION, 0)
      } else {
        this.entity.v_dir = Math.min(this.entity.v_dir+dt*V_FRICTION, 0)
      }
    }
    if(this.entity.engine.turn_acw){
      this.entity.v_rot = Math.min(this.entity.v_rot+dt*this.entity.engine.delta_v_rot, this.entity.engine.max_v_rot)
    } else if (this.entity.engine.turn_cw){
      this.entity.v_rot = Math.max(this.entity.v_rot-dt*this.entity.engine.delta_v_rot, -this.entity.engine.max_v_rot)
    } else {
      if(this.entity.v_rot > 0){
        this.entity.v_rot = Math.max(this.entity.v_rot-dt*V_FRICTION_ROT, 0)
      } else {
        this.entity.v_rot = Math.min(this.entity.v_rot+dt*V_FRICTION_ROT, 0)
      }
    }
    this.entity.position.x += this.entity.v_dir*Math.cos(this.entity.position.rot)
    this.entity.position.y += this.entity.v_dir*Math.sin(this.entity.position.rot)
    this.entity.position.rot += this.entity.v_rot
  }
}

export var physics_components = {
    bullet: BulletPhysicsComponent,
    ship: ShipPhysicsComponent
}
