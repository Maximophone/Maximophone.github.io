export var react_shader = `
precision mediump float;

uniform float u_time;

varying vec2 vertPos;

float react(vec2 st, float rc, float spread, float shape){
  float r = sqrt(dot(st, st));
  float a = atan(st.y, st.x);
  return  pow(r, shape*(1.+0.5*sin(10.*u_time)))*exp(-spread*(r-rc))*a*a;
}

void main() {
    vec2 st = vertPos;

    vec3 spread_color = vec3(0.890,0.555,0.676)*20.;
    float flr = react(st, 0.02, spread_color.r, 0.2);
    float flg = react(st, 0.02, spread_color.g, 0.2);
    float flb = react(st, 0.0, spread_color.b, 0.1);
    vec3 color = vec3(flr, flg, flb)*vec3(0.771,0.331,1.000);

    gl_FragColor = vec4(color, 1.0);
}
`
