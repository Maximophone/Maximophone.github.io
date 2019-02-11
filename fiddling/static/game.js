import { World } from './entities/world.js'

var GameState = {
    MAIN_MENU: 0,
    PLAY: 1,
    GAME_MENU: 2
}

var last_dt = []

function fps(dt){
    var N = 100
    last_dt.push(dt)
    if(last_dt.length >= N){
	var mean_dt = 0
	for(var dt of last_dt){
	    mean_dt += dt
	}
	mean_dt /= N
	console.log("FPS: ",1000/dt)
	last_dt = []
    }
}
	
    

export class Game {
    constructor(context){
	this.context = context
	this.world = new World()
	this.state = GameState.PLAY
    }
    update(dt){
	fps(dt)
	switch(this.state){
	case GameState.MAIN_MENU:
	case GameState.GAME_MENU:
	    break
	case GameState.PLAY:
	    this.world.update(dt)
	    break
	}
    }
    draw(){
	switch(this.state){
	case GameState.MAIN_MENU:
	    break
	case GameState.GAME_MENU:
	    break
	case GameState.PLAY:
	    this.world.draw(this.context)
	    break
	}
    }		
}
