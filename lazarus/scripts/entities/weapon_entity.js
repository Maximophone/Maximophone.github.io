import { input_system } from '../systems/input_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { position_system } from '../systems/position_system.js'
import { Bullet } from './bullet_entity.js'

export class Weapon {
    constructor(ship, x, y, rot, ai=false){
	this.type = "weapon"
	//this.x = x
	//this.position.y = y
	//this.position.rot = rot
	this.parent = ship
	this.firing = false
	this.position = position_system.get_position(this, x, y, rot)
	if(!ai){
	    this.input_component = input_system.get_component("weapon", this)
	}
	this.graphics_component = graphics_system.get_component("weapon", this)
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
	if(this.firing){
	    if(this.timer <= 0){
		var projectile = new Bullet(
		    this.parent.id,
		    this.parent.position.x+this.parent.position.size*this.position.x*Math.cos(-this.parent.position.rot)+this.parent.position.size*this.position.y*Math.sin(-this.parent.position.rot), 
		    this.parent.position.y-this.parent.position.size*this.position.x*Math.sin(-this.parent.position.rot)+this.parent.position.size*this.position.y*Math.cos(-this.parent.position.rot),
		    this.parent.position.rot+this.position.rot, 
		    this.parent.v_dir+this.bullet_speed)
		world.entities.push(projectile)
		this.timer = this.firing_rate + this.timer
	    } else {
		this.timer -= dt
	    }
	}
    }
}
