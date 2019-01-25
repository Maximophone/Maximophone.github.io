import { UserInputs, GameKeys } from '../user_inputs.js'

export class Camera{
    constructor(x, y, scale, target){
	this.x = x
	this.y = y
	this.scale = scale
	this.target = target
    }
    update(dt){
	
	if(UserInputs.pressed_key(GameKeys.ZOOM_IN)){
	    this.scale*=0.99
	} else if(UserInputs.pressed_key(GameKeys.ZOOM_OUT)){
	    this.scale*=1.01
	}
	var epsilon = 0.01
	if(this.scale<this.target.size/20-epsilon){
	    this.scale+=epsilon
	}
	else if (this.scale>this.target.size/20+epsilon){
	    this.scale-=epsilon
	}
	//this.scale = this.target.size/20
	this.x = this.target.x - c.width/2*this.scale
	this.y = this.target.y - c.height/2*this.scale
    }
}
