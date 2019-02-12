import { Game } from './game.js'
import { gl } from "./graphics/gl.js"

var user_id = "user_" + String(Math.round(Math.random()*100))

export var socket = io.connect("http://"+document.domain+":"+location.port)
socket.on("connect", function(){
    socket.emit("connection", {data: "connected", user_id: user_id})
})
socket.on("ping", function(){
    console.log("pingged!")
})

export var c = document.getElementById("c");
export var ctx = c.getContext("2d");

var game = new Game(ctx)

function loop(timestamp) {
    var dt = timestamp - lastRender;

    game.update(dt);
    //game.draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
