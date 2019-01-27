import { collision_system } from '../systems/collision_system.js'
import { position_system } from '../systems/position_system.js'
import { graphics_system } from '../systems/graphics_system.js'

export class Shield {
    constructor(ship, size, health, regen_rate=0, downtime=1000){
	this.parent = ship
	this.id = ship.id
	this.health = health
	this.max_health = health
	this.regen_rate = regen_rate
	this.downtime = downtime
	this.downtime_left = downtime
	this.position = position_system.get_position(this, 0, 0, 0, size)
	this.collider_component = collision_system.get_component("circle", this)
	this.graphics_component = graphics_system.get_component("shield", this)
    }
    update(world, dt){
	if(this.health <= 0){
	    if(this.downtime_left<=0){
		this.collider_component.active = true
		this.health = 1
		this.downtime_left = this.downtime}
	    else {
		this.collider_component.active = false
		this.downtime_left -= dt
	    }
	} else {
	    this.health = Math.min(this.max_health, this.health + this.regen_rate*dt)
	}
    }
}
