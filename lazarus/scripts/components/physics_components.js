var V_FRICTION = 0.01
var V_FRICTION_ROT = 0.01

export class PhysicsComponent {
  update(obj, world, dt){
    obj.x += obj.v_dir*Math.cos(obj.rot)
    obj.y += obj.v_dir*Math.sin(obj.rot)
    obj.rot += obj.v_rot
  }
}

export class ShipPhysicsComponent {
  update(ship, world, dt){
    if(ship.engine.accelerate){
      ship.v_dir = Math.min(ship.v_dir+dt*ship.engine.delta_v, ship.engine.max_v)
    } else if (ship.engine.deccelerate){
      ship.v_dir = Math.max(ship.v_dir-dt*ship.engine.delta_v, -ship.engine.max_v)
    } else {
      if(ship.v_dir > 0){
        ship.v_dir = Math.max(ship.v_dir-dt*V_FRICTION, 0)
      } else {
        ship.v_dir = Math.min(ship.v_dir+dt*V_FRICTION, 0)
      }
    }
    if(ship.engine.turn_acw){
      ship.v_rot = Math.min(ship.v_rot+dt*ship.engine.delta_v_rot, ship.engine.max_v_rot)
    } else if (ship.engine.turn_cw){
      ship.v_rot = Math.max(ship.v_rot-dt*ship.engine.delta_v_rot, -ship.engine.max_v_rot)
    } else {
      if(ship.v_rot > 0){
        ship.v_rot = Math.max(ship.v_rot-dt*V_FRICTION_ROT, 0)
      } else {
        ship.v_rot = Math.min(ship.v_rot+dt*V_FRICTION_ROT, 0)
      }
    }
    ship.x += ship.v_dir*Math.cos(ship.rot)
    ship.y += ship.v_dir*Math.sin(ship.rot)
    ship.rot += ship.v_rot
  }
}
