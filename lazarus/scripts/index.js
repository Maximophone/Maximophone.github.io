var c = document.getElementById("c");
var ctx = c.getContext("2d");
ctx.transform(1, 0, 0, -1, 0, c.height)
ctx.lineWidth = 0.1;

// utils

function translate(context, x, y){
  context.transform(1, 0, 0, 1, x, y)
}

function scale(context, sx, sy){
  context.transform(sx, 0, 0, sy, 0, 0)
}

function rotate(context, theta){
  context.transform(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta), 0, 0)
}

function garbage_filter(list, filter){
  to_delete = []
  for(i=0; i<list.length; i++){
    if(filter(list[i])){
      to_delete.push(i)
    }
  }
  for(var i of to_delete.reverse()){
    list.splice(i, 1)
  }
}

// User input
_pressed_keys = []
class UserInputs {
  static pressed_keys(){return _pressed_keys}
  static pressed_key(k){return Boolean(_pressed_keys[k])}
  static press_key(k){
    _pressed_keys[k.keyCode] = true
  }
  static release_key(k){
    _pressed_keys[k.keyCode] = false
  }
}
addEventListener("keydown", UserInputs.press_key, false);
addEventListener("keyup", UserInputs.release_key, true);
var KeyCodes = Object.freeze({
  SPACE: 32,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
})
var GameKeys = Object.freeze({
  FIRE: KeyCodes.SPACE,
  ACCELERATE: KeyCodes.W,
  DECCELERATE: KeyCodes.S,
  TURN_CW: KeyCodes.D,
  TURN_ACW: KeyCodes.A,
  ZOOM_IN: KeyCodes.UP,
  ZOOM_OUT: KeyCodes.DOWN
})

// Systems
class CollisionSystem{
  constructor(){
    this.colliders = []
  }
  get_circle_collider(entity, r){
    var circle_collider = new CircleColliderComponent(entity, r)
    this.colliders.push(circle_collider)
    return circle_collider
  }
  update(){
    // clean up
    for(var collider of this.colliders){
      collider.colliding_with = []
      collider.is_colliding = false
    }
    garbage_filter(this.colliders, item => item.entity.lifetime < 0)
    
    for(var i = 0; i<this.colliders.length; i++){
      for(var j = i+1; j<this.colliders.length; j++){
        var collider1 = this.colliders[i]
        var collider2 = this.colliders[j]
        if(collider1.collides_with(collider2)){
          collider1.is_colliding = true
          collider2.is_colliding = true
          collider1.colliding_with.push(collider2)
          collider2.colliding_with.push(collider1)
        }
      }
    }
  }
}

collision_system = new CollisionSystem()

// Components 

class GraphicsComponent {
}

