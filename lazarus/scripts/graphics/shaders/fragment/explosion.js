export var explosion_shader = `
precision mediump float;

uniform float u_time;

varying vec2 vertPos;

#define PI 3.141618

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.,0.));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );
float fbm( in vec2 p )
{	
	float z=1.624;       // EDIT THIS TO MODIFY THE INTENSITY OF RAYS
	float rz = 0.294; // EDIT THIS TO MODIFY THE LENGTH OF RAYS
	p *= 0.258;        // EDIT THIS TO MODIFY THE FREQUENCY OF RAYS
	for (int i= 1; i < 6; i++)
	{
		rz+= abs((noise(p)-0.5)*2.)/z;
		z = z*2.;
		p = p*2.*m2;
	}
	return rz;
}

float explosion(vec2 st, float scale){
  float r = sqrt(dot(scale*st, scale*st));
  float a = atan(scale*st.y, scale*st.x);
  return fbm(vec2(r,sin(a*PI+u_time))*1.)*exp(-5.*(r-0.1));;
}

void main(){
  vec2 st = vertPos/2.;
  float expl = explosion(st, .2);
  vec3 col = expl*vec3(1.000,0.641,0.078);
  //col = vec3(vertPos.x, vertPos.y, 0.);
  gl_FragColor = vec4(col, expl);
}
`
