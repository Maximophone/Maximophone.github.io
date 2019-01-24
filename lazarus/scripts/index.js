import { translate, scale, rotate, garbage_filter } from './utils.js'
import { PhysicsComponent, ShipPhysicsComponent } from './components/physics_components.js'
import { ColliderComponent, CircleColliderComponent } from './components/collider_components.js'
import { AIInputComponent, PlayerInputDebugComponent, PlayerInputEngineComponent, PlayerInputWeaponComponent } from './components/input_components.js'
import { MapGraphicsComponent, ShipGraphicsComponent, BulletGraphicsComponent, LootGraphicsComponent, WeaponGraphicsComponent } from './components/graphics_components.js'
import { UserInputs, GameKeys } from './user_inputs.js'

var c = document.getElementById("c");
var ctx = c.getContext("2d");
ctx.transform(1, 0, 0, -1, 0, c.height)
ctx.lineWidth = 0.1;


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

var collision_system = new CollisionSystem()

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
      var epsilon = 0.01
      if(this.scale<this.target.size/20-epsilon){
	  this.scale+=epsilon
      }
      else if (this.scale>this.target.size/20+epsilon){
	  this.scale-=epsilon
      }
    //this.scale = this.target.size/20
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

var world = new World()

function loop(timestamp) {
  var dt = timestamp - lastRender;

  world.update(dt);
  world.draw(ctx);

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
