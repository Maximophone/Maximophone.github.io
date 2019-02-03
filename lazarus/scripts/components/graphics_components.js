import { graphics, graphics_map } from "../graphics/graphics.js"

class GraphicsComponent {
    constructor(entity){
	this.entity = entity
	this.graphics = graphics
	this.unbound = false
	this.transparent = false
    }
    save_style(){
	this.style_buffer = {
	    fillColor: this.graphics.fillColor,
	    alpha: this.graphics.alpha
	}
    }
    load_style(){
	this.graphics.fillColor = this.style_buffer.fillColor
	this.graphics.alpha = this.style_buffer.alpha
    }
}

class MapGraphicsComponent extends GraphicsComponent{
    constructor(entity){
	super(entity)
	this.graphics = graphics_map
    }
    draw(){
	this.graphics.draw("rect")
    }
}


// class GraphicsComponent {
//     constructor(entity){
// 	this.entity = entity
//     }
//     save_style(ctx){
// 	this.style_buffer = {
// 	    fillStyle: ctx.fillStyle,
// 	    strokeStyle: ctx.strokeStyle,
// 	    lineWidth: ctx.lineWidth,
// 	    globalAlpha: ctx.globalAlpha
// 	}
//     }
//     load_style(ctx){
// 	ctx.fillStyle = this.style_buffer.fillStyle
// 	ctx.strokeStyle = this.style_buffer.strokeStyle
// 	ctx.lineWidth = this.style_buffer.lineWidth
// 	ctx.globalAlpha = this.style_buffer.globalAlpha
//     }
// }

// class MapGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	this.save_style(ctx)
// 	ctx.strokeStyle = "#bbbbbb"
// 	ctx.fillStyle = "#000519"
// 	ctx.lineWidth = 2
// 	var N = 100
// 	var step = 100
// 	ctx.beginPath()
// 	ctx.rect(-N/2*step, -N/2*step, N*step, N*step)
// 	ctx.fill()
// 	for(var i = 0; i<=N; i++){
// 	    ctx.beginPath()
// 	    ctx.moveTo(-N/2*step, i*step-N/2*step)
// 	    ctx.lineTo(N/2*step, i*step-N/2*step)
// 	    ctx.stroke()
// 	}
// 	for(var i = 0; i<=N; i++){
// 	    ctx.beginPath()
// 	    ctx.moveTo(i*step-N/2*step, -N/2*step)
// 	    ctx.lineTo(i*step-N/2*step, N/2*step)
// 	    ctx.stroke()
// 	}
// 	this.load_style(ctx)
//     }
// }

class ShipGraphicsComponent extends GraphicsComponent {
    draw(){
	this.save_style()
	this.graphics.fillColor = "#aa5500"
	this.graphics.draw("circle")
	this.load_style()
    }
}

// class ShipGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	var MODEL_RADIUS = 1
// 	var buff_strokeStyle = ctx.strokeStyle
// 	if(this.entity.collider_component.is_colliding){
// 	    ctx.strokeStyle = "#aa5555"
// 	}
// 	ctx.beginPath()
// 	ctx.moveTo(0, 0);
// 	ctx.lineTo(MODEL_RADIUS/2, 0);
// 	ctx.stroke()
// 	ctx.beginPath()
// 	ctx.arc(0, 0, MODEL_RADIUS, 0, 2*Math.PI)
// 	ctx.stroke()
// 	ctx.strokeStyle = buff_strokeStyle;
//     }
// }

class BulletGraphicsComponent extends GraphicsComponent {
    draw(){
	this.graphics.draw("circle")
    }
}


// class BulletGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	this.save_style(ctx)
// 	ctx.fillStyle = "#fefeb0"
// 	ctx.beginPath()
// 	ctx.arc(0, 0, 1, 0, 2*Math.PI)
// 	ctx.arc(-1, 0, 1, 0, 2*Math.PI)
// 	ctx.fill()
// 	this.load_style(ctx)
//     }
// }


class LootGraphicsComponent extends GraphicsComponent {
    draw(){
	this.save_style()
	this.graphics.fillColor = "#ffffff"
	this.graphics.draw("triangle")
	this.load_style()
    }
}


