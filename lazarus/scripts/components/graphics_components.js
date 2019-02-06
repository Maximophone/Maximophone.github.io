import { graphics, graphics_map, graphics_light, graphics_react, graphics_explosion } from "../graphics/graphics.js"

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


class ShipGraphicsComponent extends GraphicsComponent {
    draw(){
	var injured_display = ((this.entity.health<=0.1*this.entity.max_health)&(this.blink(0.5)))
	var params = {
	    fillColor: injured_display?"#aa1100":"#b322fd"
	}
	this.graphics.draw("circle", params)
    }
}


class EngineGraphicsComponent extends GraphicsComponent {
    constructor(entity){
	super(entity)
	this.graphics = graphics_react
	this.transparent = true
    }
    draw(){
	if(this.entity.accelerate || this.entity.deccelerate || this.entity.strafe_left || this.entity.strafe_right){
	    this.graphics.draw("large_rect")
	}
    }
}
    

class BulletGraphicsComponent extends GraphicsComponent {
    draw(){
	this.graphics.draw("circle", {fillColor: "#ffffaa"})
    }
}

class MissileGraphicsComponent extends GraphicsComponent {
    draw(){
	this.graphics.draw("missile", {fillColor:"#ffffaa"})
    }
}

class ExplosionGraphicsComponent extends GraphicsComponent {
    constructor(entity){
	super(entity)
	this.transparent = true
	this.graphics = graphics_explosion
    }
    draw(){
	this.graphics.draw("large_rect")
    }
}


class LootGraphicsComponent extends GraphicsComponent {
    draw(){
	this.graphics.fillColor = "#ffffff"
	var params = {
	    fillColor: "#ffaaaa"
	}
	this.graphics.draw("triangle", params)
    }
}


class WeaponGraphicsComponent extends GraphicsComponent {
    draw(){
	var params = {
	    fillColor: "#dddddd"
	}
	this.graphics.draw("rect", params)
    }
}


class ShieldGraphicsComponent extends GraphicsComponent {
    constructor(entity){
	super(entity)
	this.transparent = true
    }
    draw(){
	if(this.entity.health > 0){
	    var params = {
		fillColor: "#0000ff",
		alpha: 0.2*this.entity.health/this.entity.max_health+0.1
	    }
	    this.graphics.draw("circle", params)
	}
    }
}


class PointerGraphicsComponent extends GraphicsComponent {
    draw(){
	this.graphics.draw("circle")
    }
}


class StaticGraphicsComponent {
    static get_graphics(){
	return graphics
    }
    static is_transparent(){
	return false
    }
}


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


class DebugStatic extends StaticGraphicsComponent {
    static draw(){
	graphics_light.draw("large_rect", {fillColor: "ffffcc"})
    }
    static is_transparent(){
	return true
    }
    static get_graphics(){
	return graphics_light
    }
}


class Debug extends GraphicsComponent {
    constructor(entity){
	super(entity)
	this.transparent = true
	this.graphics = graphics_light
    }
    draw(){
	this.graphics.draw("large_rect", {fillColor: "#ff8866"})
    }
}


export var graphics_components = {
    ship: ShipGraphicsComponent,
    engine: EngineGraphicsComponent,
    loot: LootGraphicsComponent,
    bullet: Debug,
    missile: MissileGraphicsComponent,
    explosion: ExplosionGraphicsComponent,
    weapon: WeaponGraphicsComponent,
    map: MapGraphicsComponent,
    shield: ShieldGraphicsComponent,
    pointer: PointerGraphicsComponent,
    fading_particle: DebugStatic
}
