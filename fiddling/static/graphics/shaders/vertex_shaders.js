import { gl } from "../gl.js"
import { createShader } from "../webgl_utils.js"

var vertex_shader = `
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
uniform mat4 worldMat;
uniform mat4 viewMat;

varying vec4 worldPosition;
varying vec4 viewPosition;
varying vec2 vertPos;

void main(){
    vertPos = vertPosition;
    worldPosition = worldMat * vec4(vertPosition, 0., 1.);
    viewPosition = viewMat * worldPosition;
    gl_Position = viewPosition;
}
`

var static_shader = `
precision mediump float;
attribute vec2 vertPosition;
uniform mat4 worldMat;
uniform mat4 viewMat;

varying vec4 worldPosition;
varying vec4 viewPosition;
varying vec4 expPosition;

void main(){
    vec4 screenPosition = vec4(vertPosition, 0., 1.);
    worldPosition = worldMat * screenPosition;
    viewPosition = viewMat * worldPosition;
    mat4 expMat = mat4(viewMat);
    //expMat[0][0] = 1./expMat[0][0];
    //expMat[1][1] = 1./expMat[1][1];
    expMat[0][0] = 1.;
    expMat[1][1] = 1.;
    expMat[3][0] = -expMat[3][0];
    expMat[3][1] = -expMat[3][1];
    expPosition = expMat * screenPosition;
    gl_Position = screenPosition;
}
`

export var vertex_shaders = {
    default: createShader(gl, vertex_shader, gl.VERTEX_SHADER),
    static: createShader(gl, static_shader, gl.VERTEX_SHADER)
}
