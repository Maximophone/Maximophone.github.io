var _pressed_keys = []

export class UserInputs {
    static pressed_keys(){return _pressed_keys}
    static pressed_key(k){return Boolean(_pressed_keys[k])}
    static press_key(k){
	_pressed_keys[k.keyCode] = true
    }
    static release_key(k){
	_pressed_keys[k.keyCode] = false
    }
}

addEventListener("keydown", UserInputs.press_key, false);
addEventListener("keyup", UserInputs.release_key, true);

export var KeyCodes = Object.freeze({
    SPACE: 32,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
})

export var GameKeys = Object.freeze({
    FIRE: KeyCodes.SPACE,
    ACCELERATE: KeyCodes.W,
    DECCELERATE: KeyCodes.S,
    TURN_CW: KeyCodes.D,
    TURN_ACW: KeyCodes.A,
    ZOOM_IN: KeyCodes.UP,
    ZOOM_OUT: KeyCodes.DOWN
})
