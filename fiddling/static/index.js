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
socket.on("state", function(state){
    global_state = state
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
	console.log("FPS: ", 1000/mean_dt)
	last_dt = []
    }
}

function loop(timestamp) {
    var dt = timestamp - lastRender;

    fps(dt)
    if(!(global_state === undefined)){
	draw(global_state)
    }

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
