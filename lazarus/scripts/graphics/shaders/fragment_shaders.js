import { gl } from "../gl.js"
import { createShader } from "../webgl_utils.js"
import { default_shader } from "./fragment/default.js"
import { light_shader } from "./fragment/light.js"
import { map_shader } from "./fragment/map.js"
import { react_shader } from "./fragment/react.js"

// var fragment_shader = `
// precision mediump float;

// uniform vec4 color;

// void main(){
//     gl_FragColor = color;
// }
// `

// var shader_map = `
// precision mediump float;
// uniform float u_time;
// uniform mat4 viewMat;
// varying vec4 worldPosition;
// varying vec4 viewPosition;
// varying vec4 expPosition;

// float flare(vec2 U){
//     vec2 A = sin(vec2(0, 1.57) + u_time);
//     U = abs( U * mat2(A, -A.y, A.x)) * mat2(2, 0, 1, 1.7);
//     return .01/max(U.x, U.y);
//     // return .5*pow(max(U.x, U.y), -0.9);
// }

// #define r(x)     fract(1e4*sin((x)*541.17))
// #define sr2(x)   ( r(vec2(x,x+.1)) *2.-1. )
// #define sr3(x)   ( r(vec4(x,x+.1,x+.2,0)) *2.-1. )
// #define GRID_SPACE 0.2
// #define GRID_WIDTH 0.005

// void mainImage( out vec4 O, vec2 U )
// {
//     vec2 R = vec2(1000.0,800.0);
//     vec2 buffer = vec2(0., 0.);
//     U =  (U+U - R) / R.y;
//     O -= O+.3;
//     for (float i=0.; i<50.; i++)
//     {
//         buffer = U - sr2(i)*R/R.y;
//         if(max(buffer.x, buffer.y) > 0.2) continue; // For performance, discard
//         O += flare (U - sr2(i)*R/R.y )           // rotating flare at random location
//               * r(i+.2)                          // random scale
//               * (1.+.5*sin(r(i+.3)*4.*u_time))  // time pulse
//             //* (1.+.1*sr3(i+.4));               // random color - uncorrelated
//               * (1.+.1*sr3(i));                  // random color - correlated
//     }
// }

// void main(){
//     vec4 O = vec4(0., 0., 0., 1.0);
//     if((mod(expPosition.x, GRID_SPACE) < GRID_WIDTH) || (mod(expPosition.y, GRID_SPACE) < GRID_WIDTH)){
//         O = vec4(.2, .2, .2, 1.);
//     }
//     else {
//         mainImage(O, gl_FragCoord.xy);
//     }
//     float alpha = 1.0;
//     gl_FragColor = vec4(O.xyz, 1.0);
// }
// `

// var light_shader = `
// precision mediump float;
// uniform float u_time;
// uniform vec4 color;

// varying vec2 vertPos;

// /* float noise( in vec2 x ) */
// /* { */
// /* 	return texture(iChannel0, x*.01).x; // INCREASE MULTIPLIER TO INCREASE NOISE */
// /* } */

// /* // FLARING GENERATOR, A.K.A PURE AWESOME */
// /* mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 ); */
// /* float fbm( in vec2 p ) */
// /* {	 */
// /* 	float z=2.;       // EDIT THIS TO MODIFY THE INTENSITY OF RAYS */
// /* 	float rz = -0.05; // EDIT THIS TO MODIFY THE LENGTH OF RAYS */
// /* 	p *= 0.25;        // EDIT THIS TO MODIFY THE FREQUENCY OF RAYS */
// /* 	for (int i= 1; i < 6; i++) */
// /* 	{ */
// /* 		rz+= abs((noise(p)-0.5)*2.)/z; */
// /* 		z = z*2.; */
// /* 		p = p*2.*m2; */
// /* 	} */
// /* 	return rz; */
// /* } */

// #define gamma 5.
// #define ray_brightness 10.
// #define red 4.
// #define green 1.
// #define blue .3

// vec3 sun(vec2 U){
//   float val = 0.01*pow(U.x, 0.2)*pow(U.y,0.2);
//   float r = sqrt(dot(U, U));
//   vec3 col = 1.-val/vec3(red,green,blue);
//   float rad = 60.*(1.+sin(u_time*3.));
//   col = mix(col, vec3(1.), rad - 266.67*r);
//   return col;
// }

// vec3 simple_light(vec2 U){
//   float r = sqrt(dot(U, U));
//   float val = .2*pow(r, -1.5);
//   return vec3(val);
// }

// float flare(vec2 U){
//   vec2 A = sin(vec2(0, 1.));
//   U = abs( U * mat2(A, -A.y, A.x)) * mat2(2, 0, 1, 1.7);
//   return .5*pow(max(U.x, U.y), -.7);
// }

// void main(){
//   //float flare_value = flare(vertPos);
//   //vec3 sun_value = sun(vertPos);
//   vec3 light_value = simple_light(vertPos);
//   gl_FragColor = vec4(light_value*color.rgb, light_value.r);
//   // gl_FragColor = vec4(sun_value, 1.);
//   // gl_FragColor = vec4(flare_value);
// }
// `

export var fragment_shaders = {
    default: createShader(gl, default_shader, gl.FRAGMENT_SHADER),
    map: createShader(gl, map_shader, gl.FRAGMENT_SHADER),
    light: createShader(gl, light_shader, gl.FRAGMENT_SHADER),
    react: createShader(gl, react_shader, gl.FRAGMENT_SHADER)
}