// class LootGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	this.save_style(ctx)
// 	ctx.fillStyle = "#aaaa00"
// 	ctx.beginPath()
// 	ctx.arc(0, 0, 1, 0, 2*Math.PI)
// 	ctx.fill()
// 	this.load_style(ctx)
//     }
// }


class WeaponGraphicsComponent extends GraphicsComponent {
    draw(){
	this.save_style()
	this.graphics.fillColor = "#ffffff"
	this.graphics.draw("rect")
	this.load_style()
    }
}


// class WeaponGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	var MODEL_SIZE = 1
// 	ctx.beginPath()
// 	ctx.rect(-0.75*MODEL_SIZE, -0.1*MODEL_SIZE, 1.5*MODEL_SIZE, 0.2*MODEL_SIZE)
// 	ctx.stroke()
//     }
// }

class ShieldGraphicsComponent extends GraphicsComponent {
    constructor(entity){
	super(entity)
	this.transparent = true
    }
    draw(){
	if(this.entity.health > 0){
	    this.save_style()
	    this.graphics.fillColor = "#bbbbff"
	    this.graphics.alpha = 0.2
	    this.graphics.draw("circle")
	    this.load_style()
	}
    }
}

// class ShieldGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	if(this.entity.health > 0){
// 	    this.save_style(ctx)
// 	    ctx.fillStyle = "#bbbbff"
// 	    ctx.globalAlpha = 0.2
// 	    ctx.beginPath()
// 	    ctx.arc(0, 0, 1, 0, 2*Math.PI)
// 	    ctx.fill()
// 	    this.load_style(ctx)
// 	}
//     }
// }

class PointerGraphicsComponent extends GraphicsComponent {
    draw(){
	this.graphics.draw("circle")
    }
}

// class PointerGraphicsComponent extends GraphicsComponent {
//     draw(ctx){
// 	ctx.beginPath()
// 	ctx.arc(0, 0, 1, 0, 2*Math.PI)
// 	ctx.stroke()
//     }
// }


class StaticGraphicsComponent {
    static save_style(){
	this.style_buffer = {
	    fillColor: graphics.fillColor,
	    alpha: graphics.alpha
	}
    }
    static load_style(){
	graphics.fillColor = this.style_buffer.fillColor
	graphics.alpha = this.style_buffer.alpha
    }
}

// class StaticGraphicsComponent {
//     static save_style(ctx){
// 	this.style_buffer = {
// 	    fillStyle: ctx.fillStyle,
// 	    strokeStyle: ctx.strokeStyle,
// 	    lineWidth: ctx.lineWidth,
// 	    globalAlpha: ctx.globalAlpha
// 	}
//     }
//     static load_style(ctx){
// 	ctx.fillStyle = this.style_buffer.fillStyle
// 	ctx.strokeStyle = this.style_buffer.strokeStyle
// 	ctx.lineWidth = this.style_buffer.lineWidth
// 	ctx.globalAlpha = this.style_buffer.globalAlpha
//     }
// }

class FadingParticleGraphicsComponent extends StaticGraphicsComponent {
    static draw(){
	this.save_style()
	graphics.fillColor = "#ffffcc"
	graphics.alpha = 0.5
	graphics.draw("circle")
	this.load_style()
    }
}


// class FadingParticleGraphicsComponent extends StaticGraphicsComponent {
//     static draw(ctx, particle, dt){
// 	this.save_style(ctx)
// 	ctx.globalAlpha = 0.5
// 	ctx.fillStyle = "#ffffcc"
// 	ctx.beginPath()
// 	ctx.arc(0, 0, 1, 0, 2*Math.PI)
// 	ctx.fill()
// 	this.load_style(ctx)
//     }
// }

export var graphics_components = {
    ship: ShipGraphicsComponent,
    loot: LootGraphicsComponent,
    bullet: BulletGraphicsComponent,
    weapon: WeaponGraphicsComponent,
    map: MapGraphicsComponent,
    shield: ShieldGraphicsComponent,
    pointer: PointerGraphicsComponent,
    fading_particle: FadingParticleGraphicsComponent
}
