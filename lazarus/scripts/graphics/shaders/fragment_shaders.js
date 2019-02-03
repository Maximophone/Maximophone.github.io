import { gl } from "../gl.js"
import { createShader } from "../webgl_utils.js"

var fragment_shader = `
precision mediump float;

uniform vec4 color;

void main(){
    gl_FragColor = color;
}
`

var shader_map = `
precision mediump float;
uniform float u_time;
uniform mat4 viewMat;
varying vec4 worldPosition;
varying vec4 viewPosition;
varying vec4 expPosition;

float flare(vec2 U){
    vec2 A = sin(vec2(0, 1.57));
    U = abs( U * mat2(A, -A.y, A.x)) * mat2(2, 0, 1, 1.7);
    return .02/max(U.x, U.y);
    // return .5*pow(max(U.x, U.y), -0.9);
}

#define r(x)     fract(1e4*sin((x)*541.17))
#define sr2(x)   ( r(vec2(x,x+.1)) *2.-1. )
#define sr3(x)   ( r(vec4(x,x+.1,x+.2,0)) *2.-1. )
#define GRID_SPACE 0.2
#define GRID_WIDTH 0.005

void mainImage( out vec4 O, vec2 U )
{
    vec2 R = vec2(1000.0,800.0);
    vec2 buffer = vec2(0., 0.);
    U =  (U+U - R) / R.y;
    O -= O+.3;
    for (float i=0.; i<50.; i++)
    {
        buffer = U - sr2(i)*R/R.y;
        if(max(buffer.x, buffer.y) > 0.2) continue; // For performance, discard
        O += flare (U - sr2(i)*R/R.y )           // rotating flare at random location
              * r(i+.2)                          // random scale
              * (1.+.5*sin(r(i+.3)*3.*u_time))  // time pulse
            //* (1.+.1*sr3(i+.4));               // random color - uncorrelated
              * (1.+.1*sr3(i));                  // random color - correlated
    }
}

void main(){
    vec4 O = vec4(0., 0., 0., 1.0);
    //if((expPosition.x < 0.05) && (expPosition.x > -0.05) ){
    if((mod(expPosition.x, GRID_SPACE) < GRID_WIDTH) || (mod(expPosition.y, GRID_SPACE) < GRID_WIDTH)){
        O = vec4(.2, .2, .2, 1.);
    }
    else {
        mainImage(O, gl_FragCoord.xy);
    }
    float alpha = 1.0;
    gl_FragColor = vec4(O.xyz, 1.0);
}
`

export var fragment_shaders = {
    default: createShader(gl, fragment_shader, gl.FRAGMENT_SHADER),
    map: createShader(gl, shader_map, gl.FRAGMENT_SHADER)
}
