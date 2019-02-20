import { gl } from "../gl.js"
import { createShader } from "../webgl_utils.js"
import { default_shader } from "./fragment/default.js"
import { light_shader } from "./fragment/light.js"
import { map_shader } from "./fragment/map_2.js"
import { react_shader } from "./fragment/react.js"
import { explosion_shader } from "./fragment/explosion.js"
import { laser_shader } from "./fragment/laser.js"


export var fragment_shaders = {
    default: createShader(gl, default_shader, gl.FRAGMENT_SHADER),
    map: createShader(gl, map_shader, gl.FRAGMENT_SHADER),
    light: createShader(gl, light_shader, gl.FRAGMENT_SHADER),
    react: createShader(gl, react_shader, gl.FRAGMENT_SHADER),
    explosion: createShader(gl, explosion_shader, gl.FRAGMENT_SHADER),
    laser_beam: createShader(gl, laser_shader, gl.FRAGMENT_SHADER)
}
