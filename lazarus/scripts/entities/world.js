import {Ship} from './ship_entity.js'
import {Engine} from './engine_entity.js'
import {Cannon} from './weapon_entity.js'
import {Shield} from './shield_entity.js'
import {collision_system} from '../systems/collision_system.js'
import {physics_system} from '../systems/physics_system.js'
import {ai_system} from '../systems/ai_system.js'
import {input_system} from '../systems/input_system.js'
import {graphics_system} from '../systems/graphics_system.js'
import {particles_pool} from '../systems/particles_system.js'
import {position_system} from '../systems/position_system.js'
import {garbage_filter, rotate} from '../utils.js'
import {camera} from './camera.js'
import {MousePointer} from './mouse_pointer_entity.js'
import {Map} from './map.js'
import {EnnemySpawner} from './spawner.js'
import {UserInputs} from '../user_inputs.js'

var PLAYER_HEALTH = 200

export class World {
    constructor(){
	this.map = new Map()
	this.entities = []

	var engine = new Engine(10, 0.01, 0.05)
	var player = new Ship(1, 100, 100, 0, 20, PLAYER_HEALTH, engine)
	var shield = new Shield(player, 3, 100, 0.01, 10000)
	var weapon1 = new Cannon(player, 1, 0.5, 0.05, 50, 5)
	var weapon2 = new Cannon(player, 1, -0.5, -0.05, 50, 5)
	player.weapons.push(weapon1, weapon2)
	player.shield = shield
	this.entities.push(player, engine, shield, weapon1, weapon2)

	this.ennemy_spawner = new EnnemySpawner(this, player, 20000)
	this.mouse_pointer = new MousePointer(this.camera)

	camera.set_target(player)
	
    }
    update(dt){
	this.ennemy_spawner.update(dt)
	position_system.update()
	input_system.update()
	collision_system.update()
	physics_system.update(dt)
	ai_system.update(dt)
	particles_pool.update(dt)
	for(var entity of this.entities){
	    if(entity.update){
		entity.update(this, dt)
	    }
	}
	garbage_filter(this.entities, item => item.lifetime<0)
	camera.update()
    }
    draw(context){
	graphics_system.draw(context) // careful, the map needs to be drawn first
    }
}
