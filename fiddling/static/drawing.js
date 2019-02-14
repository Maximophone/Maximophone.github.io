import { graphics_components } from './components/graphics_components.js'
import { gl } from "./graphics/gl.js"


function set_identity(mat){
    mat4.set(mat,
	     1, 0, 0, 0,
	     0, 1, 0, 0,
	     0, 0, 1, 0,
	     0, 0, 0, 1)
}
function translate_mat(input_mat, output_mat, x, y, z){
    mat4.set(output_mat,
	     1, 0, 0, 0,
	     0, 1, 0, 0,
	     0, 0, 1, 0,
	     x, y, z, 1)
    mat4.mul(output_mat, output_mat, input_mat)
}
function rotate_mat(input_mat, output_mat, angle){
    mat4.set(output_mat,
	     Math.cos(angle), Math.sin(angle), 0, 0,
	     -Math.sin(angle), Math.cos(angle), 0, 0,
	     0, 0, 1, 0,
	     0, 0, 0, 1)
    mat4.mul(output_mat, output_mat, input_mat)
}
function scale_mat(input_mat, output_mat, sx, sy){
    mat4.set(output_mat,
	     sx, 0, 0, 0,
	     0, sy, 0, 0,
	     0, 0, 1, 0,
	     0, 0, 0, 1)
    mat4.mul(output_mat, output_mat, input_mat)
}

class Painter {
    constructor(){
	this.identity_mat = new Float32Array(16)
	set_identity(this.identity_mat)
	this.buffer_mat = new Float32Array(16)
	this.output_mat = new Float32Array(16)
    }
    draw_component(camera, component, entity, entities){
	var curr_graphics = component.get_graphics()
	gl.useProgram(curr_graphics.program)

	if(component.unbound){
	    set_identity(this.output_mat)
	    curr_graphics.uniforms.worldMat.set(this.output_mat)
	    curr_graphics.uniforms.viewMat.set(this.output_mat)
	    component.draw(entity)
	    return
	}
	var parents_chain = [entity]
	while(entity.parent_id){
	    entity = entities[entity.parent_id]
	    parents_chain.push(entity)
	}
	set_identity(this.buffer_mat)
	for(var entity of parents_chain){
	    var size = entity.size || 1
	    scale_mat(this.buffer_mat, this.output_mat, size, size)
	    rotate_mat(this.output_mat, this.buffer_mat, entity.rot)
	    translate_mat(this.buffer_mat, this.output_mat, entity.x, entity.y, 0)
	    mat4.copy(this.buffer_mat, this.output_mat)
	}
	curr_graphics.uniforms.worldMat.set(this.output_mat)
	set_identity(this.output_mat)
	translate_mat(this.output_mat, this.buffer_mat, -camera.x, -camera.y, 0)
	scale_mat(this.buffer_mat, this.output_mat, 1/camera.size, 1/camera.size)
	curr_graphics.uniforms.viewMat.set(this.output_mat)

	component.draw(entity)
    }
    draw(camera, entities){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.disable(gl.BLEND)
	var i = 0
	var transparent_components = []
	for(var entity_id in entities){
	    var entity = entities[entity_id]
	    if(entity){
		var a = 2
	    }
	    else {
		continue
	    }
	    var component = graphics_components[entity.type]
	    if(component.is_transparent()){
		transparent_components.push([entity, component])
	    }
	    else {
		this.draw_component(camera, component, entity, entities)
	    }
	}
	gl.enable(gl.BLEND)
	for(var el of transparent_components){
	    this.draw_component(camera, el[1], el[0], entities)
	}
	// TODO: add particles
    }
}

export var painter = new Painter()
