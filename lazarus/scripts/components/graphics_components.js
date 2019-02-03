import { graphics, graphics_map } from "../graphics/graphics.js"

class GraphicsComponent {
    constructor(entity){
	this.entity = entity
	this.graphics = graphics
	this.unbound = false
	this.transparent = false
    }
    get_graphics(){
	return this.graphics
    }
    is_transparent(){
	return this.transparent
    }
    get_time(){
	return new Date().getTime()/1000.
    }
    blink(frequency){
	return this.get_time()%frequency < frequency/2.
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
	var injured_display = ((this.entity.health<=30)&(this.blink(0.5)))
	var params = {
	    fillColor: injured_display?"#aa1100":"#b322fd" 
	}
	this.graphics.draw("circle", params)
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
	this.graphics.draw("circle", {fillColor: "#ffffaa"})
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
	this.graphics.fillColor = "#ffffff"
	var params = {
	    fillColor: "#ffaaaa"
	}
	this.graphics.draw("triangle", params)
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
	var params = {
	    fillColor: "#dddddd"
	}
	this.graphics.draw("rect", params)
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
	    var params = {
		fillColor: "#bbbbff",
		alpha: 0.2*this.entity.health/this.entity.max_health+0.1
	    }
	    this.graphics.draw("circle", params)
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
    static get_graphics(){
	return graphics
    }
    static is_transparent(){
	return false
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
	var params = {
	    fillColor: "#ffffcc",
	    alpha: 0.5
	}
	graphics.draw("circle", params)
    }
    static is_transparent(){
	return true
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
