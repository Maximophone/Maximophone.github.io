import { World } from './entities/world.js'

var GameState = {
    MAIN_MENU: 0,
    PLAY: 1,
    GAME_MENU: 2
}

export class Game {
    constructor(context){
	this.context = context
	this.world = new World()
	this.state = GameState.PLAY
    }
    update(dt){
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
