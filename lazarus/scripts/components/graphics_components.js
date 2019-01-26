class GraphicsComponent {
    constructor(entity){
	this.entity = entity
    }
    save_style(ctx){
	this.style_buffer = {
	    fillStyle: ctx.fillStyle,
	    strokeStyle: ctx.strokeStyle,
	    lineWidth: ctx.lineWidth
	}
    }
    load_style(ctx){
	ctx.fillStyle = this.style_buffer.fillStyle
	ctx.strokeStyle = this.style_buffer.strokeStyle
	ctx.lineWidth = this.style_buffer.lineWidth
    }
}

export class MapGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	this.save_style(ctx)
	ctx.strokeStyle = "#bbbbbb"
	ctx.fillStyle = "#000519"
	ctx.lineWidth = 2
	var N = 100
	var step = 100
	ctx.beginPath()
	ctx.rect(-N/2*step, -N/2*step, N*step, N*step)
	ctx.fill()
	for(var i = 0; i<=N; i++){
	    ctx.beginPath()
	    ctx.moveTo(-N/2*step, i*step-N/2*step)
	    ctx.lineTo(N/2*step, i*step-N/2*step)
	    ctx.stroke()
	}
	for(var i = 0; i<=N; i++){
	    ctx.beginPath()
	    ctx.moveTo(i*step-N/2*step, -N/2*step)
	    ctx.lineTo(i*step-N/2*step, N/2*step)
	    ctx.stroke()
	}
	this.load_style(ctx)
    }
}

export class ShipGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	var MODEL_RADIUS = 1
	var buff_strokeStyle = ctx.strokeStyle
	if(this.entity.collider_component.is_colliding){
	    ctx.strokeStyle = "#aa5555"
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
	this.save_style(ctx)
	ctx.fillStyle = "#fefeb0"
	ctx.beginPath()
	ctx.arc(0, 0, 1, 0, 2*Math.PI)
	ctx.arc(-1, 0, 1, 0, 2*Math.PI)
	ctx.fill()
	this.load_style(ctx)
    }
}

export class LootGraphicsComponent extends GraphicsComponent {
    draw(ctx){
	this.save_style(ctx)
	ctx.fillStyle = "#aaaa00"
	ctx.beginPath()
	ctx.arc(0, 0, 1, 0, 2*Math.PI)
	ctx.fill()
	this.load_style(ctx)
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

class StaticGraphicsComponent {
    static save_style(ctx){
	this.style_buffer = {
	    fillStyle: ctx.fillStyle,
	    strokeStyle: ctx.strokeStyle,
	    lineWidth: ctx.lineWidth,
	    globalAlpha: ctx.globalAlpha
	}
    }
    static load_style(ctx){
	ctx.fillStyle = this.style_buffer.fillStyle
	ctx.strokeStyle = this.style_buffer.strokeStyle
	ctx.lineWidth = this.style_buffer.lineWidth
	ctx.globalAlpha = this.style_buffer.globalAlpha
    }
}

class FadingParticleGraphicsComponent extends StaticGraphicsComponent {
    static draw(ctx, particle, dt){
	this.save_style(ctx)
	ctx.globalAlpha = 0.5
	ctx.fillStyle = "#ffffcc"
	ctx.beginPath()
	ctx.arc(0, 0, 1, 0, 2*Math.PI)
	ctx.fill()
	this.load_style(ctx)
    }
}

export var graphics_components = {
    ship: ShipGraphicsComponent,
    loot: LootGraphicsComponent,
    bullet: BulletGraphicsComponent,
    weapon: WeaponGraphicsComponent,
    map: MapGraphicsComponent,
    fading_particle: FadingParticleGraphicsComponent
}
