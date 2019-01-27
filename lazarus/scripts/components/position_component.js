export class PositionComponent {
    constructor(entity, x, y, rot, size){
	this.entity = entity
	this.x = x
	this.y = y
	this.rot = rot
	this.size = size
    }
    get_absolute_pos(){
	// TODO needs to take into account rotation and size as well
	var abs_x = this.x
	var abs_y = this.y
	var size = this.size
	var entity = this.entity
	while(entity.parent){
	    entity = entity.parent
	    abs_x += entity.position.x
	    abs_y += entity.position.y
	    size *= entity.position.size
	}
	return {
	    x: abs_x,
	    y: abs_y,
	    rot: this.rot,
	    size: size
	}
    }
}


