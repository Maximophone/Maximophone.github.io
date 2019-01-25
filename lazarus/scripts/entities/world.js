import {Ship} from './ship_entity.js'
import {Engine} from './engine_entity.js'
import {Cannon} from './weapon_entity.js'
import {collision_system} from '../systems/collision_system.js'
import {physics_system} from '../systems/physics_system.js'
import {input_system} from '../systems/input_system.js'
import {garbage_filter, rotate} from '../utils.js'
import {Camera} from './camera.js'
import {Map} from './map.js'

export class World {
    constructor(context){
	this.context = context
	this.map = new Map()
	this.entities = []
	
	var engine = new Engine(10, 0.01, 0.05, 0.01)
	var player = new Ship(1, 100, 100, 0, 20, engine)
	var weapon1 = new Cannon(player, 1, 0.5, 0.1, 50, 5)
	var weapon2 = new Cannon(player, 1, -0.5, -0.1, 50, 5)
	player.weapons.push(weapon1, weapon2)
	this.entities.push(player, engine, weapon1, weapon2)
	
	for(var i = 0; i<10; i++){
	    var x = Math.random()*1000
	    var y = Math.random()*1000
	    var engine = new Engine(10, 0.01, 0.05, 0.01, true)
	    var ai = new Ship(2, x, y, 0, 17, engine, [])
	    var cannon = new Cannon(ai, 1, 0, 0, 50, 5, true)
	    ai.weapons.push(cannon)
	    this.entities.push(ai, engine, cannon)
	}
	this.camera = new Camera(0, 0, 1.5, player)
    }
    update(dt){
	input_system.update()
	collision_system.update()
	physics_system.update(dt)
	for(var entity of this.entities){
	    if(entity.update){
		entity.update(this, dt)
	    }
	}
	garbage_filter(this.entities, item => item.lifetime<0)
	this.camera.update()
    }
    draw(){
	this.context.clearRect(0, 0, c.width, c.height);
	this.draw_entity(this.map)
	for(var entity of this.entities){
	    this.draw_entity(entity)
	}
    }
    draw_entity(entity){
	if(entity.graphics_component){
	    var parents_chain = [entity]
	    while(entity.parent){
		entity = entity.parent
		parents_chain.push(entity)
	    }
	    this.context.transform(1/this.camera.scale, 0, 0, 1/this.camera.scale, 0, 0)
	    this.context.transform(1, 0, 0, 1, -this.camera.x, -this.camera.y)
	    for(var entity of parents_chain.reverse()){
		this.context.transform(1, 0, 0, 1, entity.x, entity.y)
		rotate(this.context, entity.rot)
		var size = entity.size || 1
		this.context.transform(size, 0, 0, size, 0, 0)
	    }
	    entity.graphics_component.draw(entity, this.context)
	    for(var entity of parents_chain.reverse()){
		var size = entity.size || 1
		this.context.transform(1/size, 0, 0, 1/size, 0, 0)
		rotate(this.context, -entity.rot)
		this.context.transform(1, 0, 0, 1, -entity.x, -entity.y)
	    }
	    this.context.transform(1, 0, 0, 1, this.camera.x, this.camera.y)
	    this.context.transform(this.camera.scale, 0, 0, this.camera.scale, 0, 0)
	}
    }
}
