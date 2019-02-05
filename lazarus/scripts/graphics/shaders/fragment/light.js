export var light_shader = `
precision mediump float;
uniform float u_time;
uniform vec4 color;

varying vec2 vertPos;

float light(vec2 U){
  float r = sqrt(dot(U, U));
  return .2*pow(r, -1.5);
}

void main(){
  float lv = light(vertPos);
  vec3 col = vec3(1.) * lv;
  gl_FragColor = vec4(col, lv);
}
`
