export var vertex_shader = `
precision mediump float;
attribute vec2 vertPosition;
attribute vec2 vertColor;
uniform mat4 worldMat;
uniform mat4 viewMat;

varying vec3 fragColor;

void main(){
    fragColor = vertColor;
    gl_Position = viewMat * worldMat * vec4(vertPosition, 0.0, 1.0);
}
`


