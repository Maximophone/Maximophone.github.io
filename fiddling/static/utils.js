export function translate(context, x, y){
    context.transform(1, 0, 0, 1, x, y)
}

export function scale(context, sx, sy){
    context.transform(sx, 0, 0, sy, 0, 0)
}

export function rotate(context, theta){
    context.transform(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta), 0, 0)
}

export function garbage_filter(list, filter){
    var to_delete = []
    for(i=0; i<list.length; i++){
	if(filter(list[i])){
	    to_delete.push(i)
	}
    }
    for(var i of to_delete.reverse()){
	list.splice(i, 1)
    }
}

export function distance(position1, position2){
    return Math.sqrt((position1.x-position2.x)**2 + (position1.y-position2.y)**2)
}

export function angle_to(position_from, position_to){
    // returns min angle
    var delta_x = position_to.x - position_from.x
    var delta_y = position_to.y - position_from.y
    return Math.atan2(delta_y, delta_x)
}
