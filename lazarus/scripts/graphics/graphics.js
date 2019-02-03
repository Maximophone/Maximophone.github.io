import {circle_def, rect_def, triangle_def} from "./shapes.js"
import {Shape} from "./webgl_utils.js"
import {gl} from "./gl.js"
import {Uniform} from "./webgl_utils.js"
import {programs} from "./shaders/programs.js"

function hexToRGB(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

class Graphics{
    constructor(program){
	this.program = program
	this.models = {
	    circle: new Shape(circle_def),
	    rect: new Shape(rect_def),
	    triangle: new Shape(triangle_def)
	}

	this.uniforms = {
	    worldMat: new Uniform(this.program, "worldMat", "mat4"),
	    viewMat: new Uniform(this.program, "viewMat", "mat4"),
	    color: new Uniform(this.program, "color", "vec4"),
	    time: new Uniform(this.program, "u_time", "float")
	}
	this.fillColor = "#ffffff"
	this.alpha = 1.0
	this.color_vec4 = new Float32Array(4)
	gl.useProgram(this.program)
    }
    draw(model){
	gl.useProgram(this.program)
	this.set_color_uniform()
	this.set_time()
	this.models[model].draw(this.program)
    }
    set_color_uniform(){
	gl.useProgram(this.program)
	var color = hexToRGB(this.fillColor)
	vec4.set(this.color_vec4, color.r/255, color.g/255, color.b/255, this.alpha)
	this.uniforms.color.set(this.color_vec4)
    }
    set_time(){
	gl.useProgram(this.program)
	this.uniforms.time.set(((new Date().getTime())%1e7)*0.001)
    }
	
    // circle(){
    // 	gl.useProgram(this.program)
    // 	this.set_color_uniform()
    // 	this.shapes.circle.draw(this.program)
    // }
    // rect(){
    // 	gl.useProgram(this.program)
    // 	this.set_color_uniform()
    // 	this.shapes.rect.draw(this.program)
    // }
    // triangle(){
    // 	gl.useProgram(this.program)
    // 	this.set_color_uniform()
    // 	this.shapes.triangle.draw(this.program)
    // }
    // model(model_name){
    // 	gl.useProgram(this.program)
    // 	this.set_color_uniform()
    // 	this.models[model_name].draw(this.program)
    // }
}

export var graphics = new Graphics(programs.default)
export var graphics_map = new Graphics(programs.map)
