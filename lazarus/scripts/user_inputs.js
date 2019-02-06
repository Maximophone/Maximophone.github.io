import { c } from "./index.js"
import {camera} from './entities/camera.js'

var _pressed_keys = []
var _mouse_target = {
    x: null,
    y: null
}

export class UserInputs {
    static pressed_keys(){return _pressed_keys}
    static pressed_key(k){return Boolean(_pressed_keys[k])}
    static press_key(k){
	_pressed_keys[k.keyCode] = true
    }
    static release_key(k){
	_pressed_keys[k.keyCode] = false
    }
    static move_mouse(e){
	_mouse_target.x = 2*e.offsetX/c.width - 1.
	_mouse_target.y = -2*e.offsetY/c.height + 1.// Negative because we invert the canvas y
    }
    static get_mouse_target(with_camera=true){
	if(with_camera){
	    return {
		x: _mouse_target.x*camera.size + camera.x,
		y: _mouse_target.y*camera.size + camera.y
	    }
	} else {
	    return _mouse_target
	}
    }
}

addEventListener("keydown", UserInputs.press_key, false);
addEventListener("keyup", UserInputs.release_key, true);
addEventListener("mousemove", UserInputs.move_mouse, true);

export var KeyCodes = Object.freeze({
    SPACE: 32,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    E: 69,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
})

export var GameKeys = Object.freeze({
    FIRE: KeyCodes.SPACE,
    FIRE_2: KeyCodes.E,
    ACCELERATE: KeyCodes.W,
    DECCELERATE: KeyCodes.S,
    TURN_CW: KeyCodes.A,
    TURN_ACW: KeyCodes.D,
    UP: KeyCodes.W,
    DOWN: KeyCodes.S,
    RIGHT: KeyCodes.D,
    LEFT: KeyCodes.A,
    ZOOM_IN: KeyCodes.UP,
    ZOOM_OUT: KeyCodes.DOWN
})
