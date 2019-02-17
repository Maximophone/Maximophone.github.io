import { graphics, graphics_map, graphics_light, graphics_react, graphics_explosion, graphics_laser_beam } from "../graphics/graphics.js"

class GraphicsComponent {
    static get_graphics(){
	return graphics
    }
    static is_transparent(){
	return false
    }
}

class MapGraphicsComponent extends GraphicsComponent{
    static draw(){
	graphics_map.draw("rect")
    }
    static get_graphics(){ return graphics_map }
}


class ShipGraphicsComponent extends GraphicsComponent {
    static draw(entity){	
	// var injured_display = ((entity.health<=0.1*entity.max_health)&(this.blink(0.5)))
	var injured_display = entity.health<=0.1*entity.max_health
	var params = {
	    fillColor: injured_display?"#aa1100":"#b322fd"
	}
	graphics.draw("circle", params)
    }
}


class EngineGraphicsComponent extends GraphicsComponent {
    static draw(entity){
	if(entity.accelerate || entity.deccelerate || entity.strafe_left || entity.strafe_right){
	    graphics_react.draw("large_rect")
	}
    }
    static is_transparent(){return true}
    static get_graphics(){return graphics_react}
}
    

class BulletGraphicsComponent extends GraphicsComponent {
    static draw(){
	graphics.draw("circle", {fillColor: "#ffffaa"})
    }
}

class MissileGraphicsComponent extends GraphicsComponent {
    static draw(){
	graphics.draw("missile", {fillColor:"#ffffaa"})
    }
}

class ExplosionGraphicsComponent extends GraphicsComponent {
    static draw(){
	graphics_explosion.draw("large_rect")
    }
    static is_transparent(){return true}
    static get_graphics(){return graphics_explosion}
}

class LaserBeam extends GraphicsComponent {
    static draw(){
	graphics_laser_beam.draw("rect", {fillColor: "#aa0000"})
    }
    static is_transparent(){return true}
    static get_graphics(){return graphics_laser_beam}
}

class LootGraphicsComponent extends GraphicsComponent {
    static draw(){
	var params = {
	    fillColor: "#ffaaaa"
	}
	graphics.draw("triangle", params)
    }
}

class WeaponGraphicsComponent extends GraphicsComponent {
    static draw(){
	var params = {
	    fillColor: "#dddddd"
	}
	graphics.draw("rect", params)
    }
}


class ShieldGraphicsComponent extends GraphicsComponent {
    static draw(entity){
	if(entity.health > 0){
	    var params = {
		fillColor: "#0000ff",
		alpha: 0.2*entity.health/entity.max_health+0.1
	    }
	    graphics.draw("circle", params)
	}
    }
    static is_transparent(){return true}
}


class PointerGraphicsComponent extends GraphicsComponent {
    static draw(){
	graphics.draw("circle")
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
    static draw(){
	graphics_light.draw("large_rect", {fillColor: "#ff8866"})
    }
    static is_transparent(){ return true }
    static get_graphics(){ return graphics_light }
}

class Circle extends GraphicsComponent {
    static draw(){
	graphics.draw("circle")
    }
}

class Rect extends GraphicsComponent {
    static draw(){
	graphics.draw("rect")
    }
    static is_transparent(){return true}
}

class LightCircle extends GraphicsComponent {
    constructor(entity){
	super(entity)
	this.transparent = true
	this.graphics = graphics_light
    }
    draw(){
	this.graphics.draw("large_rect")
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
    fading_particle: DebugStatic,
    circle: Circle,
    light_circle: LightCircle,
    laser_beam: LaserBeam,
    debug: Rect
}
