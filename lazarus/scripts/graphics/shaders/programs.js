import { gl } from "../gl.js"
import { createProgram } from "../webgl_utils.js"
import { vertex_shaders } from "./vertex_shaders.js"
import { fragment_shaders } from "./fragment_shaders.js"

var program_default = createProgram(gl, vertex_shaders.default, fragment_shaders.default)
var program_map = createProgram(gl, vertex_shaders.static, fragment_shaders.map)
var program_light = createProgram(gl, vertex_shaders.default, fragment_shaders.light)
var program_react = createProgram(gl, vertex_shaders.default, fragment_shaders.react)

export var programs = {
    default: program_default,
    map: program_map,
    light: program_light,
    react: program_react
}