class MapGraphicsComponent extends GraphicsComponent {
  draw(map, ctx){
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

class ShipGraphicsComponent extends GraphicsComponent {
  draw(ship, ctx){
    var MODEL_RADIUS = 1
    var buff_strokeStyle = ctx.strokeStyle
    if(ship.collider_component.is_colliding){
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

class BulletGraphicsComponent extends GraphicsComponent {
  draw(bullet, ctx){
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, 2*Math.PI)
    ctx.stroke()
  }
}

class LootGraphicsComponent extends GraphicsComponent {
  draw(loot, ctx){
    var buff_strokeStyle = ctx.strokeStyle
    ctx.strokeStyle = "#aaaa00"
    ctx.beginPath()
    ctx.arc(0, 0, loot.size, 0, 2*Math.PI)
    ctx.stroke()
    ctx.strokeStyle = buff_strokeStyle
  }
}

class WeaponGraphicsComponent extends GraphicsComponent {
  draw(weapon, ctx){
    var MODEL_SIZE = 1
    ctx.beginPath()
    ctx.rect(-0.75*MODEL_SIZE, -0.1*MODEL_SIZE, 1.5*MODEL_SIZE, 0.2*MODEL_SIZE)
    ctx.stroke()
  }
}

class ColliderComponent{
  constructor(entity){
    this.entity = entity
    this.is_colliding = false
    this.colliding_with = []
  }
}

class CircleColliderComponent extends ColliderComponent {
  constructor(entity, r){
    super(entity)
    this.radius = r
    this.type = "circle"
  }
  collides_with(collider){
    switch(collider.type){
      case "circle":
        // TODO: careful, only works for entities with no parent ATM
        return Math.sqrt((this.entity.x-collider.entity.x)**2 + (this.entity.y-collider.entity.y)**2) < this.entity.size*this.radius + collider.entity.size*collider.radius
        break
    }
  }
}

class PhysicsComponent {
  update(obj, world, dt){
    obj.x += obj.v_dir*Math.cos(obj.rot)
    obj.y += obj.v_dir*Math.sin(obj.rot)
    obj.rot += obj.v_rot
  }
}

class ShipPhysicsComponent {
  update(ship, world, dt){
    if(ship.engine.accelerate){
      ship.v_dir = Math.min(ship.v_dir+dt*ship.engine.delta_v, ship.engine.max_v)
    } else if (ship.engine.deccelerate){
      ship.v_dir = Math.max(ship.v_dir-dt*ship.engine.delta_v, -ship.engine.max_v)
    } else {
      if(ship.v_dir > 0){
        ship.v_dir = Math.max(ship.v_dir-dt*V_FRICTION, 0)
      } else {
        ship.v_dir = Math.min(ship.v_dir+dt*V_FRICTION, 0)
      }
    }
    if(ship.engine.turn_acw){
      ship.v_rot = Math.min(ship.v_rot+dt*ship.engine.delta_v_rot, ship.engine.max_v_rot)
    } else if (ship.engine.turn_cw){
      ship.v_rot = Math.max(ship.v_rot-dt*ship.engine.delta_v_rot, -ship.engine.max_v_rot)
    } else {
      if(ship.v_rot > 0){
        ship.v_rot = Math.max(ship.v_rot-dt*V_FRICTION_ROT, 0)
      } else {
        ship.v_rot = Math.min(ship.v_rot+dt*V_FRICTION_ROT, 0)
      }
    }
    ship.x += ship.v_dir*Math.cos(ship.rot)
    ship.y += ship.v_dir*Math.sin(ship.rot)
    ship.rot += ship.v_rot
  }
}

class InputComponent {
}

class AIInputComponent extends InputComponent {
  constructor(){
    super()
  }
  update(ship, world, dt){
    
  }
}

class PlayerInputEngineComponent extends InputComponent {
  update(engine, world, dt){
    if(UserInputs.pressed_key(GameKeys.ACCELERATE)){
      engine.accelerate = true
      engine.deccelerate = false
    } else if (UserInputs.pressed_key(GameKeys.DECCELERATE)){
      engine.deccelerate = true
      engine.accelerate = false
    } else {
      engine.accelerate = false
      engine.deccelerate = false
    }
    if(UserInputs.pressed_key(GameKeys.TURN_CW)){
      engine.turn_cw = true
      engine.turn_acw = false
    } else if(UserInputs.pressed_key(GameKeys.TURN_ACW)){
      engine.turn_cw = false
      engine.turn_acw = true
    } else {
      engine.turn_cw = false
      engine.turn_acw = false
    }
    
  }
}

class PlayerInputWeaponComponent extends InputComponent {
  update(weapon, world, dt){
    if(UserInputs.pressed_key(GameKeys.FIRE)){
      weapon.firing = true
    } else {
      weapon.firing = false
    }
  }
}

class PlayerInputDebugComponent extends InputComponent {
  update(ship, world, dt){
    if(UserInputs.pressed_key(KeyCodes.LEFT)){
      ship.size*=1.1
    }
    if(UserInputs.pressed_key(KeyCodes.RIGHT)){
      ship.size*=0.9
    }
  }
}

// Camera

class Camera{
  constructor(x, y, scale, target){
    this.x = x
    this.y = y
    this.scale = scale
    this.target = target
  }
  update(dt){
    if(UserInputs.pressed_key(GameKeys.ZOOM_IN)){
      this.scale*=0.99
    } else if(UserInputs.pressed_key(GameKeys.ZOOM_OUT)){
      this.scale*=1.01
    }
    this.x = this.target.x - c.width/2*this.scale
    this.y = this.target.y - c.height/2*this.scale
  }
}

// Game entities

class World {
  constructor(){
    this.map = new Map()
    this.entities = []
    
    var engine = new Engine(10, 0.01, 0.05, 0.01)
    var player = new Ship(1, 100, 100, 0, 20, engine)
    var weapon1 = new Cannon(player, 1, 0.5, 0.1, 50, 5)
    var weapon2 = new Cannon(player, 1, -0.5, -0.1, 50, 5)
    player.weapons.push(weapon1, weapon2)
    this.entities.push(player, engine, weapon1, weapon2)
    
    for(var i = 0; i<10; i++){
      var x = Math.random()*1000
      var y = Math.random()*1000
      var engine = new Engine(10, 0.01, 0.05, 0.01, true)
      var ai = new Ship(2, x, y, 0, 17, engine, [])
      var cannon = new Cannon(ai, 1, 0, 0, 50, 5, true)
      ai.weapons.push(cannon)
      this.entities.push(ai, engine, cannon)
    }
    this.camera = new Camera(0, 0, 1.5, player)
  }
  update(dt){
    collision_system.update()
    for(var entity of this.entities){
      if(entity.update){
        entity.update(this, dt)
      }
    }
    garbage_filter(this.entities, item => item.lifetime<0)
    this.camera.update()
  }
  draw(ctx){
    ctx.clearRect(0, 0, c.width, c.height);
    this.draw_entity(ctx, this.map)
    for(var entity of this.entities){
      this.draw_entity(ctx, entity)
    }
  }
  draw_entity(ctx, entity){
    if(entity.graphics_component){
      var parents_chain = [entity]
      while(entity.parent){
        entity = entity.parent
        parents_chain.push(entity)
      }
      ctx.transform(1/this.camera.scale, 0, 0, 1/this.camera.scale, 0, 0)
      ctx.transform(1, 0, 0, 1, -this.camera.x, -this.camera.y)
      for(var entity of parents_chain.reverse()){
        ctx.transform(1, 0, 0, 1, entity.x, entity.y)
        rotate(ctx, entity.rot)
        var size = entity.size || 1
        ctx.transform(size, 0, 0, size, 0, 0)
      }
      entity.graphics_component.draw(entity, ctx)
      for(var entity of parents_chain.reverse()){
        var size = entity.size || 1
        ctx.transform(1/size, 0, 0, 1/size, 0, 0)
        rotate(ctx, -entity.rot)
        ctx.transform(1, 0, 0, 1, -entity.x, -entity.y)
      }
      ctx.transform(1, 0, 0, 1, this.camera.x, this.camera.y)
      ctx.transform(this.camera.scale, 0, 0, this.camera.scale, 0, 0)
    }
  }
}

class Map {
  constructor(){
    this.x = 0
    this.y = 0
    this.rot = 0
    this.graphics_component = new MapGraphicsComponent()
  }
}

class Bullet {
  constructor(id, x, y, rot, v, size=2){
    this.type = "bullet"
    this.id = id
    this.x = x
    this.y = y
    this.rot = rot
    this.v_dir = v
    this.v_rot = 0
    this.size = size
    this.lifetime = 5000
    this.physics_component = new PhysicsComponent()
    this.graphics_component = new BulletGraphicsComponent()
    this.collider_component = collision_system.get_circle_collider(this, 1)
  }
  update(world, dt){
    this.physics_component.update(this, world, dt)
    this.lifetime -= dt
    if(this.collider_component.is_colliding){
      var colliding_with_ennemy = false
      for(var collider of this.collider_component.colliding_with){
        if(collider.entity.id & (collider.entity.id != this.id)){
          colliding_with_ennemy = true
        }
      }
      if(colliding_with_ennemy){ 
        this.lifetime = -1
      }
    }
  }
}

class Loot {
  constructor(x, y, rot, v, size=3){
    this.type = "loot"
    this.x = x
    this.y = y
    this.rot = rot
    this.v_dir = v
    this.v_rot = 0
    this.size = size
    this.lifetime = 5000+Math.random()*5000
    
    this.graphics_component = new LootGraphicsComponent()
    this.collider_component = collision_system.get_circle_collider(this, 1)
    this.physics_component = new PhysicsComponent()
  }
  update(world, dt){
    this.physics_component.update(this, world, dt)
    this.lifetime -= dt
  }
}

class Weapon {
  constructor(ship, x, y, rot, ai=false){
    this.type = "weapon"
    this.x = x
    this.y = y
    this.rot = rot
    this.parent = ship
    this.firing = false
    if(!ai){
      this.input_component = new PlayerInputWeaponComponent()
    } else {
      this.input_component = new AIInputComponent()
    }
    this.graphics_component = new WeaponGraphicsComponent()
  }
}

class Cannon extends Weapon {
  constructor(ship, x, y, rot, firing_rate, bullet_speed, ai=false){
    super(ship, x, y, rot, ai)
    this.firing_rate = firing_rate
    this.bullet_speed = bullet_speed
    this.timer = 0
  }
  update(world, dt){
    this.input_component.update(this, world, dt)
    if(this.firing){
      if(this.timer <= 0){
        var projectile = new Bullet(
          this.parent.id,
          this.parent.x+this.parent.size*this.x*Math.cos(-this.parent.rot)+this.parent.size*this.y*Math.sin(-this.parent.rot), 
          this.parent.y-this.parent.size*this.x*Math.sin(-this.parent.rot)+this.parent.size*this.y*Math.cos(-this.parent.rot),
          this.parent.rot+this.rot, 
          this.parent.v_dir+this.bullet_speed)
        world.entities.push(projectile)
        this.timer = this.firing_rate + this.timer
      } else {
        this.timer -= dt
      }
    }
  }
}

class Engine {
  constructor(max_v, delta_v, max_v_rot, delta_v_rot, ai=false){
    this.type = "engine"
    this.max_v = max_v
    this.delta_v = delta_v
    this.max_v_rot = max_v_rot
    this.delta_v_rot = delta_v_rot
    if(!ai){
      this.input_component = new PlayerInputEngineComponent()
    } else {
      this.input_component = new AIInputComponent()
    }
  }
  update(world, dt){
    this.input_component.update(this, world, dt)
  }
}

V_FRICTION = 0.01
V_FRICTION_ROT = 0.01

class Ship {
  constructor(id, x, y, rot, size, engine, weapons=[]){
    this.type = "ship"
    this.id = id
    this.x = x
    this.y = y
    this.rot = rot
    this.size = size
    this.v_dir = 0
    this.v_rot = 0
    this.health = 100
    this.lifetime = 1
    this.weapons = weapons
    this.engine = engine
    this.physics_component = new ShipPhysicsComponent()
    this.graphics_component = new ShipGraphicsComponent()
    this.collider_component = collision_system.get_circle_collider(this, 1)
    this.input_component = new PlayerInputDebugComponent()
  }
  spawn_loot(world){
    var n_loot = 5
    var v_loot = 0.5
    for(var i = 0; i<n_loot; i++){
      world.entities.push(new Loot(this.x, this.y, Math.random()*2*Math.PI, v_loot))
    }
  }
  update(world, dt){
    this.input_component.update(this, world, dt)
    this.physics_component.update(this, world, dt)
    if(this.collider_component.is_colliding){
      for(var collider of this.collider_component.colliding_with){
        switch(collider.entity.type){
          case "ship":
          case "bullet":
            if(collider.entity.id && (collider.entity.id != this.id)){
              this.health -= dt
            }
            break
          case "loot":
            this.size *= 1.05
            this.health *= 1.05
            collider.entity.lifetime = -1
        }
      }
    }
    if(this.health<=0){
      this.lifetime = -1
      this.engine.lifetime = -1
      for(var weapon of this.weapons){
        weapon.lifetime = -1
      }
      this.spawn_loot(world)
    }
  }
}

world = new World()

function loop(timestamp) {
  var dt = timestamp - lastRender;

  world.update(dt);
  world.draw(ctx);

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
