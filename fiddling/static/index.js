import { Game } from './game.js'
import { gl } from "./graphics/gl.js"
import { painter } from "./drawing.js"

export var user_sid

export var socket = io.connect("http://"+document.domain+":"+location.port)
socket.on("connect", function(){
    socket.emit("connection", {data: "connected"}, function(sid){
	user_sid = sid
    })
})
socket.on("ping", function(){
    console.log("pinged!")
})

var global_state
var prev_t
var new_t
var state_dt

function fps_gen(name){
    var last_dt = []
    function fps(dt){
	var N = 100
	last_dt.push(dt)
	if(last_dt.length >= N){
	    var mean_dt = 0
	    for(var dt of last_dt){
		mean_dt += dt
	    }
	    mean_dt /= N
	    console.log(name, ": ", 1000/mean_dt)
	    last_dt = []
	}
    }
    return fps
}

var fps = fps_gen("FPS")
var sps = fps_gen("SPS")

socket.on("state", function(state){
    global_state = state
    prev_t = new_t
    new_t = new Date().getTime()
    state_dt = new_t - prev_t
    sps(state_dt)
})

export var c = document.getElementById("c");

function draw(state){
    var user = state.users[user_sid]
    if(user && user.camera){
	var camera = user.camera
	var entities = state.entities
	var particles = state.particles
	painter.draw(camera, entities, particles)
    }
}

menu_stack = []

function loop(timestamp) {
    var dt = timestamp - lastRender;

    fps(dt)
    if(menu_stack.length > 0){
	current_menu = menu_stack[menu_stack.length-1]
	current_menu.update()
	current_menu.draw()
    }
	
    if(!(global_state === undefined)){
	draw(global_state)
    }

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
