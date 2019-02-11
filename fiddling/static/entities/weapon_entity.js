import { input_system } from '../systems/input_system.js'
import { graphics_system } from '../systems/graphics_system.js'
import { position_system } from '../systems/position_system.js'
import { Bullet } from './bullet_entity.js'
import { Missile } from './missile.js'

export class Weapon {
    constructor(ship, x, y, rot, ai=false, input="weapon"){
	this.type = "weapon"
	this.parent = ship
	this.firing = false
	this.position = position_system.get_position(this, x, y, rot, 0.20)
	if(!ai){
	    this.input_component = input_system.get_component(input, this)
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
	this.timer -= dt
	if(this.firing){
	    if(this.timer <= 0){
		var projectile = new Bullet(
		    this.parent.id,
		    this.parent.position.x+this.parent.position.size*this.position.x*Math.cos(-this.parent.position.rot)+this.parent.position.size*this.position.y*Math.sin(-this.parent.position.rot), 
		    this.parent.position.y-this.parent.position.size*this.position.x*Math.sin(-this.parent.position.rot)+this.parent.position.size*this.position.y*Math.cos(-this.parent.position.rot),
		    this.parent.position.rot+this.position.rot, 
		    this.parent.physics_component.v()+this.bullet_speed)
		    
		world.entities.push(projectile)
		this.timer = this.firing_rate// + this.timer
	    } 
	}
    }
}

export class MissileLauncher extends Weapon {
    constructor(ship, x, y, rot, firing_rate, missile_speed){
	super(ship, x, y, rot, false, "weapon_secondary")
	this.firing_rate = firing_rate
	this.missile_speed = 4
	this.timer = 0
    }
    update(world, dt){
	this.timer-=dt
	if(this.firing){
	    if(this.timer <= 0){
		var projectile = new Missile(
		    world,
		    this.parent.id,
		    this.parent.position.x+this.parent.position.size*this.position.x*Math.cos(-this.parent.position.rot)+this.parent.position.size*this.position.y*Math.sin(-this.parent.position.rot), 
		    this.parent.position.y-this.parent.position.size*this.position.x*Math.sin(-this.parent.position.rot)+this.parent.position.size*this.position.y*Math.cos(-this.parent.position.rot),
		    this.parent.position.rot+this.position.rot, 
		    this.parent.physics_component.v() + this.missile_speed)
		    
		world.entities.push(projectile)
		this.timer = this.firing_rate// + this.timer
	    }
	}
    }
}
		
