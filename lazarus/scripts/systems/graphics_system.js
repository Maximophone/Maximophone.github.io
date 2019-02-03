import { System } from './systems.js'
import { rotate } from '../utils.js'
import { graphics_components } from '../components/graphics_components.js'
import { particles_pool } from '../systems/particles_system.js'
import { camera } from '../entities/camera.js'
import { gl } from "../graphics/gl.js"
import { graphics, graphics_map } from "../graphics/graphics.js"


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

class GraphicsSystem extends System {
    constructor(){
	super()
	this.components_dict = graphics_components
	this.identity_mat = new Float32Array(16)
	set_identity(this.identity_mat)
	this.buffer_mat = new Float32Array(16)
	this.output_mat = new Float32Array(16)
    }
    // draw_component_old(ctx, entity, component){
    // 	var parents_chain = [entity]
    // 	while(entity.parent){
    // 	    entity = entity.parent
    // 	    parents_chain.push(entity)
    // 	}
    // 	ctx.transform(1/camera.scale, 0, 0, 1/camera.scale, 0, 0)
    // 	ctx.transform(1, 0, 0, 1, -camera.x, -camera.y)
    // 	for(var entity of parents_chain.reverse()){
    // 	    ctx.transform(1, 0, 0, 1, entity.position.x, entity.position.y)
    // 	    rotate(ctx, entity.position.rot)
    // 	    var size = entity.position.size || 1
    // 	    ctx.transform(size, 0, 0, size, 0, 0)
    // 	}
    // 	component.draw(ctx, entity)
    // 	for(var entity of parents_chain.reverse()){
    // 	    var size = entity.position.size || 1
    // 	    ctx.transform(1/size, 0, 0, 1/size, 0, 0)
    // 	    rotate(ctx, -entity.position.rot)
    // 	    ctx.transform(1, 0, 0, 1, -entity.position.x, -entity.position.y)
    // 	}
    // 	ctx.transform(1, 0, 0, 1, camera.x, camera.y)
    // 	ctx.transform(camera.scale, 0, 0, camera.scale, 0, 0)
    // }
    draw_component(entity, component){
	var curr_graphics = null
	if(component.graphics){
	    curr_graphics = component.graphics    
	} else {
	    curr_graphics = graphics
	}
	gl.useProgram(curr_graphics.program)

	if(!component.unbound){
	    var parents_chain = [entity]
	    var z = 0
	    if(entity.type == "shield"){
		z = 0
	    }
	    while(entity.parent){
		entity = entity.parent
		parents_chain.push(entity)
	    }
	    set_identity(this.buffer_mat)
	    for(var entity of parents_chain){
		var size = entity.position.size || 1
		scale_mat(this.buffer_mat, this.output_mat, size, size)
		rotate_mat(this.output_mat, this.buffer_mat, entity.position.rot)
		translate_mat(this.buffer_mat, this.output_mat, entity.position.x, entity.position.y, z)
		mat4.copy(this.buffer_mat, this.output_mat)
	    }
	// var viewMat = new Float32Array(
	//     [1, 0, 0, 0,
	//      0, 1, 0, 0,
	//      0, 0, 1, 0,
	//      -0.25, 0, 0, 1]
	// )
	// var worldMat = new Float32Array(
	//     [1, 0, 0, 0,
	//      0, 1, 0, 0,
	//      0, 0, 1, 0,
	//      0.5, 0, 0, 1]
	// )
	    curr_graphics.uniforms.worldMat.set(this.output_mat)
	    set_identity(this.output_mat)
	    translate_mat(this.output_mat, this.buffer_mat, -camera.x, -camera.y, 0)
	    scale_mat(this.buffer_mat, this.output_mat, 1/camera.size, 1/camera.size)
	    curr_graphics.uniforms.viewMat.set(this.output_mat)
	} else {
	    set_identity(this.output_mat)
	    curr_graphics.uniforms.worldMat.set(this.output_mat)
	    curr_graphics.uniforms.viewMat.set(this.output_mat)
	}
	component.draw()
    }
    draw(ctx){
	this.garbage_collect(this.components)
	// ctx.clearRect(0, 0, c.width, c.height)
	//gl.clearColor(0., 0., 0., 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.disable(gl.BLEND)
	var i = 0
	var transparent_components = []
	for(var component of this.components){
	    if(component.transparent){
		transparent_components.push(component)
	    }
	    else {
		this.draw_component(component.entity, component)
	    }
	    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	}
	gl.enable(gl.BLEND)
	for(var component of transparent_components){
	    this.draw_component(component.entity, component)
	}
	for(var particle of particles_pool.particles){
	    if(particle.in_use()){
		this.draw_component(particle, particle.graphics)
	    }
	}
    }
}

export var graphics_system = new GraphicsSystem()
