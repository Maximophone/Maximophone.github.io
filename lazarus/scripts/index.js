import { World } from './entities/world.js'

var c = document.getElementById("c");
var ctx = c.getContext("2d");
ctx.transform(1, 0, 0, -1, 0, c.height)
ctx.lineWidth = 0.2;
ctx.strokeStyle = "#ffffff"

var world = new World(ctx)

function loop(timestamp) {
    var dt = timestamp - lastRender;

    world.update(dt);
    world.draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
