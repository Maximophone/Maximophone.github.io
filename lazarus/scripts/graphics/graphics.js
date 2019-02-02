import {circle_def, rect_def, triangle_def} from "./shapes.js"
import {Shape} from "./webgl_utils.js"
import {gl} from "./gl.js"

class Graphics{
    constructor(gl){
	this.gl = gl
	this.program = null
	this.shapes = {
	    circle: new Shape(circle_def),
	    rect: new Shape(rect_def),
	    triangle: new Shape(triangle_def)
	}
	this.models = {}
    }
    circle(){
	this.gl.useProgram(this.program)
	this.shapes.circle.draw(this.program)
    }
    rect(){
	this.gl.useProgram(this.program)
	this.shapes.rect.draw(this.program)
    }
    triangle(){
	this.gl.useProgram(this.program)
	this.shapes.circle.draw(this.program)
    }
    model(model_name){
	this.gl.useProgram(this.program)
	this.models[model_name].draw(this.program)
    }
}

export var graphics = new Graphics()
