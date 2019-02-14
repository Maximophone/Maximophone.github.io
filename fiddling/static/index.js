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
socket.on("state", function(state){
    // state = unfold_entities(state)
    draw(state)
})

export var c = document.getElementById("c");
//export var ctx = c.getContext("2d");

//var game = new Game(ctx)

function draw(state){
    var user = state.users[user_sid]
    if(user && user.camera){
	var camera = user.camera
	var entities = state.entities
	painter.draw(camera, entities)
    }
}

function loop(timestamp) {
    var dt = timestamp - lastRender;

    //game.update(dt);
    //game.draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
