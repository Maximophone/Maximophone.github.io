var V_FRICTION = 0.01
var V_FRICTION_ROT = 0.01

function cap_abs(x, abs_max){
    return Math.min(Math.max(x, -abs_max), abs_max)
}

class PhysicsComponent {
    constructor(entity){
	this.entity = entity
	this.vx = 0
	this.vy = 0
	this.v_rot = 0
    }
    v(){
	return Math.sqrt(this.vx**2 + this.vy**2)
    }
}

class BulletPhysicsComponent extends PhysicsComponent {
    update(dt){
	this.entity.position.x += this.vx
	this.entity.position.y += this.vy
	this.entity.position.rot += this.v_rot
    }
}

class ShipPhysicsComponent extends PhysicsComponent {
    update(dt){
	var engine = this.entity.engine
	var position = this.entity.position
	var cos = Math.cos(position.rot)
	var sin = Math.sin(position.rot)
	if(engine.accelerate){
	    this.vx = cap_abs(this.vx + dt*engine.delta_v*cos, Math.abs(engine.max_v*cos))
	    this.vy = cap_abs(this.vy + dt*engine.delta_v*sin, Math.abs(engine.max_v*sin))
	} else if (engine.deccelerate){
	    this.vx = cap_abs(this.vx - dt*engine.delta_v*cos, Math.abs(engine.max_v*cos))
	    this.vy = cap_abs(this.vy - dt*engine.delta_v*sin, Math.abs(engine.max_v*sin))
	} else {
	    // FRICTION
	    if(this.v() > 0){
		if(this.vx > 0){
		    this.vx = Math.max(this.vx-dt*V_FRICTION, 0)
		} else {
		    this.vx = Math.min(this.vx+dt*V_FRICTION, 0)
		}
		if(this.vy > 0){
		    this.vy = Math.max(this.vy-dt*V_FRICTION, 0)
		} else {
		    this.vy = Math.min(this.vy+dt*V_FRICTION, 0)
		}
	    }
	}
	if(position.rot != engine.target_angle){
	    var delta = engine.target_angle - position.rot
	    if(delta > Math.PI){
		delta -= Math.PI*2
	    }
	    if(delta < -Math.PI){
		delta += Math.PI*2
	    }
	    if(delta > 0){
		this.entity.position.rot  += engine.delta_rot
	    } else {
		this.entity.position.rot -= engine.delta_rot
	    }
	    if(Math.abs(delta) < engine.delta_rot){
	    	this.entity.position.rot = engine.target_angle
	    }
	}  
	 
	this.entity.position.x += this.vx
	this.entity.position.y += this.vy
    }
}

export var physics_components = {
    bullet: BulletPhysicsComponent,
    ship: ShipPhysicsComponent
}
