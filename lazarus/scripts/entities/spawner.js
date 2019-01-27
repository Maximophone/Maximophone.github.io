import { Engine } from './engine_entity.js'
import { Ship } from './ship_entity.js'
import { Cannon } from './weapon_entity.js'

var ENNEMY_HEALTH = 50
var SPAWN_DIST = 800

export class EnnemySpawner {
    constructor(world, player, spawn_interval){
	this.world = world
	this.player = player
	this.spawn_interval = spawn_interval
	this.timeleft = 0
	this.intensity = 0
    }
    spawn(n){
	for(var i=0; i<n; i++){
	    var angle = Math.random()*Math.PI*2
	    var x = this.player.position.x + SPAWN_DIST*Math.cos(angle)
	    var y = this.player.position.y + SPAWN_DIST*Math.sin(angle)
	    var engine = new Engine(10, 0.01, 0.05, 0.01, true)
	    var ai = new Ship(2, x, y, 0, 17, ENNEMY_HEALTH, engine, [], true, this.player)
	    var cannon = new Cannon(ai, 1, 0, 0, 200, 5, true)
	    ai.weapons.push(cannon)
	    this.world.entities.push(ai, engine, cannon)
	}
    }
    update(dt){
	this.timeleft -= dt
	if(this.timeleft<0 && this.player.health>0){
	    this.timeleft = this.spawn_interval
	    this.intensity += 1
	    this.spawn(this.intensity)
	}
    }
}
