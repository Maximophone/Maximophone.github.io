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

export function distance(entity1, entity2){
    return Math.sqrt((entity1.x-entity2.x)**2 + (entity1.y-entity2.y)**2)
}
