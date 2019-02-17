export var laser_shader = `
precision mediump float;
uniform float u_time;
uniform vec4 color;

varying vec2 vertPos;

float laser(vec2 U){
  // float r = sqrt(dot(U, U));
  return exp(-5.*(1.+0.3*sin(4.*u_time))*(abs(U.y)*(U.x+2.)));
}

void main(){
  float lv = laser(vertPos);
  vec3 col = color.rgb*lv;
  gl_FragColor = vec4(col, lv);
}
`
