class GraphicsComponent {
    constructor(entity){
	this.entity = entity
    }
}

export class MapGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	var buff_strokeStyle = ctx.strokeStyle
	ctx.strokeStyle = "#aaaaaa";
	var N = 100
	var step = 100
	for(var i = 0; i<=N; i++){
	    ctx.beginPath()
	    ctx.moveTo(-N/2*step, i*step-N/2*step);
	    ctx.lineTo(N/2*step, i*step-N/2*step);
	    ctx.stroke()
	}
	for(var i = 0; i<=N; i++){
	    ctx.beginPath()
	    ctx.moveTo(i*step-N/2*step, -N/2*step);
	    ctx.lineTo(i*step-N/2*step, N/2*step);
	    ctx.stroke()
	}
	ctx.strokeStyle = buff_strokeStyle;
    }
}

export class ShipGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	var MODEL_RADIUS = 1
	var buff_strokeStyle = ctx.strokeStyle
	if(this.entity.collider_component.is_colliding){
	    ctx.strokeStyle = "#aa5555";
	}
	ctx.beginPath()
	ctx.moveTo(0, 0);
	ctx.lineTo(MODEL_RADIUS/2, 0);
	ctx.stroke()
	ctx.beginPath()
	ctx.arc(0, 0, MODEL_RADIUS, 0, 2*Math.PI)
	ctx.stroke()
	ctx.strokeStyle = buff_strokeStyle;
    }
}

export class BulletGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	ctx.beginPath()
	ctx.arc(0, 0, 1, 0, 2*Math.PI)
	ctx.stroke()
    }
}

export class LootGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	var buff_strokeStyle = ctx.strokeStyle
	ctx.strokeStyle = "#aaaa00"
	ctx.beginPath()
	ctx.arc(0, 0, this.entity.size, 0, 2*Math.PI)
	ctx.stroke()
	ctx.strokeStyle = buff_strokeStyle
    }
}

export class WeaponGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	var MODEL_SIZE = 1
	ctx.beginPath()
	ctx.rect(-0.75*MODEL_SIZE, -0.1*MODEL_SIZE, 1.5*MODEL_SIZE, 0.2*MODEL_SIZE)
	ctx.stroke()
    }
}

export var graphics_components = {
    ship: ShipGraphicsComponent,
    loot: LootGraphicsComponent,
    bullet: BulletGraphicsComponent,
    weapon: WeaponGraphicsComponent,
    map: MapGraphicsComponent
}
