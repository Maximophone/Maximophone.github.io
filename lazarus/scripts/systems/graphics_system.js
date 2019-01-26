import { System } from './systems.js'
import { rotate } from '../utils.js'
import { graphics_components } from '../components/graphics_components.js'
import { particles_pool } from '../systems/particles_system.js'

class GraphicsSystem extends System {
    constructor(){
	super()
	this.components_dict = graphics_components
    }
    draw_component(ctx, camera, entity, component){
	var parents_chain = [entity]
	while(entity.parent){
	    entity = entity.parent
	    parents_chain.push(entity)
	}
	ctx.transform(1/camera.scale, 0, 0, 1/camera.scale, 0, 0)
	ctx.transform(1, 0, 0, 1, -camera.x, -camera.y)
	for(var entity of parents_chain.reverse()){
	    ctx.transform(1, 0, 0, 1, entity.position.x, entity.position.y)
	    rotate(ctx, entity.position.rot)
	    var size = entity.position.size || 1
	    ctx.transform(size, 0, 0, size, 0, 0)
	}
	component.draw(ctx, entity)
	for(var entity of parents_chain.reverse()){
	    var size = entity.position.size || 1
	    ctx.transform(1/size, 0, 0, 1/size, 0, 0)
	    rotate(ctx, -entity.position.rot)
	    ctx.transform(1, 0, 0, 1, -entity.position.x, -entity.position.y)
	}
	ctx.transform(1, 0, 0, 1, camera.x, camera.y)
	ctx.transform(camera.scale, 0, 0, camera.scale, 0, 0)
    }

    draw(ctx, camera){
	this.garbage_collect(this.components)
	ctx.clearRect(0, 0, c.width, c.height)
	for(var component of this.components){
	    this.draw_component(ctx, camera, component.entity, component)
	}
	for(var particle of particles_pool.particles){
	    if(particle.in_use()){
		this.draw_component(ctx, camera, particle, particle.graphics)
	    }
	}
    }
}

export var graphics_system = new GraphicsSystem()
